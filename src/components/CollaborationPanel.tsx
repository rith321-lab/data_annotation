import { useState, useEffect } from 'react'

// Icons
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const MessageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const CursorIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color} stroke="none">
    <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"/>
  </svg>
)

interface ActiveUser {
  id: string
  name: string
  avatar?: string
  color: string
  position?: { x: number; y: number }
  currentTask?: string
  status: 'active' | 'idle' | 'away'
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: Date
}

interface CollaborationPanelProps {
  projectId: string
  taskId?: string
  onClose?: () => void
}

export const CollaborationPanel = ({ projectId, taskId, onClose }: CollaborationPanelProps) => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([
    {
      id: '1',
      name: 'John Smith',
      color: '#ef4444',
      position: { x: 250, y: 150 },
      currentTask: 'Reviewing image classifications',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      color: '#3b82f6',
      position: { x: 450, y: 200 },
      currentTask: 'Labeling new batch',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Chen',
      color: '#10b981',
      currentTask: 'Quality checking',
      status: 'idle'
    }
  ])

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'John Smith',
      message: 'Hey team, I found some ambiguous images in batch 23',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    },
    {
      id: '2',
      userId: '2',
      userName: 'Sarah Johnson',
      message: 'I can help review those. Which ones specifically?',
      timestamp: new Date(Date.now() - 1000 * 60 * 3)
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [showChat, setShowChat] = useState(true)

  // Simulate real-time cursor movement
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(users => users.map(user => {
        if (user.status === 'active' && user.position) {
          return {
            ...user,
            position: {
              x: user.position.x + (Math.random() - 0.5) * 20,
              y: user.position.y + (Math.random() - 0.5) * 20
            }
          }
        }
        return user
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: String(chatMessages.length + 1),
      userId: 'current',
      userName: 'You',
      message: newMessage,
      timestamp: new Date()
    }

    setChatMessages([...chatMessages, message])
    setNewMessage('')
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UsersIcon />
            Collaboration
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Active Users */}
      <div className="p-4 border-b">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Active Now ({activeUsers.filter(u => u.status === 'active').length})</h4>
        <div className="space-y-2">
          {activeUsers.map(user => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="relative">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  user.status === 'active' ? 'bg-green-500' :
                  user.status === 'idle' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.currentTask}</p>
              </div>
              {user.position && (
                <div className="relative">
                  <CursorIcon color={user.color} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed / Chat */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Team Chat</h4>
            <button
              onClick={() => setShowChat(!showChat)}
              className="text-xs text-purple-600 hover:text-purple-800"
            >
              {showChat ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {showChat && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.userId === 'current' ? 'justify-end' : ''}`}>
                  {msg.userId !== 'current' && (
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                      style={{ backgroundColor: activeUsers.find(u => u.id === msg.userId)?.color || '#6b7280' }}
                    >
                      {msg.userName[0]}
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.userId === 'current' ? 'order-first' : ''}`}>
                    <div className={`rounded-lg px-3 py-2 ${
                      msg.userId === 'current' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {msg.userId !== 'current' && (
                        <p className="text-xs font-medium mb-1">{msg.userName}</p>
                      )}
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      msg.userId === 'current' ? 'text-right' : ''
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  <MessageIcon />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Live Updates */}
      <div className="p-4 border-t bg-yellow-50">
        <p className="text-xs text-yellow-800">
          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span>
          Sarah is currently reviewing your recent annotations
        </p>
      </div>
    </div>
  )
}

// Cursor component for showing other users' positions
export const CollaborativeCursor = ({ user }: { user: ActiveUser }) => {
  if (!user.position) return null

  return (
    <div
      className="absolute pointer-events-none transition-all duration-200"
      style={{
        left: user.position.x,
        top: user.position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <CursorIcon color={user.color} />
      <span 
        className="absolute top-4 left-4 text-xs text-white px-2 py-1 rounded whitespace-nowrap"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </span>
    </div>
  )
}