import React, { useState } from "react";
import {
  Brain,
  Trophy,
  Bell,
  Check,
  CheckCheck,
  Filter,
  X,
  Star,
  Gift,
  MessageCircle,
  Calendar,
  Users,
} from "lucide-react";

export default function Notifications() {
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "achievement",
      icon: Trophy,
      title: "New Achievement Unlocked!",
      message:
        'You completed the "Problem Solver" challenge. Keep up the great work!',
      time: "2 minutes ago",
      read: false,
      color: "from-amber-500 to-yellow-500",
    },
    {
      id: 2,
      type: "brain",
      icon: Brain,
      title: "Daily Brain Training",
      message:
        "Your daily cognitive assessment is ready. Complete it to maintain your streak.",
      time: "1 hour ago",
      read: false,
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: 3,
      type: "social",
      icon: Users,
      title: "New Friend Request",
      message: "Sarah Johnson wants to connect with you and share progress.",
      time: "3 hours ago",
      read: true,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 4,
      type: "message",
      icon: MessageCircle,
      title: "Message from Coach",
      message:
        "Great progress this week! Here are some personalized tips for your next session.",
      time: "5 hours ago",
      read: false,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 5,
      type: "reminder",
      icon: Calendar,
      title: "Session Reminder",
      message: "Your scheduled brain training session starts in 30 minutes.",
      time: "1 day ago",
      read: true,
      color: "from-rose-500 to-pink-500",
    },
    {
      id: 6,
      type: "reward",
      icon: Gift,
      title: "Weekly Reward",
      message: "You've earned 50 points this week! Claim your reward now.",
      time: "2 days ago",
      read: true,
      color: "from-orange-500 to-red-500",
    },
    {
      id: 7,
      type: "milestone",
      icon: Star,
      title: "Milestone Reached",
      message: "Congratulations! You've completed 100 training sessions.",
      time: "3 days ago",
      read: false,
      color: "from-violet-500 to-purple-500",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1f37] to-[#2c3250] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <p className="text-gray-400">
                Stay updated with your latest activities
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              filter === "all"
                ? "bg-white/20 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Filter className="w-4 h-4" />
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              filter === "unread"
                ? "bg-white/20 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
              filter === "read"
                ? "bg-white/20 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Check className="w-4 h-4" />
            Read ({readCount})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No notifications
              </h3>
              <p className="text-gray-500">
                {filter === "unread"
                  ? "All caught up! No unread notifications."
                  : filter === "read"
                  ? "No read notifications."
                  : "You have no notifications at the moment."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`group relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 ${
                    !notification.read ? "ring-2 ring-blue-500/30" : ""
                  }`}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`relative flex-shrink-0 p-3 rounded-2xl bg-gradient-to-r ${notification.color} shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-100 transition-colors">
                        {notification.title}
                      </h3>
                      <p className="text-gray-300 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {notification.time}
                        </span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-sm rounded-lg transition-colors"
                            >
                              <Check className="w-3 h-3" />
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
