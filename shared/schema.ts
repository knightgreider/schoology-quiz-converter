import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Question type definitions for the quiz generator
export type QuestionType = "MC" | "TF" | "ES" | "MT";

// Interface for base Question properties
export interface BaseQuestion {
  type: QuestionType;
  question: string;
  hasImage?: boolean;
  imageId?: string; // ID of the image to use (e.g., "photo1", "diagram2")
  imageData?: string; // Base64 encoded image data
  randomize?: boolean; // Whether to randomize answer options (for MC questions)
}

// Multiple choice and True/False questions
export interface ChoiceQuestion extends BaseQuestion {
  type: "MC" | "TF";
  choices: string[];
  answer: number;
  matchItems?: never;
}

// Essay questions
export interface EssayQuestion extends BaseQuestion {
  type: "ES";
  choices: [];
  answer: 0;
  matchItems?: never;
}

// Matching questions
export interface MatchingQuestion extends BaseQuestion {
  type: "MT";
  choices: string[]; // Premises (left side)
  matchItems: string[]; // Responses (right side)
  answer: number[]; // Indices connecting premises to responses
  fillerItems?: string[]; // Extra right-side distractors that don't match any premise
}

// Union type for all question types
export type Question = ChoiceQuestion | EssayQuestion | MatchingQuestion;

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  // Stripe integration fields
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  // Subscription status and tier
  subscriptionStatus: text("subscription_status").default("free"), // free, active, past_due, canceled
  subscriptionTier: text("subscription_tier").default("free"), // free, ai_generator, imscc_converter
  // One-time purchase status
  hasLifetimeAccess: boolean("has_lifetime_access").default(false),
  lifetimeAccessPurchasedAt: timestamp("lifetime_access_purchased_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Quizzes schema
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  randomizeQuestions: boolean("randomize_questions").default(false),
  isPublic: boolean("is_public").default(false),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  userId: true,
  title: true,
  randomizeQuestions: true,
  isPublic: true,
});

// Questions schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id),
  type: text("type").notNull(),
  questionText: text("question_text").notNull(),
  choices: jsonb("choices"),
  answer: jsonb("answer"),
  hasImage: boolean("has_image").default(false),
  imageId: text("image_id"), // ID of the image to use for this question
  imageData: text("image_data"),
  position: integer("position"),
  randomizeChoices: boolean("randomize_choices").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

// Export schema types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type DBQuestion = typeof questions.$inferSelect;

// AI Generation Types and Schemas
export interface AIGenerateOptions {
  questionCount: number;
  questionTypes: QuestionType[];
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  subject?: string;
  includeImages?: boolean;
}

export interface AIGenerateResult {
  aikenText: string;
  questions: Question[];
  extractedText: string;
  processingTime: number;
}

export const aiGenerateOptionsSchema = z.object({
  questionCount: z.number().min(1).max(200), // Increased from 100 to support larger quizzes
  questionTypes: z.array(z.enum(['MC', 'TF', 'ES', 'MT'])).min(1),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
  subject: z.string().optional(),
  includeImages: z.boolean().optional().default(false),
});

export type AIGenerateOptionsInput = z.infer<typeof aiGenerateOptionsSchema>;
