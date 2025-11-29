import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { verifyToken } from "./auth";
import { insertAppointmentSchema, insertChatMessageSchema, insertTestimonialSchema, upsertUserSchema, updateAppointmentSchema } from "@shared/schema";
import { z } from "zod";
import { createWebSocketToken, verifyWebSocketToken } from "./utils/jwt";

export async function registerRoutes(app: Express): Promise<Server> {
 

  // Auth routes
  app.get('/api/auth/user', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Generate secure WebSocket token for authenticated users
  app.get('/api/auth/ws-token', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const token = createWebSocketToken({
        userId: user.id,
        role: user.role,
      });
      
      res.json({ token });
    } catch (error) {
      console.error("Error generating WebSocket token:", error);
      res.status(500).json({ message: "Failed to generate WebSocket token" });
    }
  });

  // Appointment routes
  app.post('/api/appointments', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        patientId: userId,
      });
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create appointment" });
    }
  });

  app.get('/api/appointments', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let appointments;
      if (user?.role === 'psychologist') {
        appointments = await storage.getAllAppointments();
      } else {
        appointments = await storage.getAppointmentsByPatient(userId);
      }
      
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.patch('/api/appointments/:id', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Get the user and appointment to check authorization
      const user = await storage.getUser(userId);
      const appointment = await storage.getAppointmentById(id);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      // Authorization: user must own the appointment or be a psychologist
      const isOwner = appointment.patientId === userId;
      const isPsychologist = user?.role === 'psychologist';
      const isAssignedPsychologist = appointment.psychologistId === userId;
      
      if (!isOwner && !isPsychologist && !isAssignedPsychologist) {
        return res.status(403).json({ message: "Access denied - you can only update your own appointments" });
      }
      
      // Validate request body against secure schema (only allow status, notes, duration)
      const validatedUpdates = updateAppointmentSchema.parse(req.body);
      
      const updatedAppointment = await storage.updateAppointment(id, validatedUpdates);
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      console.error("Error updating appointment:", error);
      res.status(500).json({ message: "Failed to update appointment" });
    }
  });

  // Chat routes
  app.get('/api/chat/:otherUserId', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { otherUserId } = req.params;
      const user = await storage.getUser(userId);
      const otherUser = await storage.getUser(otherUserId);
      
      if (!otherUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // CRITICAL SECURITY: Validate chat authorization to prevent IDOR
      // Psychologist can chat with any patient, patients can only chat with psychologists
      if (user?.role === 'patient' && otherUser.role !== 'psychologist') {
        return res.status(403).json({ message: "Patients can only chat with psychologists" });
      }
      
      if (user?.role === 'psychologist' && otherUser.role !== 'patient') {
        return res.status(403).json({ message: "Psychologists can only chat with patients" });
      }
      
      const messages = await storage.getChatMessages(userId, otherUserId);
      
      // Mark messages as read
      await storage.markMessagesAsRead(userId, otherUserId);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Testimonial routes
  app.post('/api/testimonials', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const testimonialData = insertTestimonialSchema.parse({
        ...req.body,
        patientId: userId,
      });
      const testimonial = await storage.createTestimonial(testimonialData);
      res.json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create testimonial" });
    }
  });

  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getPublishedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.get('/api/admin/testimonials', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'psychologist') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching all testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.patch('/api/admin/testimonials/:id', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'psychologist') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const { id } = req.params;
      const updates = req.body;
      const testimonial = await storage.updateTestimonial(id, updates);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  // Patient routes
  app.patch('/api/profile/notes', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { notes } = req.body;
      await storage.updateUserNotes(userId, notes);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating notes:", error);
      res.status(500).json({ message: "Failed to update notes" });
    }
  });

  app.patch('/api/profile', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body against secure schema
      const updateProfileSchema = upsertUserSchema.pick({
        firstName: true,
        lastName: true, 
        phone: true,
        dateOfBirth: true,
        profileImageUrl: true,
        personalNotes: true,
      });
      
      const validatedData = updateProfileSchema.parse(req.body);
      
      // Get current user and merge with validated updates
      const currentUser = await storage.getUser(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.upsertUser({
        ...currentUser,
        ...validatedData,
        id: userId, // Ensure ID cannot be changed
        role: currentUser.role, // Preserve role
        email: currentUser.email, // Preserve email
      });
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data", 
          errors: error.errors 
        });
      }
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Psychologist routes
  app.get('/api/psychologist', async (req, res) => {
    try {
      const psychologist = await storage.getDefaultPsychologist();
      if (!psychologist) {
        return res.status(404).json({ message: "No psychologist found" });
      }
      res.json(psychologist);
    } catch (error) {
      console.error("Error fetching psychologist:", error);
      res.status(500).json({ message: "Failed to fetch psychologist" });
    }
  });

  app.get('/api/admin/patients', verifyToken, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'psychologist') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients:", error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time chat - SECURE JWT IMPLEMENTATION
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws',
    verifyClient: (info: { req: any; origin: string; secure: boolean }) => {
      try {
        // Extract JWT token from query parameters
        const url = new URL(info.req.url!, `http://${info.req.headers.host}`);
        const token = url.searchParams.get('token');
        
        if (!token) {
          console.log('WebSocket connection rejected: No token provided');
          return false;
        }
        
        // Verify JWT token
        try {
          const decoded = verifyWebSocketToken(token);
          if (!decoded.userId) {
            console.log('WebSocket connection rejected: Invalid token payload');
            return false;
          }
          
          // Store verified user info for connection handler
          (info.req as any).verifiedUser = {
            id: decoded.userId,
            role: decoded.role
          };
          return true;
        } catch (jwtError) {
          console.log('WebSocket connection rejected: JWT verification failed', jwtError);
          return false;
        }
      } catch (error) {
        console.error('WebSocket auth error:', error);
        return false;
      }
    }
  });
  
  // Store authenticated WebSocket connections with user IDs
  const authenticatedClients = new Map<string, WebSocket>();
  
  wss.on('connection', async (ws: WebSocket, req) => {
    try {
      const verifiedUser = (req as any).verifiedUser;
      if (!verifiedUser) {
        ws.close(4001, 'Authentication failed');
        return;
      }
      
      // Double-check user exists in database
      const user = await storage.getUser(verifiedUser.id);
      if (!user) {
        ws.close(4001, 'User not found');
        return;
      }
      
      console.log(`Authenticated WebSocket connection for user: ${user.id}`);
      
      // Store authenticated connection
      authenticatedClients.set(user.id, ws);
      (ws as any).userId = user.id;
      
      ws.on('message', async (data) => {
        try {
          const messageData = JSON.parse(data.toString());
          
          if (messageData.type === 'chat_message') {
            // SECURITY: Use authenticated user ID instead of trusting client
            const senderId = user.id; // Server-side user identity
            const receiverId = messageData.receiverId;
            
            if (!receiverId || !messageData.message) {
              ws.send(JSON.stringify({ error: 'Missing required fields' }));
              return;
            }
            
            // Verify receiver exists
            const receiver = await storage.getUser(receiverId);
            if (!receiver) {
              ws.send(JSON.stringify({ error: 'Invalid receiver' }));
              return;
            }
            
            // CRITICAL SECURITY: Validate chat authorization to prevent unauthorized communication
            // Psychologist can chat with any patient, patients can only chat with psychologists
            if (user.role === 'patient' && receiver.role !== 'psychologist') {
              ws.send(JSON.stringify({ error: 'Patients can only chat with psychologists' }));
              ws.close(4003, 'Authorization failed: Invalid chat partner');
              return;
            }
            
            if (user.role === 'psychologist' && receiver.role !== 'patient') {
              ws.send(JSON.stringify({ error: 'Psychologists can only chat with patients' }));
              ws.close(4003, 'Authorization failed: Invalid chat partner');
              return;
            }
            
            // Save message to database with verified sender ID
            const chatMessage = await storage.createChatMessage({
              senderId,
              receiverId,
              message: messageData.message,
            });
            
            // SECURITY: Only send to intended recipients (sender and receiver)
            const messagePayload = JSON.stringify({
              type: 'chat_message',
              data: chatMessage
            });
            
            // Send to sender (confirmation)
            if (authenticatedClients.has(senderId)) {
              const senderWs = authenticatedClients.get(senderId);
              if (senderWs && senderWs.readyState === WebSocket.OPEN) {
                senderWs.send(messagePayload);
              }
            }
            
            // Send to receiver (if connected)
            if (authenticatedClients.has(receiverId)) {
              const receiverWs = authenticatedClients.get(receiverId);
              if (receiverWs && receiverWs.readyState === WebSocket.OPEN) {
                receiverWs.send(messagePayload);
              }
            }
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Message processing failed' }));
        }
      });
      
      ws.on('close', () => {
        console.log(`WebSocket connection closed for user: ${user.id}`);
        authenticatedClients.delete(user.id);
      });
      
    } catch (error) {
      console.error('WebSocket connection error:', error);
      ws.close(4000, 'Connection setup failed');
    }
  });

  return httpServer;
}
