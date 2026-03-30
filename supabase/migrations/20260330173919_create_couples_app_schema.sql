/*
  # Couples App - Complete Database Schema

  ## Overview
  This migration creates the complete database schema for a romantic web application
  designed for long-distance couples to stay connected through shared experiences,
  games, memories, and personalized features.

  ## New Tables

  ### 1. `couples`
  Stores couple pairing information and invite codes
  - `id` (uuid, primary key)
  - `invite_code` (text, unique) - 8-character code for partner invitation
  - `partner1_id` (uuid) - First partner's user ID
  - `partner2_id` (uuid) - Second partner's user ID (null until accepted)
  - `status` (text) - 'pending', 'active', 'inactive'
  - `created_at` (timestamptz)
  - `connected_at` (timestamptz) - When second partner joined

  ### 2. `couple_profiles`
  Stores detailed relationship information and milestones
  - `id` (uuid, primary key)
  - `couple_id` (uuid, foreign key to couples)
  - `partner1_name` (text)
  - `partner2_name` (text)
  - `partner1_pet_name` (text)
  - `partner2_pet_name` (text)
  - `partner1_likes` (text[])
  - `partner2_likes` (text[])
  - `partner1_dislikes` (text[])
  - `partner2_dislikes` (text[])
  - `partner1_fav_movies` (text[])
  - `partner2_fav_movies` (text[])
  - `partner1_fav_songs` (text[])
  - `partner2_fav_songs` (text[])
  - `partner1_fav_foods` (text[])
  - `partner2_fav_foods` (text[])
  - `partner1_birthday` (date)
  - `partner2_birthday` (date)
  - `first_meeting_date` (date)
  - `first_date` (date)
  - `proposal_date` (date)
  - `anniversary_date` (date)
  - `relationship_start_date` (date)
  - `updated_at` (timestamptz)

  ### 3. `games`
  Stores game sessions between couples
  - `id` (uuid, primary key)
  - `couple_id` (uuid, foreign key to couples)
  - `game_type` (text) - 'who_knows_better', 'truth_or_dare', 'guess_favorite'
  - `status` (text) - 'active', 'completed'
  - `current_turn` (uuid) - User ID of current player
  - `scores` (jsonb) - Scores for each partner
  - `created_at` (timestamptz)
  - `completed_at` (timestamptz)

  ### 4. `game_responses`
  Stores individual responses in games
  - `id` (uuid, primary key)
  - `game_id` (uuid, foreign key to games)
  - `user_id` (uuid, foreign key to auth.users)
  - `question` (text)
  - `answer` (text)
  - `is_correct` (boolean)
  - `points` (integer)
  - `created_at` (timestamptz)

  ### 5. `memories`
  Stores notes, love letters, and special memories
  - `id` (uuid, primary key)
  - `couple_id` (uuid, foreign key to couples)
  - `author_id` (uuid, foreign key to auth.users)
  - `type` (text) - 'note', 'letter', 'memory'
  - `title` (text)
  - `content` (text)
  - `date` (date) - Date associated with memory
  - `is_favorite` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. `reminders`
  Stores reminders and notifications for special occasions
  - `id` (uuid, primary key)
  - `couple_id` (uuid, foreign key to couples)
  - `created_by` (uuid, foreign key to auth.users)
  - `type` (text) - 'daily_prompt', 'anniversary', 'birthday', 'custom'
  - `title` (text)
  - `message` (text)
  - `reminder_date` (date)
  - `reminder_time` (time)
  - `is_recurring` (boolean)
  - `recurrence_pattern` (text) - 'daily', 'weekly', 'monthly', 'yearly'
  - `is_enabled` (boolean)
  - `created_at` (timestamptz)

  ### 7. `watchlist`
  Stores movies to watch together
  - `id` (uuid, primary key)
  - `couple_id` (uuid, foreign key to couples)
  - `added_by` (uuid, foreign key to auth.users)
  - `movie_title` (text)
  - `genre` (text)
  - `mood` (text) - 'romantic', 'comedy', 'emotional', 'action', 'thriller'
  - `poster_url` (text)
  - `description` (text)
  - `watched` (boolean)
  - `rating` (integer) - 1-5 stars
  - `watched_date` (date)
  - `created_at` (timestamptz)

  ### 8. `movie_preferences`
  Stores movie preferences for recommendations
  - `id` (uuid, primary key)
  - `couple_id` (uuid, foreign key to couples)
  - `user_id` (uuid, foreign key to auth.users)
  - `favorite_genres` (text[])
  - `preferred_moods` (text[])
  - `favorite_actors` (text[])
  - `updated_at` (timestamptz)

  ## Security
  All tables have RLS enabled with appropriate policies for:
  - Couple members can view and edit their couple data
  - Only authenticated users can access their own couple's information
  - Proper validation and ownership checks on all operations
*/

-- Create couples table
CREATE TABLE IF NOT EXISTS couples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code text UNIQUE NOT NULL,
  partner1_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  partner2_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  connected_at timestamptz
);

-- Create couple_profiles table
CREATE TABLE IF NOT EXISTS couple_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE UNIQUE,
  partner1_name text DEFAULT '',
  partner2_name text DEFAULT '',
  partner1_pet_name text DEFAULT '',
  partner2_pet_name text DEFAULT '',
  partner1_likes text[] DEFAULT '{}',
  partner2_likes text[] DEFAULT '{}',
  partner1_dislikes text[] DEFAULT '{}',
  partner2_dislikes text[] DEFAULT '{}',
  partner1_fav_movies text[] DEFAULT '{}',
  partner2_fav_movies text[] DEFAULT '{}',
  partner1_fav_songs text[] DEFAULT '{}',
  partner2_fav_songs text[] DEFAULT '{}',
  partner1_fav_foods text[] DEFAULT '{}',
  partner2_fav_foods text[] DEFAULT '{}',
  partner1_birthday date,
  partner2_birthday date,
  first_meeting_date date,
  first_date date,
  proposal_date date,
  anniversary_date date,
  relationship_start_date date,
  updated_at timestamptz DEFAULT now()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  game_type text NOT NULL CHECK (game_type IN ('who_knows_better', 'truth_or_dare', 'guess_favorite', 'love_quiz')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  current_turn uuid REFERENCES auth.users(id),
  scores jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create game_responses table
CREATE TABLE IF NOT EXISTS game_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  is_correct boolean DEFAULT false,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create memories table
CREATE TABLE IF NOT EXISTS memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text DEFAULT 'note' CHECK (type IN ('note', 'letter', 'memory')),
  title text DEFAULT '',
  content text NOT NULL,
  date date,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text DEFAULT 'custom' CHECK (type IN ('daily_prompt', 'anniversary', 'birthday', 'custom')),
  title text NOT NULL,
  message text DEFAULT '',
  reminder_date date NOT NULL,
  reminder_time time,
  is_recurring boolean DEFAULT false,
  recurrence_pattern text CHECK (recurrence_pattern IN ('daily', 'weekly', 'monthly', 'yearly', NULL)),
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  added_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_title text NOT NULL,
  genre text DEFAULT '',
  mood text CHECK (mood IN ('romantic', 'comedy', 'emotional', 'action', 'thriller', 'drama', 'horror', NULL)),
  poster_url text DEFAULT '',
  description text DEFAULT '',
  watched boolean DEFAULT false,
  rating integer CHECK (rating >= 1 AND rating <= 5 OR rating IS NULL),
  watched_date date,
  created_at timestamptz DEFAULT now()
);

-- Create movie_preferences table
CREATE TABLE IF NOT EXISTS movie_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES couples(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_genres text[] DEFAULT '{}',
  preferred_moods text[] DEFAULT '{}',
  favorite_actors text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  UNIQUE(couple_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for couples table
CREATE POLICY "Users can view their own couple"
  ON couples FOR SELECT
  TO authenticated
  USING (auth.uid() = partner1_id OR auth.uid() = partner2_id);

CREATE POLICY "Users can create a couple"
  ON couples FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = partner1_id);

CREATE POLICY "Users can update their own couple"
  ON couples FOR UPDATE
  TO authenticated
  USING (auth.uid() = partner1_id OR auth.uid() = partner2_id)
  WITH CHECK (auth.uid() = partner1_id OR auth.uid() = partner2_id);

-- RLS Policies for couple_profiles table
CREATE POLICY "Couple members can view their profile"
  ON couple_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = couple_profiles.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can insert their profile"
  ON couple_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = couple_profiles.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can update their profile"
  ON couple_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = couple_profiles.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = couple_profiles.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

-- RLS Policies for games table
CREATE POLICY "Couple members can view their games"
  ON games FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = games.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can create games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = games.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can update their games"
  ON games FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = games.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = games.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

-- RLS Policies for game_responses table
CREATE POLICY "Couple members can view game responses"
  ON game_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM games
      JOIN couples ON couples.id = games.couple_id
      WHERE games.id = game_responses.game_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Users can create their own game responses"
  ON game_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for memories table
CREATE POLICY "Couple members can view their memories"
  ON memories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = memories.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can create memories"
  ON memories FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = memories.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can update their memories"
  ON memories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = memories.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = memories.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Authors can delete their own memories"
  ON memories FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for reminders table
CREATE POLICY "Couple members can view their reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = reminders.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can create reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = reminders.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can update reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = reminders.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = reminders.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Creators can delete their own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for watchlist table
CREATE POLICY "Couple members can view their watchlist"
  ON watchlist FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = watchlist.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can add to watchlist"
  ON watchlist FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = added_by AND
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = watchlist.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Couple members can update watchlist"
  ON watchlist FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = watchlist.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = watchlist.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Adders can delete their own watchlist items"
  ON watchlist FOR DELETE
  TO authenticated
  USING (auth.uid() = added_by);

-- RLS Policies for movie_preferences table
CREATE POLICY "Couple members can view movie preferences"
  ON movie_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = movie_preferences.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Users can create their own movie preferences"
  ON movie_preferences FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM couples
      WHERE couples.id = movie_preferences.couple_id
      AND (couples.partner1_id = auth.uid() OR couples.partner2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own movie preferences"
  ON movie_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_couples_partner1 ON couples(partner1_id);
CREATE INDEX IF NOT EXISTS idx_couples_partner2 ON couples(partner2_id);
CREATE INDEX IF NOT EXISTS idx_couples_invite_code ON couples(invite_code);
CREATE INDEX IF NOT EXISTS idx_couple_profiles_couple_id ON couple_profiles(couple_id);
CREATE INDEX IF NOT EXISTS idx_games_couple_id ON games(couple_id);
CREATE INDEX IF NOT EXISTS idx_game_responses_game_id ON game_responses(game_id);
CREATE INDEX IF NOT EXISTS idx_memories_couple_id ON memories(couple_id);
CREATE INDEX IF NOT EXISTS idx_reminders_couple_id ON reminders(couple_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_couple_id ON watchlist(couple_id);
CREATE INDEX IF NOT EXISTS idx_movie_preferences_couple_id ON movie_preferences(couple_id);

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i integer;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;