# SkillsHub - Frontend

SkillHub is a modern Angular-based web application designed to facilitate learning, skill development, and managing communities, gamification, and real-time communication.. Built with Angular, NgRx for state management, and Angular Material for UI components, SkillsHub provides a seamless and scalable learning experience.

## 🚀 Features Example
- User Authentication (Login, Signup, Logout)
- Role-based Access Control (Admin, User)
- Skills Management (Create, Edit, Delete Skills)
- Dashboard & User Profiles
- State Management with NgRx
- Responsive UI with Tailwind CSS
- API Integration for Dynamic Data

## 📎 Project Structure
```bash
src/app/
├── core/                   # Core Module (Singleton services, interceptors, guards)
├── shared/                 # Shared Module (Components, Pipes, Directives, Enums, Models)
├── features/
│   ├── auth/               # Authentication Module
│   │   ├── components/     # Login, Signup
│   │   ├── models/         # Auth models
│   │   ├── services/       # Auth Services
│   │   ├── store/          # NgRx Store for Auth
│   │   ├── auth.module.ts  # Auth Module
│   │ 
│   ├── skills/             # Skills Module
│   ├── dashboard/          # Dashboard Module
│   ├── wallets/            # Wallet Module
│   ├── events/             # Event Module
│
├── layout/                 # Application Layout Components
├── store/                  # Global State Management with NgRx
├── app.module.ts           # Root Module
├── app-routing.module.ts   # Routing Module
```

## 🛠️ Installation

### Steps to Run the Project
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/your-username/skillsHub-front.git
   cd skillHub-front
   ```
2. **Install Dependencies:**
   
   Using npm:
   ```sh
   npm install
   ```
   
   Using Yarn:
   ```sh
   yarn install
   ```

3. **Run the Development Server:**
   
   Using npm:
   ```sh
   ng serve
   ```
   
   Using Yarn:
   ```sh
   yarn ng serve
   ```
   
   Open [http://localhost:4200](http://localhost:4200) in your browser.

