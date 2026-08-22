import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertQuizSchema, aiGenerateOptionsSchema } from "@shared/schema";
import { parseRawInput } from "@shared/parse";
import { generateQuestionsFromText } from "./openai";
import bcrypt from "bcryptjs";
import multer from "multer";
// Use dynamic import for pdf-parse since it has mixed module system

export async function registerRoutes(app: Express): Promise<Server> {
  // API Test route
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });
  
  // User registration
  app.post("/api/user/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          error: "Invalid user data",
          details: result.error.format()
        });
      }
      
      const { username, password, email } = result.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }
      
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email
      });
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to register user" });
    }
  });
  
  // Quiz management endpoints
  app.post("/api/quizzes", async (req, res) => {
    try {
      const userId = 1; // For now, hard-coded user ID (in a production app, this would come from authentication)
      
      const { title, questions, randomizeAllMC } = req.body;
      
      // Create the quiz first
      const quiz = await storage.createQuiz({
        userId,
        title,
        randomizeQuestions: randomizeAllMC || false,
        isPublic: false
      });
      
      // If we have questions, save them
      if (questions && Array.isArray(questions)) {
        const questionsToSave = questions.map((q, index) => ({
          quizId: quiz.id,
          type: q.type,
          questionText: q.question,
          choices: q.choices || [],
          answer: q.answer,
          hasImage: q.hasImage || false,
          imageData: q.imageData || null,
          randomizeChoices: q.randomize || false,
          position: index
        }));
        
        await storage.saveQuizQuestions(quiz.id, questionsToSave);
      }
      
      res.status(201).json({ 
        message: "Quiz saved successfully",
        quiz
      });
    } catch (error) {
      console.error("Error saving quiz:", error);
      res.status(500).json({ error: "Failed to save quiz" });
    }
  });
  
  // Get all quizzes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const userId = 1; // For now, hard-coded user ID
      const quizzes = await storage.getQuizzesByUser(userId);
      res.json({ quizzes });
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });
  
  // Get a single quiz with its questions
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);
      
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      
      const questions = await storage.getQuestionsByQuiz(quizId);
      
      res.json({ quiz, questions });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });
  
  // Delete a quiz
  app.delete("/api/quizzes/:id", async (req, res) => {
    try {
      const quizId = parseInt(req.params.id);
      const deleted = await storage.deleteQuiz(quizId);
      
      if (deleted) {
        res.json({ message: "Quiz deleted successfully" });
      } else {
        res.status(404).json({ error: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ error: "Failed to delete quiz" });
    }
  });

  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'));
      }
    }
  });

  // AI Question Generation endpoint
  app.post("/api/ai/generate-from-pdf", upload.single('pdf'), async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Validate the uploaded file
      if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }

      // Parse the generation options - multer provides strings, need to normalize
      const normalizedBody = {
        questionCount: Number(req.body.questionCount) || 10,
        questionTypes: Array.isArray(req.body.questionTypes) 
          ? req.body.questionTypes 
          : JSON.parse(req.body.questionTypes || '[]'),
        difficulty: req.body.difficulty || 'medium',
        subject: req.body.subject || undefined,
        includeImages: req.body.includeImages === 'true'
      };

      const optionsResult = aiGenerateOptionsSchema.safeParse(normalizedBody);
      if (!optionsResult.success) {
        return res.status(400).json({
          error: "Invalid generation options",
          details: optionsResult.error.format()
        });
      }

      const options = optionsResult.data;
      
      // Extract text from PDF
      let extractedText: string;
      try {
        // Use dynamic import to load pdf-parse in ES module context
        const pdfParser = (await import("pdf-parse")).default;
        const pdfData = await pdfParser(req.file.buffer);
        extractedText = pdfData.text;
        
        if (!extractedText.trim()) {
          return res.status(400).json({ 
            error: "Could not extract text from PDF. The file may be image-based or corrupted." 
          });
        }
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return res.status(400).json({ 
          error: "Failed to parse PDF file. Please ensure it's a valid PDF with extractable text." 
        });
      }

      // Generate questions using OpenAI
      let aikenText: string;
      try {
        aikenText = await generateQuestionsFromText(extractedText, {
          questionCount: options.questionCount,
          questionTypes: options.questionTypes,
          difficulty: options.difficulty,
          subject: options.subject
        });
        
        if (!aikenText.trim()) {
          throw new Error("AI generated empty response");
        }
      } catch (aiError) {
        console.error("AI generation error:", aiError);
        return res.status(500).json({ 
          error: "Failed to generate questions using AI. Please try again." 
        });
      }

      // Parse the generated Aiken text to validate format
      let questions;
      try {
        questions = parseRawInput(aikenText);
        if (questions.length === 0) {
          throw new Error("No valid questions parsed from AI output");
        }
      } catch (parseError) {
        console.error("Parsing error:", parseError);
        return res.status(500).json({ 
          error: "AI generated invalid question format. Please try again with different options." 
        });
      }

      const processingTime = Date.now() - startTime;

      res.json({
        aikenText,
        questions,
        extractedText: extractedText.substring(0, 1000) + (extractedText.length > 1000 ? "..." : ""),
        processingTime
      });

    } catch (error) {
      console.error("Error in AI generation:", error);
      res.status(500).json({ error: "Internal server error during question generation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
