# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Garden Rosas Decor" is a Portuguese e-commerce website for Maria Rosa's flower and religious articles store. It's a static website showcasing artificial flowers, candles, religious frames, prayer cards, kitchen utensils, religious articles, and vases.

## Development Setup

This is a static website using vanilla HTML, CSS, and JavaScript with no build process required. Files can be opened directly in a browser for development.

**IMPORTANT: Mobile-First Design**
- This website is designed with mobile as the primary focus
- All design decisions, visuals, and animations should prioritize mobile experience
- Desktop is secondary - mobile is the standard

## Commands

This project has no build system or package management. To develop:
- Open `index.html` directly in a web browser
- Use Live Server extension in VS Code for live reload during development
- No installation or build commands required

## Architecture

**File Structure:**
- `index.html` - Main HTML file with all page sections
- `styles.css` - Complete CSS with animations and responsive design
- `script.js` - JavaScript for product management and interactions

**Key Components:**
- **ProductManager Class**: Manages product data using localStorage for persistence
- **Product Data**: Pre-populated with 34+ demo products across 7 categories
- **Categories**: flores, velas, quadros, santinhos, utensilios, artigos, vasos
- **Features**: Search, category filtering, WhatsApp integration for orders

**Data Management:**
- Products stored in localStorage as 'tiarosa_products'
- No database or external API - fully client-side
- Product images use external URLs (placeholder and real product images)

**Layout Sections:**
- Header with navigation
- Hero section with call-to-action
- Products section with search/filter functionality  
- About section with business information
- Contact section with WhatsApp integration

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