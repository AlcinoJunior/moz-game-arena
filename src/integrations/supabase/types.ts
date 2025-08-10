export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      challenges: {
        Row: {
          bet_amount: number
          challenged_id: string | null
          challenger_id: string
          created_at: string | null
          description: string | null
          expires_at: string
          game_id: string
          id: string
          match_id: string | null
          status: Database["public"]["Enums"]["bet_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          bet_amount: number
          challenged_id?: string | null
          challenger_id: string
          created_at?: string | null
          description?: string | null
          expires_at: string
          game_id: string
          id?: string
          match_id?: string | null
          status?: Database["public"]["Enums"]["bet_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          bet_amount?: number
          challenged_id?: string | null
          challenger_id?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string
          game_id?: string
          id?: string
          match_id?: string | null
          status?: Database["public"]["Enums"]["bet_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_challenged_id_fkey"
            columns: ["challenged_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_challenger_id_fkey"
            columns: ["challenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          challenge_id: string | null
          content: string
          created_at: string | null
          id: string
          sender_id: string
          tournament_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          sender_id: string
          tournament_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string
          tournament_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          max_players: number | null
          min_players: number | null
          name: string
          type: Database["public"]["Enums"]["game_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          max_players?: number | null
          min_players?: number | null
          name: string
          type: Database["public"]["Enums"]["game_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          max_players?: number | null
          min_players?: number | null
          name?: string
          type?: Database["public"]["Enums"]["game_type"]
        }
        Relationships: []
      }
      leaderboards: {
        Row: {
          game_id: string
          id: string
          losses: number | null
          player_id: string
          rating: number | null
          total_earnings: number | null
          tournaments_won: number | null
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          game_id: string
          id?: string
          losses?: number | null
          player_id: string
          rating?: number | null
          total_earnings?: number | null
          tournaments_won?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          game_id?: string
          id?: string
          losses?: number | null
          player_id?: string
          rating?: number | null
          total_earnings?: number | null
          tournaments_won?: number | null
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboards_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboards_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          player1_id: string
          player2_id: string
          scheduled_at: string | null
          score_player1: number | null
          score_player2: number | null
          status: Database["public"]["Enums"]["match_status"] | null
          tournament_id: string | null
          winner_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          player1_id: string
          player2_id: string
          scheduled_at?: string | null
          score_player1?: number | null
          score_player2?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          player1_id?: string
          player2_id?: string
          scheduled_at?: string | null
          score_player1?: number | null
          score_player2?: number | null
          status?: Database["public"]["Enums"]["match_status"] | null
          tournament_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_player1_id_fkey"
            columns: ["player1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_player2_id_fkey"
            columns: ["player2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          discord_id: string | null
          display_name: string | null
          id: string
          is_verified: boolean | null
          location: string | null
          phone_number: string | null
          preferred_games: string[] | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          discord_id?: string | null
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone_number?: string | null
          preferred_games?: string[] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          discord_id?: string | null
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          location?: string | null
          phone_number?: string | null
          preferred_games?: string[] | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          id: string
          player_id: string
          registered_at: string | null
          tournament_id: string
        }
        Insert: {
          id?: string
          player_id: string
          registered_at?: string | null
          tournament_id: string
        }
        Update: {
          id?: string
          player_id?: string
          registered_at?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          entry_fee: number | null
          game_id: string
          id: string
          max_participants: number
          organizer_id: string
          prize_pool: number | null
          registration_deadline: string | null
          rules: string | null
          start_date: string
          status: Database["public"]["Enums"]["tournament_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          game_id: string
          id?: string
          max_participants: number
          organizer_id: string
          prize_pool?: number | null
          registration_deadline?: string | null
          rules?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["tournament_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          game_id?: string
          id?: string
          max_participants?: number
          organizer_id?: string
          prize_pool?: number | null
          registration_deadline?: string | null
          rules?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["tournament_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournaments_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          external_transaction_id: string | null
          id: string
          metadata: Json | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          reference_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          external_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          reference_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          external_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          reference_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          escrow_balance: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          escrow_balance?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          escrow_balance?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      bet_status:
        | "pending"
        | "accepted"
        | "completed"
        | "cancelled"
        | "disputed"
      game_type:
        | "valorant"
        | "csgo"
        | "lol"
        | "dota2"
        | "fifa"
        | "cod"
        | "apex"
        | "fortnite"
      match_status: "pending" | "ongoing" | "completed" | "disputed"
      payment_method: "mpesa" | "emola"
      tournament_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      transaction_type:
        | "deposit"
        | "withdrawal"
        | "bet_placed"
        | "bet_won"
        | "bet_lost"
        | "escrow_hold"
        | "escrow_release"
      user_role: "player" | "organizer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bet_status: ["pending", "accepted", "completed", "cancelled", "disputed"],
      game_type: [
        "valorant",
        "csgo",
        "lol",
        "dota2",
        "fifa",
        "cod",
        "apex",
        "fortnite",
      ],
      match_status: ["pending", "ongoing", "completed", "disputed"],
      payment_method: ["mpesa", "emola"],
      tournament_status: ["upcoming", "ongoing", "completed", "cancelled"],
      transaction_type: [
        "deposit",
        "withdrawal",
        "bet_placed",
        "bet_won",
        "bet_lost",
        "escrow_hold",
        "escrow_release",
      ],
      user_role: ["player", "organizer", "admin"],
    },
  },
} as const
