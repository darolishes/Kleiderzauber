/*
  # Initial Schema for Virtual Clothing Try-on App

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text)
      - full_name (text)
      - avatar_url (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - clothing_items
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - name (text)
      - description (text)
      - category (text)
      - fit_preference (text)
      - image_url (text)
      - thumbnail_url (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - outfits
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - name (text)
      - description (text)
      - season (text[])
      - occasion (text)
      - canvas_data (jsonb)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - outfit_items
      - id (uuid, primary key)
      - outfit_id (uuid, foreign key)
      - clothing_item_id (uuid, foreign key)
      - position_x (float)
      - position_y (float)
      - scale (float)
      - rotation (float)
      - z_index (integer)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clothing_items table
CREATE TABLE clothing_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  fit_preference text,
  image_url text NOT NULL,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create outfits table
CREATE TABLE outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  season text[],
  occasion text,
  canvas_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create outfit_items table
CREATE TABLE outfit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id uuid REFERENCES outfits(id) ON DELETE CASCADE NOT NULL,
  clothing_item_id uuid REFERENCES clothing_items(id) ON DELETE CASCADE NOT NULL,
  position_x float NOT NULL DEFAULT 0,
  position_y float NOT NULL DEFAULT 0,
  scale float NOT NULL DEFAULT 1,
  rotation float NOT NULL DEFAULT 0,
  z_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own clothing items"
  ON clothing_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own clothing items"
  ON clothing_items FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own outfits"
  ON outfits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own outfits"
  ON outfits FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own outfit items"
  ON outfit_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM outfits WHERE id = outfit_items.outfit_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage own outfit items"
  ON outfit_items FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM outfits WHERE id = outfit_items.outfit_id AND user_id = auth.uid()
  ));

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clothing_items_updated_at
  BEFORE UPDATE ON clothing_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outfits_updated_at
  BEFORE UPDATE ON outfits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_outfit_items_updated_at
  BEFORE UPDATE ON outfit_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();