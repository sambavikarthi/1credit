import { Bell } from 'lucide-react';

export function Notifications() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <Bell className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600">Notification system coming soon!</p>
      </div>
    </div>
  );
}
