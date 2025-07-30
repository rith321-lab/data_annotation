import { useState, useEffect } from 'react'

// Icons
const UserPlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/>
    <line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
)

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-10 5L2 7"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l8 4v6c0 4-3.33 7.33-8 10-4.67-2.67-8-6-8-10V6l8-4z"/>
  </svg>
)

const ActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)

const MoreVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="1"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="12" cy="19" r="1"/>
  </svg>
)

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'labeler' | 'reviewer'
  avatar?: string
  joinedAt: string
  lastActive: string
  tasksCompleted: number
  accuracy: number
  status: 'active' | 'inactive' | 'invited'
}

export const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    // Mock team data
    setTeamMembers([
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'admin',
        joinedAt: '2024-01-01',
        lastActive: '2 hours ago',
        tasksCompleted: 1523,
        accuracy: 98.5,
        status: 'active'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        role: 'manager',
        joinedAt: '2024-01-15',
        lastActive: '5 minutes ago',
        tasksCompleted: 892,
        accuracy: 97.2,
        status: 'active'
      },
      {
        id: '3',
        name: 'Mike Chen',
        email: 'mike.chen@example.com',
        role: 'labeler',
        joinedAt: '2024-02-01',
        lastActive: '1 day ago',
        tasksCompleted: 456,
        accuracy: 95.8,
        status: 'active'
      },
      {
        id: '4',
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        role: 'reviewer',
        joinedAt: '2024-02-10',
        lastActive: '3 hours ago',
        tasksCompleted: 678,
        accuracy: 99.1,
        status: 'active'
      },
      {
        id: '5',
        name: 'Alex Thompson',
        email: 'alex.t@example.com',
        role: 'labeler',
        joinedAt: '2024-02-20',
        lastActive: 'Offline',
        tasksCompleted: 234,
        accuracy: 94.3,
        status: 'inactive'
      },
      {
        id: '6',
        name: 'Lisa Wang',
        email: 'lisa.wang@example.com',
        role: 'labeler',
        joinedAt: '-',
        lastActive: 'Not yet joined',
        tasksCompleted: 0,
        accuracy: 0,
        status: 'invited'
      }
    ])
  }, [])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return { bg: '#f3e8ff', text: '#7c3aed' }
      case 'manager': return { bg: '#eff6ff', text: '#2563eb' }
      case 'reviewer': return { bg: '#ecfdf5', text: '#059669' }
      case 'labeler': return { bg: '#f3f4f6', text: '#6b7280' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active': return { color: '#059669', dotColor: '#10b981' }
      case 'inactive': return { color: '#6b7280', dotColor: '#9ca3af' }
      case 'invited': return { color: '#d97706', dotColor: '#f59e0b' }
      default: return { color: '#6b7280', dotColor: '#9ca3af' }
    }
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock invite logic
    const newMember: TeamMember = {
      id: `${teamMembers.length + 1}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: selectedRole as TeamMember['role'],
      joinedAt: '-',
      lastActive: 'Not yet joined',
      tasksCompleted: 0,
      accuracy: 0,
      status: 'invited'
    }
    setTeamMembers([...teamMembers, newMember])
    setShowInviteModal(false)
    setInviteEmail('')
    setSelectedRole('')
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 0.5rem 0'
          }}>
            Team Management
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Manage your team members, roles, and performance
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#6d28d9'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#7c3aed'
          }}
        >
          <UserPlusIcon />
          Invite Member
        </button>
      </div>

      {/* Team Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                Total Members
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                {teamMembers.length}
              </p>
            </div>
            <div style={{
              backgroundColor: '#f3e8ff',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#7c3aed'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                Active Now
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#059669', margin: 0 }}>
                {teamMembers.filter(m => m.status === 'active').length}
              </p>
            </div>
            <div style={{
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#059669'
            }}>
              <ActivityIcon />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                Avg Accuracy
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb', margin: 0 }}>
                {(teamMembers.reduce((acc, m) => acc + m.accuracy, 0) / teamMembers.filter(m => m.accuracy > 0).length || 0).toFixed(1)}%
              </p>
            </div>
            <div style={{
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#2563eb'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                Total Tasks
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706', margin: 0 }}>
                {teamMembers.reduce((acc, m) => acc + m.tasksCompleted, 0).toLocaleString()}
              </p>
            </div>
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#d97706'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H3v10h6V11zM15 3H9v18h6V3zM21 7h-6v14h6V7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            Team Members
          </h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Member
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Role
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Performance
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Joined
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {teamMembers.map((member, index) => {
                const roleColor = getRoleBadgeColor(member.role)
                const statusInfo = getStatusInfo(member.status)

                return (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: index < teamMembers.length - 1 ? '1px solid #e5e7eb' : 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white'
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ flexShrink: 0, width: '40px', height: '40px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        </div>
                        <div style={{ marginLeft: '1rem' }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {member.name}
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            marginTop: '0.25rem'
                          }}>
                            <MailIcon />
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '9999px',
                        backgroundColor: roleColor.bg,
                        color: roleColor.text,
                        textTransform: 'capitalize'
                      }}>
                        {member.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{
                        fontSize: '0.875rem',
                        color: statusInfo.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: statusInfo.dotColor
                        }} />
                        {member.lastActive}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                        <div style={{ fontWeight: '500' }}>
                          {member.tasksCompleted.toLocaleString()} tasks
                        </div>
                        {member.accuracy > 0 && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.25rem'
                          }}>
                            {member.accuracy}% accuracy
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      fontSize: '0.875rem',
                      color: '#6b7280'
                    }}>
                      {member.joinedAt}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      whiteSpace: 'nowrap',
                      textAlign: 'right'
                    }}>
                      <button style={{
                        color: '#9ca3af',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '4px',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#6b7280'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#9ca3af'
                      }}
                      >
                        <MoreVerticalIcon />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 1.5rem 0'
            }}>
              Invite Team Member
            </h2>
            <form onSubmit={handleInvite}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="colleague@example.com"
                  required
                />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Select a role</option>
                  <option value="labeler">Labeler</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Send Invitation
                </button>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}