![Main](./previews/Mains.png)

# Katcha Chill and Fitness App

## Description
Mobile gym companion app for a local gym client featuring real-time crowd monitoring with gym traffic insights, QR and credit-based check-ins, an integrated store, personal gym usage analytics, and Google OAuth authentication for login.

Built with React, TypeScript, Tailwind CSS, and Supabase.

> Status: Active Development

## Live Demo

🔗 https://katchachillmobile.netlify.app/

> For desktop viewing, use your browser's mobile device emulator (DevTools → Toggle Device Toolbar).

## Features
### User Authentication

- Google OAuth integration using Supabase Auth
- Session persistence and protected routes

### Crowd Monitoring

- Weekly and hourly gym crowd monitoring with data visualization

### Personal Analytics

- Weekly, monthly, and yearly personal gym usage insights and attendance history
- Daily activity minute breakdown with historical data navigation

### Credit System

- Credit-based gym access management
- Credit package browsing and purchase system
- Realtime notifications for purchase approval

### Check-In System

- QR and credit based gym check-in authentication
- One-tap manual check-out workflow
- Automatic credit deduction per gym session

### Store System

- In-app gym merchandise and supplements store
- Product browsing with pricing, descriptions, and stock visibility
- Shopping cart and checkout management system
- Purchase history support

### Product Reviews

- Verified-purchase reviews with ratings, comments, and moderation controls (profanity filtering)

### UI / UX

- Modular and reusable component architecture
- Centralized error handling modal system
- Optimized navigation and smooth user interaction flow


## Tech Stack
### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite
- Framer Motion
  
### Backend / BaaS
- Supabase
  - Google OAuth Authentication
  - PostgreSQL Database
  - PostgreSQL Functions & Triggers
  - Row-Level Security (RLS)
  - Realtime Subscriptions
  - Storage Buckets

### Design
- Figma

### Deployment
- Netlify

## Screenshots
### Login UI Flow
<img src="./previews/Login.png" height="500">

### Main UI Screens
<img src="./previews/Mains.png" height="500">

### Gym Progress Screen
<img src="./previews/Progress.png" height="500">

### Credit Packages Screen
<img src="./previews/Credit%20Packages.png" height="500">

### Crowd Details Screen
<img src="./previews/Crowd%20Details.png" height="500">

### Add Credits UI Flow
<img src="./previews/Add%20Credits.png" height="500">

### Check-In UI Flow
<img src="./previews/Check%20In.png" height="500">

### Shop and Add to Cart Screens
<img src="./previews/Shop.png" height="500">

### Product Review UI Flow
<img src="./previews/Product%20Review.png" height="500">

### Add to Cart UI Flow
<img src="./previews/Cart%20and%20Checkout.png" height="500">

### Check Out UI Flow
<img src="./previews/Check%20Out.png" height="500">

## Notes
This project was developed as part of a collaborative university project. This repository focuses on the customer-side mobile application, while the gym management/admin system was developed separately by another project collaborator.
