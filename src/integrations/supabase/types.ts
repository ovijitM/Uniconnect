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
      club_activity_posts: {
        Row: {
          club_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          club_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          club_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_activity_posts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
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
      club_announcements: {
        Row: {
          club_id: string | null
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          club_id?: string | null
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          club_id?: string | null
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_announcements_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      club_collaborations: {
        Row: {
          created_at: string
          id: string
          requested_club_id: string | null
          requester_club_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_club_id?: string | null
          requester_club_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_club_id?: string | null
          requester_club_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_collaborations_requested_club_id_fkey"
            columns: ["requested_club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_collaborations_requester_club_id_fkey"
            columns: ["requester_club_id"]
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
          document_name: string | null
          document_url: string | null
          established_year: number | null
          executive_members: Json | null
          executive_members_roles: Json | null
          facebook_link: string | null
          faculty_advisors: string[] | null
          how_to_join: string | null
          id: string
          instagram_link: string | null
          logo_url: string | null
          membership_fee: string | null
          name: string
          phone_number: string | null
          president_chair_contact: string | null
          president_chair_name: string | null
          president_contact: string | null
          president_name: string | null
          primary_faculty_advisor: string | null
          regular_events: string[] | null
          rejection_reason: string | null
          signature_events: string[] | null
          status: string
          tagline: string | null
          twitter_link: string | null
          university: string | null
          university_id: string | null
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
          document_name?: string | null
          document_url?: string | null
          established_year?: number | null
          executive_members?: Json | null
          executive_members_roles?: Json | null
          facebook_link?: string | null
          faculty_advisors?: string[] | null
          how_to_join?: string | null
          id?: string
          instagram_link?: string | null
          logo_url?: string | null
          membership_fee?: string | null
          name: string
          phone_number?: string | null
          president_chair_contact?: string | null
          president_chair_name?: string | null
          president_contact?: string | null
          president_name?: string | null
          primary_faculty_advisor?: string | null
          regular_events?: string[] | null
          rejection_reason?: string | null
          signature_events?: string[] | null
          status?: string
          tagline?: string | null
          twitter_link?: string | null
          university?: string | null
          university_id?: string | null
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
          document_name?: string | null
          document_url?: string | null
          established_year?: number | null
          executive_members?: Json | null
          executive_members_roles?: Json | null
          facebook_link?: string | null
          faculty_advisors?: string[] | null
          how_to_join?: string | null
          id?: string
          instagram_link?: string | null
          logo_url?: string | null
          membership_fee?: string | null
          name?: string
          phone_number?: string | null
          president_chair_contact?: string | null
          president_chair_name?: string | null
          president_contact?: string | null
          president_name?: string | null
          primary_faculty_advisor?: string | null
          regular_events?: string[] | null
          rejection_reason?: string | null
          signature_events?: string[] | null
          status?: string
          tagline?: string | null
          twitter_link?: string | null
          university?: string | null
          university_id?: string | null
          updated_at?: string
          website?: string | null
          who_can_join?: string | null
          why_join?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      event_collaborators: {
        Row: {
          club_id: string
          created_at: string
          event_id: string
        }
        Insert: {
          club_id: string
          created_at?: string
          event_id: string
        }
        Update: {
          club_id?: string
          created_at?: string
          event_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_collaborators_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_collaborators_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          checked_in: boolean | null
          checked_in_at: string | null
          created_at: string
          event_id: string
          user_id: string
        }
        Insert: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string
          event_id: string
          user_id: string
        }
        Update: {
          checked_in?: boolean | null
          checked_in_at?: string | null
          created_at?: string
          event_id?: string
          user_id?: string
        }
        Relationships: []
      }
      event_reviews: {
        Row: {
          created_at: string
          event_id: string
          id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          additional_perks: string[] | null
          category: string
          club_id: string | null
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
          status: string
          sub_tracks: string[] | null
          submission_platform: string | null
          tagline: string | null
          team_size: string | null
          theme: string | null
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          additional_perks?: string[] | null
          category: string
          club_id?: string | null
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
          status?: string
          sub_tracks?: string[] | null
          submission_platform?: string | null
          tagline?: string | null
          team_size?: string | null
          theme?: string | null
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          additional_perks?: string[] | null
          category?: string
          club_id?: string | null
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
          status?: string
          sub_tracks?: string[] | null
          submission_platform?: string | null
          tagline?: string | null
          team_size?: string | null
          theme?: string | null
          title?: string
          updated_at?: string
          visibility?: string
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
          university: string | null
          university_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          university?: string | null
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_image?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          university?: string | null
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_event_avg_rating: {
        Args: {
          event_id: string
        }
        Returns: number
      }
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      insert_club: {
        Args: {
          name: string
          description: string
          category: string
          university: string
          university_id: string
          logo_url: string
          club_admin_id: string
        }
        Returns: string
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
