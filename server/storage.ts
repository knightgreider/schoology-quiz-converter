import { db } from './db';
import { eq } from 'drizzle-orm';
import { 
  users, 
  type User, 
  type InsertUser,
  quizzes,
  questions,
  type Quiz,
  type InsertQuiz,
  type DBQuestion,
  type InsertQuestion,
  type Question 
} from "@shared/schema";

// Extend the interface with additional CRUD methods
// for quiz and question management

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quiz operations
  getQuizzesByUser(userId: number): Promise<Quiz[]>;
  getQuiz(quizId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(quizId: number, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined>;
  deleteQuiz(quizId: number): Promise<boolean>;
  
  // Question operations
  getQuestionsByQuiz(quizId: number): Promise<DBQuestion[]>;
  createQuestion(question: InsertQuestion): Promise<DBQuestion>;
  saveQuizQuestions(quizId: number, questions: InsertQuestion[]): Promise<DBQuestion[]>;
  deleteQuestionsByQuiz(quizId: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Quiz operations
  async getQuizzesByUser(userId: number): Promise<Quiz[]> {
    return await db.select().from(quizzes).where(eq(quizzes.userId, userId));
  }
  
  async getQuiz(quizId: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    return quiz;
  }
  
  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }
  
  async updateQuiz(quizId: number, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined> {
    const [updatedQuiz] = await db
      .update(quizzes)
      .set(quiz)
      .where(eq(quizzes.id, quizId))
      .returning();
    return updatedQuiz;
  }
  
  async deleteQuiz(quizId: number): Promise<boolean> {
    // Delete associated questions first due to foreign key constraint
    await this.deleteQuestionsByQuiz(quizId);
    
    // Then delete the quiz
    await db.delete(quizzes).where(eq(quizzes.id, quizId));
    return true;
  }
  
  // Question operations
  async getQuestionsByQuiz(quizId: number): Promise<DBQuestion[]> {
    return await db
      .select()
      .from(questions)
      .where(eq(questions.quizId, quizId))
      .orderBy(questions.position);
  }
  
  async createQuestion(question: InsertQuestion): Promise<DBQuestion> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }
  
  async saveQuizQuestions(quizId: number, questionsList: InsertQuestion[]): Promise<DBQuestion[]> {
    // Delete existing questions first
    await this.deleteQuestionsByQuiz(quizId);
    
    // Insert all new questions with position
    const questionsWithPosition = questionsList.map((q, index) => ({
      ...q,
      quizId,
      position: index
    }));
    
    if (questionsWithPosition.length === 0) return [];
    
    return await db.insert(questions).values(questionsWithPosition).returning();
  }
  
  async deleteQuestionsByQuiz(quizId: number): Promise<boolean> {
    await db.delete(questions).where(eq(questions.quizId, quizId));
    return true;
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
