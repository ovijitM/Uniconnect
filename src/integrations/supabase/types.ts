export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      club_admins: {
        Row: {
          club_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_admins_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_members: {
        Row: {
          club_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          advisors: string[] | null
          affiliation: string | null
          category: string
          community_engagement: string | null
          created_at: string
          description: string
          discord_link: string | null
          established_year: number | null
          executive_members: Json | null
          facebook_link: string | null
          how_to_join: string | null
          id: string
          instagram_link: string | null
          logo_url: string | null
          membership_fee: string | null
          name: string
          phone_number: string | null
          president_contact: string | null
          president_name: string | null
          regular_events: string[] | null
          rejection_reason: string | null
          signature_events: string[] | null
          status: string
          tagline: string | null
          twitter_link: string | null
          updated_at: string
          website: string | null
          who_can_join: string | null
          why_join: string | null
        }
        Insert: {
          advisors?: string[] | null
          affiliation?: string | null
          category: string
          community_engagement?: string | null
          created_at?: string
          description: string
          discord_link?: string | null
          established_year?: number | null
          executive_members?: Json | null
          facebook_link?: string | null
          how_to_join?: string | null
          id?: string
          instagram_link?: string | null
          logo_url?: string | null
          membership_fee?: string | null
          name: string
          phone_number?: string | null
          president_contact?: string | null
          president_name?: string | null
          regular_events?: string[] | null
          rejection_reason?: string | null
          signature_events?: string[] | null
          status?: string
          tagline?: string | null
          twitter_link?: string | null
          updated_at?: string
          website?: string | null
          who_can_join?: string | null
          why_join?: string | null
        }
        Update: {
          advisors?: string[] | null
          affiliation?: string | null
          category?: string
          community_engagement?: string | null
          created_at?: string
          description?: string
          discord_link?: string | null
          established_year?: number | null
          executive_members?: Json | null
          facebook_link?: string | null
          how_to_join?: string | null
          id?: string
          instagram_link?: string | null
          logo_url?: string | null
          membership_fee?: string | null
          name?: string
          phone_number?: string | null
          president_contact?: string | null
          president_name?: string | null
          regular_events?: string[] | null
          rejection_reason?: string | null
          signature_events?: string[] | null
          status?: string
          tagline?: string | null
          twitter_link?: string | null
          updated_at?: string
          website?: string | null
          who_can_join?: string | null
          why_join?: string | null
        }
        Relationships: []
      }
      event_participants: {
        Row: {
          created_at: string
          event_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          additional_perks: string[] | null
          category: string
          club_id: string
          community_link: string | null
          contact_email: string | null
          created_at: string
          date: string
          deliverables: string[] | null
          description: string
          eligibility: string | null
          entry_fee: string | null
          event_hashtag: string | null
          event_type: string
          event_website: string | null
          id: string
          image_url: string | null
          judges: string[] | null
          judging_criteria: string[] | null
          location: string
          max_participants: number | null
          mentors: string[] | null
          online_platform: string | null
          prize_categories: string[] | null
          prize_pool: string | null
          registration_deadline: string | null
          registration_link: string | null
          schedule: Json | null
          sponsors: string[] | null
          status: Database["public"]["Enums"]["event_status"]
          sub_tracks: string[] | null
          submission_platform: string | null
          tagline: string | null
          team_size: string | null
          theme: string | null
          title: string
          updated_at: string
        }
        Insert: {
          additional_perks?: string[] | null
          category: string
          club_id: string
          community_link?: string | null
          contact_email?: string | null
          created_at?: string
          date: string
          deliverables?: string[] | null
          description: string
          eligibility?: string | null
          entry_fee?: string | null
          event_hashtag?: string | null
          event_type?: string
          event_website?: string | null
          id?: string
          image_url?: string | null
          judges?: string[] | null
          judging_criteria?: string[] | null
          location: string
          max_participants?: number | null
          mentors?: string[] | null
          online_platform?: string | null
          prize_categories?: string[] | null
          prize_pool?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          schedule?: Json | null
          sponsors?: string[] | null
          status?: Database["public"]["Enums"]["event_status"]
          sub_tracks?: string[] | null
          submission_platform?: string | null
          tagline?: string | null
          team_size?: string | null
          theme?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          additional_perks?: string[] | null
          category?: string
          club_id?: string
          community_link?: string | null
          contact_email?: string | null
          created_at?: string
          date?: string
          deliverables?: string[] | null
          description?: string
          eligibility?: string | null
          entry_fee?: string | null
          event_hashtag?: string | null
          event_type?: string
          event_website?: string | null
          id?: string
          image_url?: string | null
          judges?: string[] | null
          judging_criteria?: string[] | null
          location?: string
          max_participants?: number | null
          mentors?: string[] | null
          online_platform?: string | null
          prize_categories?: string[] | null
          prize_pool?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          schedule?: Json | null
          sponsors?: string[] | null
          status?: Database["public"]["Enums"]["event_status"]
          sub_tracks?: string[] | null
          submission_platform?: string | null
          tagline?: string | null
          team_size?: string | null
          theme?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          profile_image: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      event_status: "upcoming" | "ongoing" | "past"
      user_role: "student" | "club_admin" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
