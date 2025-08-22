# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Garden Rosas Decor" is a Portuguese e-commerce website for Maria Rosa's flower and religious articles store. It's a full-stack web application with Node.js backend, MySQL database, and Cloudinary image hosting, showcasing artificial flowers, candles, religious frames, prayer cards, kitchen utensils, religious articles, and vases.

## Development Setup

This is a Node.js application with Express server, MySQL database, and Cloudinary integration.

**IMPORTANT: Mobile-First Design**
- This website is designed with mobile as the primary focus
- All design decisions, visuals, and animations should prioritize mobile experience
- Desktop is secondary - mobile is the standard

## Commands

**Development:**
- `npm start` or `npm run dev` - Start the Express server
- `npm run init-db` - Initialize database tables
- `npm run migrate` - Migrate existing localStorage data to database

**Prerequisites:**
- Node.js >= 16.0.0
- MySQL database
- Cloudinary account for image hosting

## Architecture

**File Structure:**
- `server.js` - Express server with API endpoints
- `database.js` - MySQL database connection and models
- `index.html` - Main HTML file with all page sections
- `styles.css` - Complete CSS with animations and responsive design
- `script.js` - Frontend JavaScript for product display and interactions
- `admin.html` - Admin panel for product management
- `admin.js` - Admin panel JavaScript functionality
- `admin.css` - Admin panel styling
- `auth.js` - Authentication utilities
- `init-database.js` - Database initialization script
- `migrate-data.js` - Data migration from localStorage to MySQL

**Backend Components:**
- **Express Server**: Handles API requests and serves static files
- **MySQL Database**: Stores product data with proper relational structure
- **Cloudinary Integration**: Cloud-based image storage and optimization
- **File Upload**: Multer middleware for handling image uploads
- **CORS**: Cross-origin resource sharing configuration

**Frontend Components:**
- **Product Display**: Dynamic product loading from database via API
- **Admin Panel**: Complete CRUD operations for product management
- **Authentication**: Simple auth system for admin access
- **Image Upload**: Drag-and-drop interface with Cloudinary integration

**Categories**: flores, velas, quadros, santinhos, utensilios, artigos, vasos

**API Endpoints:**
- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/upload` - Upload image to Cloudinary (admin)

**Data Management:**
- Products stored in MySQL database
- Images hosted on Cloudinary with automatic optimization
- Admin authentication for product management
- Data migration support from localStorage to database

**Layout Sections:**
- Header with navigation
- Hero section with call-to-action
- Products section with dynamic loading, search, and filter functionality
- About section with business information
- Contact section with WhatsApp integration
- Admin panel with product management interface

**Styling:**
- Purple/rose color scheme (#8B4A6B primary)
- Gold accents (#FFD700)
- Responsive grid layout
- CSS animations and transitions
- Google Fonts: Playfair Display (headings) and Inter (body)

**Contact Integration:**
- WhatsApp: (87) 9927-5516
- Email: dasilvamariarosa436@gmail.com
- Address: R. Padre Medeiros Nº 70 - Centro - Exu-PE

**Environment Variables Required:**
- `CLOUDINARY_CLOUD_NAME` - dsypayhq4
- `CLOUDINARY_API_KEY` - 251433777928993
- `CLOUDINARY_API_SECRET` - 5WlLVAvqODeMR83NSYLRM9moyiE
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `PORT` - Server port (default: 3000)