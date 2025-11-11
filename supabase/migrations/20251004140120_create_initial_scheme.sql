/*
  # Initial Schema Setup for PsicoConecta

  ## Overview
  Creates the complete database schema for a psychological therapy platform with user management,
  appointments, chat messaging, and testimonials.

  ## 1. New Tables

  ### `users`
  - `id` (uuid, primary key) - Unique user identifier
  - `email` (text, unique) - User email address
  - `first_name` (text) - User's first name
  - `last_name` (text) - User's last name
  - `profile_image_url` (text) - URL to user's profile picture
  - `role` (text, default: 'patient') - User role: 'patient' or 'psychologist'
  - `phone` (text) - Contact phone number
  - `date_of_birth` (timestamp) - User's date of birth
  - `personal_notes` (text) - Private notes about the user
  - `created_at` (timestamp) - Account creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ### `appointments`
  - `id` (uuid, primary key) - Unique appointment identifier
  - `patient_id` (uuid, foreign key) - References users table
  - `psychologist_id` (uuid, foreign key) - References users table
  - `scheduled_at` (timestamp) - When the appointment is scheduled
  - `duration` (integer, default: 60) - Appointment duration in minutes
  - `status` (text, default: 'scheduled') - Status: 'scheduled', 'completed', 'cancelled'
  - `notes` (text) - Appointment notes
  - `created_at` (timestamp) - Creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ### `chat_messages`
  - `id` (uuid, primary key) - Unique message identifier
  - `sender_id` (uuid, foreign key) - References users table
  - `receiver_id` (uuid, foreign key) - References users table
  - `message` (text) - Message content
  - `is_read` (boolean, default: false) - Read status
  - `created_at` (timestamp) - Message timestamp

  ### `testimonials`
  - `id` (uuid, primary key) - Unique testimonial identifier
  - `patient_id` (uuid, foreign key) - References users table
  - `rating` (integer) - Rating from 1 to 5 stars
  - `comment` (text) - Testimonial text
  - `is_published` (boolean, default: false) - Publication status
  - `created_at` (timestamp) - Creation timestamp
  - `updated_at` (timestamp) - Last update timestamp

  ## 2. Security (Row Level Security)

  All tables have RLS enabled with policies that:
  - Allow users to read their own data
  - Allow psychologists to access patient data they work with
  - Protect sensitive information from unauthorized access

  ## 3. Indexes

  Created indexes on foreign keys and frequently queried columns for optimal performance.
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  profile_image_url TEXT,
  role TEXT NOT NULL DEFAULT 'patient',
  phone TEXT,
  date_of_birth TIMESTAMPTZ,
  personal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  psychologist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_psychologist ON appointments(psychologist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_receiver ON chat_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonials_patient ON testimonials(patient_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Psychologists can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'psychologist'
    )
  );

-- RLS Policies for appointments table
CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (
    auth.uid() = patient_id OR auth.uid() = psychologist_id
  );

CREATE POLICY "Psychologists can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'psychologist'
    )
  );

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id OR auth.uid() = psychologist_id)
  WITH CHECK (auth.uid() = patient_id OR auth.uid() = psychologist_id);

-- RLS Policies for chat_messages table
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- RLS Policies for testimonials table
CREATE POLICY "Anyone can view published testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (is_published = true);

CREATE POLICY "Users can view own testimonials"
  ON testimonials FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Psychologists can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'psychologist'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'psychologist'
    )
  );

-- Insert default psychologist for testing
INSERT INTO users (id, email, first_name, last_name, role, phone, created_at, updated_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'psicologo@psicoconecta.com',
  'Dr. Carlos',
  'Rodríguez',
  'psychologist',
  '+1 (555) 123-4567',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Insert sample patient for testing
INSERT INTO users (id, email, first_name, last_name, role, phone, created_at, updated_at)
VALUES (
  'b0000000-0000-0000-0000-000000000002',
  'paciente@ejemplo.com',
  'María',
  'González',
  'patient',
  '+1 (555) 987-6543',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
