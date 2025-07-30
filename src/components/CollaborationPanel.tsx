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
  projectId?: string
  taskId?: string
  onClose?: () => void
}

export const CollaborationPanel = ({ projectId, taskId, onClose }: CollaborationPanelProps = {}) => {
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
    <div style={{ padding: '2rem', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 0.5rem 0'
        }}>
          Collaboration
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          Real-time collaboration and team communication
        </p>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2rem',
        height: 'calc(100vh - 8rem)'
      }}>
        {/* Left Column - Active Users & Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Users */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Active Now ({activeUsers.filter(u => u.status === 'active').length})
              </h2>
            </div>
            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeUsers.map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: user.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: '2px solid white',
                        backgroundColor: user.status === 'active' ? '#10b981' :
                                       user.status === 'idle' ? '#f59e0b' : '#6b7280'
                      }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: '#111827',
                        margin: '0 0 0.25rem 0'
                      }}>
                        {user.name}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {user.currentTask}
                      </p>
                    </div>
                    {user.position && (
                      <div style={{ position: 'relative' }}>
                        <CursorIcon color={user.color} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            flex: 1
          }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Recent Activity
              </h2>
            </div>
            <div style={{ padding: '1.5rem 2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { user: 'Sarah Johnson', action: 'completed 15 image classifications', time: '2 minutes ago', color: '#3b82f6' },
                  { user: 'Mike Chen', action: 'started quality review for batch #47', time: '5 minutes ago', color: '#10b981' },
                  { user: 'John Smith', action: 'flagged 3 items for discussion', time: '12 minutes ago', color: '#ef4444' },
                  { user: 'Emily Davis', action: 'approved consensus for 28 tasks', time: '18 minutes ago', color: '#8b5cf6' }
                ].map((activity, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: activity.color,
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#111827',
                        margin: '0 0 0.25rem 0'
                      }}>
                        <strong>{activity.user}</strong> {activity.action}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Team Chat */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                Team Chat
              </h2>
              <button
                onClick={() => setShowChat(!showChat)}
                style={{
                  fontSize: '0.75rem',
                  color: '#7c3aed',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {showChat ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {showChat && (
            <>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                {chatMessages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: msg.userId === 'current' ? 'flex-end' : 'flex-start'
                  }}>
                    {msg.userId !== 'current' && (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: activeUsers.find(u => u.id === msg.userId)?.color || '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.75rem',
                        flexShrink: 0
                      }}>
                        {msg.userName[0]}
                      </div>
                    )}
                    <div style={{
                      maxWidth: '75%',
                      order: msg.userId === 'current' ? -1 : 0
                    }}>
                      <div style={{
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        backgroundColor: msg.userId === 'current' ? '#7c3aed' : '#f3f4f6',
                        color: msg.userId === 'current' ? 'white' : '#111827'
                      }}>
                        {msg.userId !== 'current' && (
                          <p style={{
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            margin: '0 0 0.25rem 0',
                            opacity: 0.8
                          }}>
                            {msg.userName}
                          </p>
                        )}
                        <p style={{ fontSize: '0.875rem', margin: 0 }}>
                          {msg.message}
                        </p>
                      </div>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        margin: '0.25rem 0 0 0',
                        textAlign: msg.userId === 'current' ? 'right' : 'left'
                      }}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <MessageIcon />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Live Updates */}
          <div style={{
            padding: '1rem 2rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#fef3c7'
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: '#92400e',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                backgroundColor: '#f59e0b',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }} />
              Sarah is currently reviewing your recent annotations
            </p>
          </div>
        </div>
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