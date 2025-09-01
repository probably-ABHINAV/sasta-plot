export interface Plot {
  id: string
  title: string
  description?: string
  price: string
  location: string
  size: string
  size_sqyd?: number
  images?: string[]
  image?: string
  slug?: string
  facing?: string
  approval_type?: string
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  is_admin?: boolean
}

export interface ContactForm {
  name: string
  email: string
  message: string
  plotId?: string
}