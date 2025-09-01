
export interface Plot {
  id: string
  title: string
  location: string
  price: number
  size: number
  description?: string
  featured?: boolean
  slug: string
  image?: string
  images?: string[]
  plot_images?: { url: string }[]
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
