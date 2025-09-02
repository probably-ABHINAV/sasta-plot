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
  description?: string;
  featured: boolean;
  slug: string;
  image?: string;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  plot_id?: string;
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
      created_at: new Date().toISOString(),
    };
    inquiries.unshift(inquiry);
    this.writeData('inquiries', inquiries);
    return inquiry;
  }
}

export const fileStorage = new FileStorage();