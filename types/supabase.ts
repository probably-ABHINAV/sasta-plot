export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string
          created_at?: string
        }
      }
      plots: {
        Row: {
          id: number
          title: string
          location: string
          price: number
          size_sqyd: number
          size_unit: string | null
          description: string | null
          featured: boolean | null
          slug: string
          image_url: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          location: string
          price: number
          size_sqyd: number
          size_unit?: string | null
          description?: string | null
          featured?: boolean | null
          slug: string
          image_url?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          location?: string
          price?: number
          size_sqyd?: number
          size_unit?: string | null
          description?: string | null
          featured?: boolean | null
          slug?: string
          image_url?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      plot_images: {
        Row: {
          id: number
          plot_id: number
          url: string
          created_at: string
        }
        Insert: {
          id?: number
          plot_id: number
          url: string
          created_at?: string
        }
        Update: {
          id?: number
          plot_id?: number
          url?: string
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          title: string
          slug: string
          content: string | null
          published: boolean | null
          author: string | null
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          slug: string
          content?: string | null
          published?: boolean | null
          author?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          content?: string | null
          published?: boolean | null
          author?: string | null
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: number
          name: string
          email: string
          phone: string | null
          message: string | null
          plot_id: number | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone?: string | null
          message?: string | null
          plot_id?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string | null
          message?: string | null
          plot_id?: number | null
          created_at?: string
        }
      }
    }
  }
}