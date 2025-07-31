import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell as BellIcon, CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

// Mock data - in a real app this would come from an API or global state
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Project Completed',
    message: 'Image Classification project has been successfully completed with 98.5% accuracy.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    action: {
      label: 'View Report',
      onClick: () => console.log('View report')
    }
  },
  {
    id: '2',
    type: 'info',
    title: 'New Team Member',
    message: 'Sarah Johnson has joined your team as a reviewer.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Low Accuracy Alert',
    message: 'Worker accuracy has dropped below 85% threshold for John Doe.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    action: {
      label: 'Review Performance',
      onClick: () => console.log('Review performance')
    }
  },
  {
    id: '4',
    type: 'error',
    title: 'Webhook Failed',
    message: 'Failed to deliver webhook to https://api.example.com/webhooks after 5 attempts.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true
  }
]

interface NotificationCenterProps {
  onClose?: () => void
}

export const NotificationCenter = ({ onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read)

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed right-4 top-16 w-96 bg-card border border-border rounded-lg shadow-xl z-[9999] max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <BellIcon />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded ${
                filter === 'all' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 text-sm rounded ${
                filter === 'unread' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Unread
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-border last:border-b-0 transition-colors ${
                !notification.read 
                  ? 'bg-muted/30' 
                  : 'hover:bg-muted/20'
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-medium ${
                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    !notification.read ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {notification.message}
                  </p>
                  
                  {notification.action && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        notification.action!.onClick()
                      }}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      {notification.action.label}
                    </button>
                  )}
                </div>
                
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Notification Bell Component for the header
export const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount] = useState(2) // This would come from a global state or API

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-muted-foreground hover:text-foreground"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && createPortal(
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setShowNotifications(false)}
          />
          <NotificationCenter onClose={() => setShowNotifications(false)} />
        </>,
        document.body
      )}
    </div>
  )
}