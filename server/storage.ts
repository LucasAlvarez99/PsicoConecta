import {
  users,
  appointments,
  chatMessages,
  testimonials,
  type User,
  type UpsertUser,
  type InsertAppointment,
  type Appointment,
  type InsertChatMessage,
  type ChatMessage,
  type InsertTestimonial,
  type Testimonial,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentById(id: string): Promise<Appointment | undefined>;
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByPsychologist(psychologistId: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId1: string, userId2: string): Promise<ChatMessage[]>;
  markMessagesAsRead(receiverId: string, senderId: string): Promise<void>;
  
  // Testimonial operations
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getPublishedTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>;
  updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial>;
  
  // Patient operations
  updateUserNotes(userId: string, notes: string): Promise<void>;
  getAllPatients(): Promise<User[]>;
  
  // Psychologist operations
  getDefaultPsychologist(): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.scheduledAt));
  }

  async getAppointmentsByPsychologist(psychologistId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.psychologistId, psychologistId))
      .orderBy(desc(appointments.scheduledAt));
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .orderBy(desc(appointments.scheduledAt));
  }

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const [updated] = await db
      .update(appointments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getChatMessages(userId1: string, userId2: string): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(
        or(
          and(eq(chatMessages.senderId, userId1), eq(chatMessages.receiverId, userId2)),
          and(eq(chatMessages.senderId, userId2), eq(chatMessages.receiverId, userId1))
        )
      )
      .orderBy(chatMessages.createdAt);
  }

  async markMessagesAsRead(receiverId: string, senderId: string): Promise<void> {
    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(chatMessages.receiverId, receiverId),
          eq(chatMessages.senderId, senderId)
        )
      );
  }

  // Testimonial operations
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }

  async getPublishedTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isPublished, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
    const [updated] = await db
      .update(testimonials)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return updated;
  }

  // Patient operations
  async updateUserNotes(userId: string, notes: string): Promise<void> {
    await db
      .update(users)
      .set({ personalNotes: notes, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async getAllPatients(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.role, "patient"))
      .orderBy(desc(users.createdAt));
  }

  // Psychologist operations
  async getDefaultPsychologist(): Promise<User | undefined> {
    const [psychologist] = await db
      .select()
      .from(users)
      .where(eq(users.role, "psychologist"))
      .limit(1);
    return psychologist;
  }
}

export const storage = new DatabaseStorage();
