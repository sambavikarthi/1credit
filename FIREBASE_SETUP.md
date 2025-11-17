# Firebase Setup Guide

Your app has been successfully migrated from MongoDB to **Firebase Firestore**! 🔥

## What Changed

### ✅ Completed Migration
- **Authentication**: Now using Firebase Authentication instead of JWT/cookies
- **Database**: Migrated from MongoDB to Cloud Firestore
- **Real-time**: Firebase provides built-in real-time capabilities
- **No Backend Server Needed**: The Node.js/Express backend is no longer required

### Files Updated
1. `src/firebase.tsx` - Firebase initialization with Auth & Firestore
2. `src/lib/firestore-api.ts` - Complete API wrapper for Firestore operations
3. `src/contexts/AuthContext.tsx` - Updated to use Firebase Auth
4. `src/App.tsx` - Updated API imports
5. `src/components/Feed/*` - All feed components updated
6. `src/components/Profile/Profile.tsx` - Profile component updated

## Firebase Configuration

Your Firebase project is already configured in `src/firebase.tsx`:
- **Project ID**: `project-bolt-sb1-xyezlz3-a453a`
- **Auth Domain**: `project-bolt-sb1-xyezlz3-a453a.firebaseapp.com`

## Required Firebase Setup Steps

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `project-bolt-sb1-xyezlz3-a453a`
3. Navigate to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Click **Save**

### 2. Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll set rules next)
4. Select your preferred location (e.g., `us-central1`)
5. Click **Enable**

### 2.5. Enable Firebase Storage (for Image Uploads)

1. In Firebase Console, go to **Storage**
2. Click **Get started**
3. Choose **Start in production mode**
4. Select the same location as your Firestore database
5. Click **Done**

### 3. Set Firestore Security Rules

Go to **Firestore Database** → **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isSignedIn() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId);
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update, delete: if isOwner(resource.data.userId);
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow delete: if isOwner(resource.data.userId);
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read, write: if isOwner(resource.data.userId);
    }
    
    // Messages collection
    match /messages/{messageId} {
      allow read: if isSignedIn() && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
      allow create: if isSignedIn() && request.auth.uid == request.resource.data.senderId;
    }
  }
}
```

### 3.5. Set Firebase Storage Security Rules

Go to **Storage** → **Rules** and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images
    match /posts/{allPaths=**} {
      allow read: if true; // Anyone can read images
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024; // Max 5MB
    }
  }
}
```

### 4. Create Firestore Indexes (Optional but Recommended)

Some queries require composite indexes. Firebase will prompt you to create them when needed, or you can create them manually:

1. Go to **Firestore Database** → **Indexes**
2. Add these composite indexes:

**Posts by createdAt:**
- Collection: `posts`
- Fields: `createdAt` (Descending)
- Query scope: Collection

**Notifications by userId and createdAt:**
- Collection: `notifications`
- Fields: `userId` (Ascending), `createdAt` (Descending)
- Query scope: Collection

**Messages queries:**
- Collection: `messages`
- Fields: `senderId` (Ascending), `createdAt` (Ascending)
- Query scope: Collection

## Running the App

### Start Development Server

```bash
npm run dev
```

**Note**: You no longer need to run the backend server (`npm run server`). Firebase handles everything!

### Available Scripts

- `npm run dev` - Start the frontend (Vite dev server)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Data Structure

### Collections in Firestore

#### `users`
```javascript
{
  username: string,
  email: string,
  fullName: string,
  bio: string,
  followers: string[],  // Array of user IDs
  following: string[],  // Array of user IDs
  createdAt: timestamp
}
```

#### `posts`
```javascript
{
  userId: string,
  content: string,
  imageUrl: string | null,
  likes: string[],  // Array of user IDs who liked
  createdAt: timestamp
}
```

#### `comments`
```javascript
{
  postId: string,
  userId: string,
  content: string,
  createdAt: timestamp
}
```

#### `notifications`
```javascript
{
  userId: string,
  type: string,
  fromUserId: string,
  postId: string | null,
  read: boolean,
  createdAt: timestamp
}
```

#### `messages`
```javascript
{
  senderId: string,
  receiverId: string,
  content: string,
  read: boolean,
  createdAt: timestamp
}
```

## Testing the Migration

### 1. Test User Registration
1. Start the app: `npm run dev`
2. Click **Sign Up**
3. Create a new account
4. Check Firebase Console → Authentication to see the new user
5. Check Firestore → `users` collection for the user document

### 2. Test Creating Posts
1. Log in with your account
2. Create a post
3. Check Firestore → `posts` collection

### 3. Test Liking Posts
1. Like a post
2. Check the post document in Firestore - the `likes` array should update

## Troubleshooting

### "Missing or insufficient permissions"
- Make sure you've set up Firestore security rules (Step 3 above)
- Ensure the user is logged in

### "The query requires an index"
- Click the link in the error message to auto-create the index
- Or manually create indexes as described in Step 4

### User document not created on registration
- Check browser console for errors
- Verify Firebase Auth is enabled
- Check Firestore security rules

### Posts not loading
- Verify you have at least one post in Firestore
- Check browser console for errors
- Ensure composite indexes are created

## Benefits of Firebase

✅ **No Backend Maintenance**: No need to manage Node.js/Express server
✅ **Real-time Updates**: Built-in real-time data synchronization
✅ **Scalability**: Automatically scales with your user base
✅ **Security**: Built-in security rules
✅ **Authentication**: Robust auth system with multiple providers
✅ **Free Tier**: Generous free tier for development

## Next Steps

1. **Enable more auth providers**: Google, GitHub, etc.
2. **Add real-time listeners**: Update UI automatically when data changes
3. **Implement Cloud Functions**: For server-side logic (notifications, etc.)
4. **Add Firebase Storage**: For image uploads
5. **Deploy to Firebase Hosting**: One-command deployment

## Deployment

To deploy your app to Firebase Hosting:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Build and deploy
npm run build
firebase deploy
```

## Support

For Firebase documentation:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)

---

**Your app is now powered by Firebase! 🚀**
