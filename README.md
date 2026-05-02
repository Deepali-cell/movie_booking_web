 Movie Booking & Theater Management Platform

A full-stack movie booking and theater management system built to simulate a real-world multiplex ecosystem. The platform supports multiple roles (Admin, Owner, and Users) with complex workflows including show voting, group booking, food ordering, and theater management.

This project was designed to understand system design, role-based architecture, and real-world booking systems at scale.

⚙️ Tech Stack
Frontend
Next.js
TypeScript (basic usage)
Redux Toolkit (state management)
Context API
Protected Routes
Custom API layer

Backend
Node.js
Express.js
MongoDB
JWT Authentication
Media & Storage
Cloudinary (images/videos)
Multer (file uploads)
Deployment

Full-stack deployed (frontend + backend)
 Role-Based System
 
Admin (Read-only Control Panel)
View all system data
Theaters
Users
Bookings
Movies
Shows
Food courts
Cannot modify data
Acts as monitoring/analytics dashboard

Owner (Main Control Panel)
Owner has full control of theaters:
Add multiple theaters
Manage theater blocks (screens/seats)
Add and manage movies (including trending/latest)
Create and schedule shows (day/time-based)
Manage food courts inside theaters
Configure seat services (self-service / assisted service)
Handle bookings and availability logic

 User
Browse theaters and movies
View shows and cast details
Watch trailers and owner-uploaded reels
Read and write reviews
Book tickets
View seat layout and show timings
Group booking system
Food ordering (pre-book & post-book)
View order history and booking details

 Core Features
🎬 Movie & Show System
Latest / trending movies section
Show scheduling by owner (date & time based)
Cast details and trailers
Real-time show availability logic
🏟️ Theater System
Multiple theaters per owner
Block-based seating structure
Seat-level booking management
Food court per theater
🍔 Food Court System
Food menus per theater
Pre-order food with booking
Post-book food availability
Seat delivery / self-service options
Food reviews and ratings
👥 Group Booking System (Advanced Feature)
Create group via shareable link
Friends join after authentication
Admin assigns theater/show based on group
Voting system to decide show
Highest voted show gets booked

 Payment Flow (Mocked)
Split bill support
Single payment option for group creator
Cash + online flow structure (simulated, not real payment gateway)
Ticket generated after confirmation
 Authentication System
Secure login/signup (JWT-based)
Role-based access control (Admin / Owner / User)
Protected routes for all dashboards
Session handling with cookies/token
 Architecture Overview
Modular backend structure:
controllers/
routes/
models/
middleware/
Clean frontend separation:
pages/
components/
redux/
context/
services/api layer/
API-driven architecture
Scalable design for multi-role system

 Key Learnings
Designing complex multi-role systems
Building real-world booking systems (like multiplex platforms)
Handling nested entities (theaters → blocks → seats → shows)
Group-based decision system (voting logic)
Advanced state management (Redux + Context)
File upload system using Multer + Cloudinary
Full-stack deployment workflow
System design thinking for large applications

 Project Highlights
Multi-role architecture (Admin / Owner / User)
Group booking + voting system (unique feature)
Food ordering integrated with ticket booking
Real-world theater structure simulation
Scalable booking logic with seat management
Fully deployed full-stack application

🎟️ Seat Booking System (Security & Consistency)
Seat booking is handled with a structured locking/validation system to avoid double booking
Each seat selection generates a hashed booking reference to ensure data integrity and prevent tampering
Hashing is used to validate seat allocation requests before final confirmation
This helps maintain consistency in high-concurrency booking scenarios

 Project Purpose
This project was built to simulate a real-world multiplex ecosystem and understand:
Large-scale system design
Complex role-based workflows
Booking and scheduling systems
State management in large applications
Real-world full-stack architecture patterns
