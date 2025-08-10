-- Create enum types
CREATE TYPE public.user_role AS ENUM ('player', 'organizer', 'admin');
CREATE TYPE public.game_type AS ENUM ('valorant', 'csgo', 'lol', 'dota2', 'fifa', 'cod', 'apex', 'fortnite');
CREATE TYPE public.tournament_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.match_status AS ENUM ('pending', 'ongoing', 'completed', 'disputed');
CREATE TYPE public.bet_status AS ENUM ('pending', 'accepted', 'completed', 'cancelled', 'disputed');
CREATE TYPE public.payment_method AS ENUM ('mpesa', 'emola');
CREATE TYPE public.transaction_type AS ENUM ('deposit', 'withdrawal', 'bet_placed', 'bet_won', 'bet_lost', 'escrow_hold', 'escrow_release');

-- Users profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  discord_id TEXT,
  phone_number TEXT,
  preferred_games TEXT[] DEFAULT '{}',
  role user_role DEFAULT 'player',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type game_type NOT NULL,
  description TEXT,
  image_url TEXT,
  min_players INTEGER DEFAULT 2,
  max_players INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  game_id UUID REFERENCES public.games(id) NOT NULL,
  organizer_id UUID REFERENCES public.profiles(id) NOT NULL,
  max_participants INTEGER NOT NULL,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  prize_pool DECIMAL(10,2) DEFAULT 0,
  status tournament_status DEFAULT 'upcoming',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  rules TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tournament participants
CREATE TABLE public.tournament_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tournament_id, player_id)
);

-- Matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES public.tournaments(id),
  player1_id UUID REFERENCES public.profiles(id) NOT NULL,
  player2_id UUID REFERENCES public.profiles(id) NOT NULL,
  winner_id UUID REFERENCES public.profiles(id),
  status match_status DEFAULT 'pending',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score_player1 INTEGER DEFAULT 0,
  score_player2 INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1v1 Challenges/Bets table
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id UUID REFERENCES public.profiles(id) NOT NULL,
  challenged_id UUID REFERENCES public.profiles(id),
  game_id UUID REFERENCES public.games(id) NOT NULL,
  bet_amount DECIMAL(10,2) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status bet_status DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  match_id UUID REFERENCES public.matches(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Wallet system
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance DECIMAL(15,2) DEFAULT 0 CHECK (balance >= 0),
  escrow_balance DECIMAL(15,2) DEFAULT 0 CHECK (escrow_balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.wallets(id) NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_method payment_method,
  reference_id TEXT,
  external_transaction_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Chat messages (for tournaments and challenges)
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES public.profiles(id) NOT NULL,
  tournament_id UUID REFERENCES public.tournaments(id),
  challenge_id UUID REFERENCES public.challenges(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leaderboards
CREATE TABLE public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES public.profiles(id) NOT NULL,
  game_id UUID REFERENCES public.games(id) NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  tournaments_won INTEGER DEFAULT 0,
  total_earnings DECIMAL(15,2) DEFAULT 0,
  rating INTEGER DEFAULT 1000,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(player_id, game_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Games (public read)
CREATE POLICY "Games are viewable by everyone" ON public.games FOR SELECT USING (true);

-- Tournaments
CREATE POLICY "Tournaments are viewable by everyone" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Organizers can create tournaments" ON public.tournaments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND (role = 'organizer' OR role = 'admin'))
);
CREATE POLICY "Organizers can update their tournaments" ON public.tournaments FOR UPDATE USING (
  organizer_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Tournament participants
CREATE POLICY "Participants are viewable by everyone" ON public.tournament_participants FOR SELECT USING (true);
CREATE POLICY "Users can register for tournaments" ON public.tournament_participants FOR INSERT WITH CHECK (
  player_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Matches
CREATE POLICY "Matches are viewable by everyone" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Match participants can update scores" ON public.matches FOR UPDATE USING (
  player1_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  player2_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Challenges
CREATE POLICY "Challenges are viewable by everyone" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Users can create challenges" ON public.challenges FOR INSERT WITH CHECK (
  challenger_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Challenge participants can update" ON public.challenges FOR UPDATE USING (
  challenger_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()) OR
  challenged_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update their own wallet" ON public.wallets FOR UPDATE USING (
  user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (
  wallet_id IN (SELECT id FROM public.wallets w JOIN public.profiles p ON w.user_id = p.id WHERE p.user_id = auth.uid())
);

-- Chat messages
CREATE POLICY "Chat messages are viewable by participants" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can send chat messages" ON public.chat_messages FOR INSERT WITH CHECK (
  sender_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Leaderboards
CREATE POLICY "Leaderboards are viewable by everyone" ON public.leaderboards FOR SELECT USING (true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.wallets (user_id)
  VALUES ((SELECT id FROM public.profiles WHERE user_id = NEW.id));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default games
INSERT INTO public.games (name, type, description, min_players, max_players) VALUES
('Valorant', 'valorant', 'Tactical 5v5 shooter by Riot Games', 2, 10),
('CS:GO', 'csgo', 'Counter-Strike: Global Offensive', 2, 10),
('League of Legends', 'lol', 'MOBA by Riot Games', 2, 10),
('FIFA 24', 'fifa', 'Football simulation game', 2, 2),
('Call of Duty', 'cod', 'First-person shooter', 2, 8),
('Apex Legends', 'apex', 'Battle royale shooter', 2, 3),
('Fortnite', 'fortnite', 'Battle royale game', 2, 4),
('Dota 2', 'dota2', 'MOBA by Valve', 2, 10);