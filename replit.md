# Payslip Generator Application

## Overview

This is a full-stack web application for generating professional payslips. The application features a React frontend with a modern UI built using shadcn/ui components and Tailwind CSS, and an Express.js backend with TypeScript. Users can input employee and payroll information through a form interface, preview the payslip in real-time, and generate PDF downloads of the completed payslips.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a custom design system featuring CSS variables for theming
- **State Management**: React Hook Form for form handling with Zod schema validation
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **PDF Generation**: html2canvas and jsPDF for converting the payslip preview to downloadable PDFs

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **Data Storage**: Currently using in-memory storage with a storage abstraction layer (IStorage interface) that allows for easy migration to persistent databases
- **API Design**: RESTful endpoints for payslip CRUD operations
- **Validation**: Zod schemas shared between frontend and backend for type safety

### Database Schema
The application uses Drizzle ORM with PostgreSQL configuration, though currently implements in-memory storage:
- **Payslips Table**: Stores employee information, pay periods, earnings, deductions, and metadata
- **Data Types**: Uses JSON strings for complex data like earnings and deductions arrays
- **Validation**: Drizzle-Zod integration for runtime schema validation

### Key Design Patterns
- **Monorepo Structure**: Organized into client/, server/, and shared/ directories
- **Shared Schema**: Common TypeScript types and Zod schemas used across frontend and backend
- **Component Composition**: Modular React components with clear separation of concerns
- **Form-Preview Pattern**: Real-time preview updates as users fill out the payslip form
- **Storage Abstraction**: Interface-based storage layer allowing for different implementations

### Development Workflow
- **Hot Reload**: Vite development server with HMR for frontend changes
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Code Quality**: Shared tsconfig.json with path mapping for clean imports
- **Environment**: Replit-optimized with development banners and error overlays

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives (@radix-ui/*) for accessible component foundations
- **Form Handling**: React Hook Form with Hookform Resolvers for validation integration
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **PDF Generation**: html2canvas and jsPDF for client-side PDF creation
- **Utilities**: clsx and tailwind-merge for conditional styling, date-fns for date manipulation
- **Development**: Vite plugins for React and Replit integration

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect and Neon Database serverless driver
- **Validation**: Zod for runtime type checking and schema validation
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Database Services
- **Primary Database**: PostgreSQL (configured for Neon Database)
- **Session Store**: PostgreSQL-based session storage
- **Migration**: Drizzle Kit for database schema management

### Development Tools
- **Build System**: Vite for frontend bundling, esbuild for backend compilation
- **Type Checking**: TypeScript with strict mode enabled
- **Development Server**: Express with Vite middleware integration for unified development experience