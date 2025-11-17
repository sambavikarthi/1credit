import { useState, useEffect } from 'react';
import { Routes, Route, useParams, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Navigation } from './components/Layout/Navigation';
import { Feed } from './components/Feed/Feed';
import { Friends } from './components/Friends/Friends';
import { Notifications } from './components/Notifications/Notifications';
import { Messages } from './components/Messages/Messages';
import { Profile } from './components/Profile/Profile';
import { firestoreNotificationsAPI, firestoreMessagesAPI } from './lib/firestore-api';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
      
      // Poll for unread counts every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCounts();
      }, 30000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [user]);

  const fetchUnreadCounts = async () => {
    try {
      const notifData = await firestoreNotificationsAPI.getUnreadCount();
      const msgData = await firestoreMessagesAPI.getUnreadCount();
      
      setUnreadNotifications(notifData.count || 0);
      setUnreadMessages(msgData.count || 0);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
      setUnreadNotifications(0);
      setUnreadMessages(0);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <main>
        {activeTab === 'feed' && <Feed />}
        {activeTab === 'friends' && <Friends />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'messages' && <Messages />}
        {activeTab === 'profile' && <Profile />}
      </main>
    </div>
  );
}

// Simple slugify helper used by TopicPage
const slugify = (tag: string) => tag.replace('#', '').toLowerCase().replace(/\s+/g, '-');

// Static topics list (kept in sync with Feed sidebar)
const TOPICS = [
  {
    tag: '#WebDevelopment',
    posts: 357,
    description:
      'People are actively discussing web design, frameworks, and new technologies.',
  },
  {
    tag: '#ReactJS',
    posts: 216,
    description: 'Developers are sharing tips, projects, and tutorials about React.',
  },
  {
    tag: '#AI',
    posts: 331,
    description: 'Artificial Intelligence is a hot topic with trends, tools, and innovations.',
  },
  {
    tag: '#Design',
    posts: 232,
    description: 'Creative discussions on UI/UX and graphic design.',
  },
  {
    tag: '#Technology',
    posts: 513,
    description:
      'The most popular topic covering everything from gadgets to futuristic tech.',
  },
];

function TopicPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const params = useParams();
  const slug = params.slug || '';
  const topic = TOPICS.find((t) => slugify(t.tag) === slug);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const notifData = await firestoreNotificationsAPI.getUnreadCount();
        const msgData = await firestoreMessagesAPI.getUnreadCount();
        setUnreadNotifications(notifData.count || 0);
        setUnreadMessages(msgData.count || 0);
      } catch (e) {
        setUnreadNotifications(0);
        setUnreadMessages(0);
      }
    };
    if (user) fetchUnreadCounts();
  }, [user]);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadNotifications={unreadNotifications}
        unreadMessages={unreadMessages}
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {!topic ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Topic not found</h1>
            <p className="text-gray-600 mb-4">The topic you are looking for does not exist.</p>
            <Link
              to="/"
              className="inline-block px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white"
            >
              Back to Feed
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{topic.tag}</h1>
                <p className="text-gray-600 mt-2">{topic.description}</p>
                <p className="text-sm text-gray-500 mt-2">{topic.posts} posts</p>
              </div>
              <Link
                to="/"
                className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                Back to Feed
              </Link>
            </div>

            {/* Placeholder content; in future we can filter posts by tag */}
            <div className="mt-6 grid gap-4">
              <div className="p-4 rounded-lg bg-purple-50 text-purple-700">
                Posts related to {topic.tag} will appear here.
              </div>
              <div className="p-4 rounded-lg bg-pink-50 text-pink-700">
                You can extend this page to query Firestore for tagged posts.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/topic/:slug" element={<TopicPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
