
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface Plot {
  id: number;
  title: string;
  location: string;
  price: number;
  size_sqyd: number;
  size_unit?: string;
  description?: string;
  featured: boolean;
  slug: string;
  image?: string;
  images?: string[];
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  plot_id?: string;
  status: 'pending' | 'seen' | 'responded' | 'closed';
  created_at: string;
  updated_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  author?: string;
  created_at: string;
}

class FileStorage {
  private getFilePath(collection: string): string {
    return path.join(DATA_DIR, `${collection}.json`);
  }

  private readData<T>(collection: string): T[] {
    const filePath = this.getFilePath(collection);
    try {
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  private writeData<T>(collection: string, data: T[]): void {
    const filePath = this.getFilePath(collection);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
    }
  }

  // Plot operations
  getPlots(): Plot[] {
    return this.readData<Plot>('plots');
  }

  createPlot(plotData: Omit<Plot, 'id' | 'created_at'>): Plot {
    const plots = this.getPlots();
    const id = plots.length > 0 ? Math.max(...plots.map(p => p.id)) + 1 : 1;
    const plot: Plot = {
      ...plotData,
      id,
      created_at: new Date().toISOString(),
    };
    plots.unshift(plot);
    this.writeData('plots', plots);
    return plot;
  }

  deletePlot(slug: string): boolean {
    const plots = this.getPlots();
    const filteredPlots = plots.filter(p => p.slug !== slug);
    if (filteredPlots.length < plots.length) {
      this.writeData('plots', filteredPlots);
      return true;
    }
    return false;
  }

  // Inquiry operations
  getInquiries(): Inquiry[] {
    return this.readData<Inquiry>('inquiries');
  }

  createInquiry(inquiryData: Omit<Inquiry, 'id' | 'created_at'>): Inquiry {
    const inquiries = this.getInquiries();
    const id = (inquiries.length + 1).toString();
    const inquiry: Inquiry = {
      ...inquiryData,
      id,
      status: inquiryData.status || 'pending',
      created_at: new Date().toISOString(),
    };
    inquiries.unshift(inquiry);
    this.writeData('inquiries', inquiries);
    return inquiry;
  }

  updateInquiry(id: string, updates: Partial<Inquiry>): Inquiry | null {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex(i => i.id === id);
    if (index === -1) return null;
    
    const updatedInquiry = {
      ...inquiries[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    inquiries[index] = updatedInquiry;
    this.writeData('inquiries', inquiries);
    return updatedInquiry;
  }

  deleteInquiry(id: string): boolean {
    const inquiries = this.getInquiries();
    const filteredInquiries = inquiries.filter(i => i.id !== id);
    if (filteredInquiries.length < inquiries.length) {
      this.writeData('inquiries', filteredInquiries);
      return true;
    }
    return false;
  }

  // Blog operations
  getBlogPosts(): BlogPost[] {
    try {
      // Try to get from file storage first
      const posts = this.readData<BlogPost>('blog');
      if (posts.length > 0) {
        return posts;
      }
      
      // Fallback to JSON data if no posts in file storage
      const blogDataPath = path.join(process.cwd(), 'data', 'blog.json');
      if (fs.existsSync(blogDataPath)) {
        const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf-8'));
        return blogData.map((post: any) => ({
          ...post,
          id: post.id
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error loading blog posts:', error);
      return [];
    }
  }

  createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at'>): BlogPost {
    const posts = this.getBlogPosts();
    const id = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
    const post: BlogPost = {
      ...postData,
      id,
      created_at: new Date().toISOString(),
    };
    posts.unshift(post);
    this.writeData('blog', posts);
    return post;
  }
}

export const fileStorage = new FileStorage();
