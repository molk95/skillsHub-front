# SkillHub

SkillHub is a modern Angular-based web application designed to facilitate learning, skill development, and course management. Built with Angular, NgRx for state management, and Angular Material for UI components, SkillHub provides a seamless and scalable learning experience.

## 🚀 Features
- User Authentication (Login, Signup, Logout)
- Role-based Access Control (Admin, Instructor, Student)
- Course Management (Create, Edit, Delete Courses)
- Dashboard & User Profiles
- State Management with NgRx
- Responsive UI with Angular Material
- API Integration for Dynamic Data

## 📂 Project Structure
```bash
src/app/
├── core/                   # Core Module (Singleton services, interceptors, guards)
├── shared/                 # Shared Module (Components, Pipes, Directives, Enums, Models)
├── features/
│   ├── auth/               # Authentication Module
│   │   ├── components/     # Login, Signup
│   │   ├── models/          # Auth models
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
   git clone https://github.com/your-username/skillhub.git
   cd skillhub
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Run the Development Server:**
   ```sh
   ng serve
   ```
   Open [http://localhost:4200](http://localhost:4200) in your browser.


## 📡 API Integration
SkillHub integrates with a backend API. Ensure the API is running and update `environment.ts` with the correct API URL:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```


## 🤝 Contributing
We welcome contributions! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request



---

