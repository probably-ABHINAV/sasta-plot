export type Plot = {
  _id: string
  title: string
  location: string
  price: number
  sizeSqft: number
  facing?: "East" | "West" | "North" | "South" | "Northeast" | "Northwest" | "Southeast" | "Southwest"
  approvalType?: "DTCP" | "Panchayat" | "CMDA" | "Other"
  isCornerPlot?: boolean
  description?: string
  images: string[]
  mapEmbedUrl?: string
  listedDate?: string
  featured?: boolean // added
}

export type BlogPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  coverImage?: string
  publishedAt?: string
}

export type ApiListResponse<T> = {
  data: T[]
  total?: number
}

export type ApiItemResponse<T> = {
  data: T
}

export type ContactPayload = {
  name: string
  email: string
  message: string
  subject?: string
  plotId?: string
  plotTitle?: string
}
