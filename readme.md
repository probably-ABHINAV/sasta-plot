# Sasta Plots - Real Estate Platform

## Overview

Sasta Plots is a modern real estate platform focused on making affordable plot ownership accessible to everyday families. The application serves as a marketplace for residential and commercial plots with verified documentation, transparent pricing, and flexible payment options. Built with Next.js 14 and TypeScript, the platform features a clean, user-friendly interface that emphasizes trust and transparency in real estate transactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses Next.js 14 with the App Router architecture for optimal performance and SEO. The frontend is built with React components using TypeScript for type safety and follows a component-based architecture with reusable UI elements.

**Key Frontend Decisions:**
- **Next.js App Router**: Chosen for improved performance, better SEO, and simplified routing compared to the pages router
- **ShadCN/UI Components**: Provides a consistent design system with Radix UI primitives and Tailwind CSS styling
- **Framer Motion**: Implements smooth animations and micro-interactions to enhance user experience
- **Responsive Design**: Mobile-first approach using Tailwind CSS for consistent experience across devices

### Styling and Design System
The application uses a comprehensive design system built on Tailwind CSS with custom CSS variables for theming support.

**Design Decisions:**
- **Tailwind CSS**: Utility-first CSS framework for rapid development and consistent styling
- **CSS Variables**: Enables dynamic theming with light/dark mode support
- **Typography**: Uses Geist Mono, Montserrat, Open Sans, and Inter fonts for visual hierarchy
- **Component Library**: ShadCN/UI provides accessible, customizable components built on Radix UI

### Authentication System
Currently implements a demo authentication system with cookie-based session management for admin access.

**Authentication Features:**
- **Demo Auth**: Simple cookie-based authentication for demonstration purposes
- **Role-Based Access**: Differentiates between admin and regular users
- **Admin Routes Protection**: Middleware protects admin dashboard routes
- **Session Management**: Base64 encoded user data stored in HTTP-only cookies

### Data Management
The application uses a hybrid approach with JSON file storage for demonstration and Supabase integration for scalable data management.

**Data Storage Strategy:**
- **File-Based Storage**: JSON files for plots, inquiries, and blog posts during development
- **Supabase Integration**: Configured for production-ready database management
- **TypeScript Interfaces**: Strong typing for all data structures (Plot, BlogPost, User, etc.)

### API Architecture
RESTful API design using Next.js API routes for data operations and external integrations.

**API Structure:**
- **CRUD Operations**: Full create, read, update, delete functionality for plots and content
- **Inquiry Handling**: Contact form submissions and lead management
- **File Upload**: Image upload capabilities with storage integration
- **Mock Authentication**: Demo auth endpoints for testing admin functionality

### Content Management
The platform includes a custom admin dashboard for content management and analytics.

**Admin Features:**
- **Plot Management**: Create, edit, and manage property listings
- **Blog Management**: Content creation and publishing workflow
- **Inquiry Tracking**: Lead management and customer inquiry handling
- **Analytics Dashboard**: Basic metrics and performance tracking

## External Dependencies

### UI and Styling
- **ShadCN/UI**: Complete component library with accessibility features
- **Radix UI**: Headless UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth transitions
- **Lucide React**: Icon library for consistent iconography

### Database and Backend Services
- **Supabase**: PostgreSQL database with real-time features and authentication
- **Supabase SSR**: Server-side rendering support for Supabase
- **Node.js File System**: Local JSON file storage for development

### Form Handling and Validation
- **React Hook Form**: Form state management and validation
- **Hookform Resolvers**: Integration with validation libraries

### Development and Analytics
- **Vercel Analytics**: Performance monitoring and user analytics
- **TypeScript**: Static type checking for improved code quality
- **Next.js**: React framework with built-in optimizations

### Additional Integrations
- **Nodemailer**: Email functionality for contact forms (types only)
- **SWR**: Data fetching and caching for admin dashboard
- **Class Variance Authority**: Component variant management
- **CLSX**: Conditional class name utility

The application is designed to be easily deployable on Vercel with minimal configuration, leveraging Next.js optimizations for static generation and server-side rendering where appropriate.
