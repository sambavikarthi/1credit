# Social Connect - Firebase Edition

A modern social media application built with React, TypeScript, and Firebase.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Database**: Firebase Firestore (Cloud Database)
- **Authentication**: Firebase Authentication
- **Icons**: Lucide React

## ✨ Features

- User authentication (Sign up, Login, Logout)
- Create, edit, and delete posts
- Like posts
- User profiles with bio
- Real-time updates
- Responsive design

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account ([Create one here](https://console.firebase.google.com/))

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Your Firebase configuration is already set up in `src/firebase.tsx`. However, you need to:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `project-bolt-sb1-xyezlz3-a453a`
3. Enable **Email/Password Authentication**
4. Create a **Firestore Database**
5. Set up **Security Rules**

**See `FIREBASE_SETUP.md` for detailed setup instructions.**

### 3. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 📁 Project Structure

```
project/
├── src/
│   ├── components/        # React components
│   │   ├── Auth/         # Authentication components
│   │   ├── Feed/         # Post feed components
│   │   ├── Friends/      # Friends components
│   │   ├── Layout/       # Layout components
│   │   ├── Messages/     # Messaging components
│   │   ├── Notifications/# Notifications components
│   │   └── Profile/      # Profile components
│   ├── contexts/         # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/              # Utilities and API
│   │   └── firestore-api.ts
│   ├── firebase.tsx      # Firebase configuration
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── FIREBASE_SETUP.md     # Detailed Firebase setup guide
└── package.json
```

## 🔥 Firebase Collections

### `users`
- User profiles with username, email, bio, followers, following

### `posts`
- User posts with content, likes, timestamps

### `comments`
- Comments on posts

### `notifications`
- User notifications

### `messages`
- Direct messages between users

## 🛠️ Development

### Adding New Features

1. Create components in `src/components/`
2. Add API methods in `src/lib/firestore-api.ts`
3. Update Firestore security rules if needed

### Firebase Security Rules

Security rules are defined in Firebase Console. See `FIREBASE_SETUP.md` for the complete ruleset.

## 📦 Deployment

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init

# Build and deploy
npm run build
firebase deploy
```

## 🐛 Troubleshooting

### "Missing or insufficient permissions"
- Check Firestore security rules
- Ensure user is authenticated

### "The query requires an index"
- Click the link in the error to create the index automatically
- Or create indexes manually in Firebase Console

### Posts not loading
- Verify Firestore database is created
- Check browser console for errors
- Ensure security rules are set correctly

## 📚 Learn More

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
