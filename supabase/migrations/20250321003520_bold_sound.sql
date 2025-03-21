/*
  # Create Wardrobe Management Tables

  1. New Tables
    - `clothing_items`: Stores all clothing items
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `image_url` (text)
      - `thumbnail_url` (text)
      - `brand` (text)
      - `size` (text)
      - `color` (text)
      - `material` (text)
      - `purchase_date` (date)
      - `price` (numeric)
      - `care_instructions` (text)
      - `notes` (text)
      - `categories` (text[])
      - `subcategories` (text[])
      - `seasons` (text[])
      - `occasions` (text[])
      - `tags` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `clothing_items` table
    - Add policies for authenticated users to manage their own items
*/

-- Create clothing_items table
CREATE TABLE IF NOT EXISTS clothing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  image_url text NOT NULL,
  thumbnail_url text NOT NULL,
  brand text,
  size text,
  color text,
  material text,
  purchase_date date,
  price numeric,
  care_instructions text,
  notes text,
  categories text[] DEFAULT '{}',
  subcategories text[] DEFAULT '{}',
  seasons text[] DEFAULT '{}',
  occasions text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_clothing_items_user_id ON clothing_items(user_id);
CREATE INDEX idx_clothing_items_categories ON clothing_items USING gin(categories);
CREATE INDEX idx_clothing_items_tags ON clothing_items USING gin(tags);

-- Enable RLS
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own items"
  ON clothing_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON clothing_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON clothing_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON clothing_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);