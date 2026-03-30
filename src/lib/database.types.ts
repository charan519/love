export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      couples: {
        Row: {
          id: string
          invite_code: string
          partner1_id: string | null
          partner2_id: string | null
          status: string
          created_at: string
          connected_at: string | null
        }
        Insert: {
          id?: string
          invite_code: string
          partner1_id?: string | null
          partner2_id?: string | null
          status?: string
          created_at?: string
          connected_at?: string | null
        }
        Update: {
          id?: string
          invite_code?: string
          partner1_id?: string | null
          partner2_id?: string | null
          status?: string
          created_at?: string
          connected_at?: string | null
        }
      }
      couple_profiles: {
        Row: {
          id: string
          couple_id: string
          partner1_name: string
          partner2_name: string
          partner1_pet_name: string
          partner2_pet_name: string
          partner1_likes: string[]
          partner2_likes: string[]
          partner1_dislikes: string[]
          partner2_dislikes: string[]
          partner1_fav_movies: string[]
          partner2_fav_movies: string[]
          partner1_fav_songs: string[]
          partner2_fav_songs: string[]
          partner1_fav_foods: string[]
          partner2_fav_foods: string[]
          partner1_birthday: string | null
          partner2_birthday: string | null
          first_meeting_date: string | null
          first_date: string | null
          proposal_date: string | null
          anniversary_date: string | null
          relationship_start_date: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          partner1_name?: string
          partner2_name?: string
          partner1_pet_name?: string
          partner2_pet_name?: string
          partner1_likes?: string[]
          partner2_likes?: string[]
          partner1_dislikes?: string[]
          partner2_dislikes?: string[]
          partner1_fav_movies?: string[]
          partner2_fav_movies?: string[]
          partner1_fav_songs?: string[]
          partner2_fav_songs?: string[]
          partner1_fav_foods?: string[]
          partner2_fav_foods?: string[]
          partner1_birthday?: string | null
          partner2_birthday?: string | null
          first_meeting_date?: string | null
          first_date?: string | null
          proposal_date?: string | null
          anniversary_date?: string | null
          relationship_start_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          partner1_name?: string
          partner2_name?: string
          partner1_pet_name?: string
          partner2_pet_name?: string
          partner1_likes?: string[]
          partner2_likes?: string[]
          partner1_dislikes?: string[]
          partner2_dislikes?: string[]
          partner1_fav_movies?: string[]
          partner2_fav_movies?: string[]
          partner1_fav_songs?: string[]
          partner2_fav_songs?: string[]
          partner1_fav_foods?: string[]
          partner2_fav_foods?: string[]
          partner1_birthday?: string | null
          partner2_birthday?: string | null
          first_meeting_date?: string | null
          first_date?: string | null
          proposal_date?: string | null
          anniversary_date?: string | null
          relationship_start_date?: string | null
          updated_at?: string
        }
      }
      games: {
        Row: {
          id: string
          couple_id: string
          game_type: string
          status: string
          current_turn: string | null
          scores: Json
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          couple_id: string
          game_type: string
          status?: string
          current_turn?: string | null
          scores?: Json
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          couple_id?: string
          game_type?: string
          status?: string
          current_turn?: string | null
          scores?: Json
          created_at?: string
          completed_at?: string | null
        }
      }
      game_responses: {
        Row: {
          id: string
          game_id: string
          user_id: string
          question: string
          answer: string
          is_correct: boolean
          points: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          user_id: string
          question: string
          answer: string
          is_correct?: boolean
          points?: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          user_id?: string
          question?: string
          answer?: string
          is_correct?: boolean
          points?: number
          created_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          couple_id: string
          author_id: string
          type: string
          title: string
          content: string
          date: string | null
          is_favorite: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          author_id: string
          type?: string
          title?: string
          content: string
          date?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          author_id?: string
          type?: string
          title?: string
          content?: string
          date?: string | null
          is_favorite?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reminders: {
        Row: {
          id: string
          couple_id: string
          created_by: string
          type: string
          title: string
          message: string
          reminder_date: string
          reminder_time: string | null
          is_recurring: boolean
          recurrence_pattern: string | null
          is_enabled: boolean
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          created_by: string
          type?: string
          title: string
          message?: string
          reminder_date: string
          reminder_time?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          is_enabled?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          created_by?: string
          type?: string
          title?: string
          message?: string
          reminder_date?: string
          reminder_time?: string | null
          is_recurring?: boolean
          recurrence_pattern?: string | null
          is_enabled?: boolean
          created_at?: string
        }
      }
      watchlist: {
        Row: {
          id: string
          couple_id: string
          added_by: string
          movie_title: string
          genre: string
          mood: string | null
          poster_url: string
          description: string
          watched: boolean
          rating: number | null
          watched_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          added_by: string
          movie_title: string
          genre?: string
          mood?: string | null
          poster_url?: string
          description?: string
          watched?: boolean
          rating?: number | null
          watched_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          added_by?: string
          movie_title?: string
          genre?: string
          mood?: string | null
          poster_url?: string
          description?: string
          watched?: boolean
          rating?: number | null
          watched_date?: string | null
          created_at?: string
        }
      }
      movie_preferences: {
        Row: {
          id: string
          couple_id: string
          user_id: string
          favorite_genres: string[]
          preferred_moods: string[]
          favorite_actors: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          user_id: string
          favorite_genres?: string[]
          preferred_moods?: string[]
          favorite_actors?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          user_id?: string
          favorite_genres?: string[]
          preferred_moods?: string[]
          favorite_actors?: string[]
          updated_at?: string
        }
      }
    }
  }
}
