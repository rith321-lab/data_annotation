import { useState, useEffect } from 'react'

// Icons
const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
    <path d="M12 7v5l4 2"/>
  </svg>
)

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const GitBranchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="6" y1="3" x2="6" y2="15"/>
    <circle cx="18" cy="6" r="3"/>
    <circle cx="6" cy="18" r="3"/>
    <path d="M18 9a9 9 0 0 1-9 9"/>
  </svg>
)

const RewindIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="11 19 2 12 11 5 11 19"/>
    <polygon points="22 19 13 12 22 5 22 19"/>
  </svg>
)

interface AuditEntry {
  id: string
  entityType: string
  entityId: string
  action: string
  userId: string
  userName: string
  timestamp: string
  changes?: any
  version: number
  metadata?: any
}

interface Version {
  id: string
  versionNumber: number
  createdAt: string
  createdBy: string
  comment?: string
  isCurrent: boolean
  data: any
}

interface AuditTrailProps {
  entityType?: string
  entityId?: string
}

export const AuditTrail = ({ entityType, entityId }: AuditTrailProps) => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([])
  const [versions, setVersions] = useState<Version[]>([])
  const [activeTab, setActiveTab] = useState<'audit' | 'versions'>('audit')
  const [selectedVersions, setSelectedVersions] = useState<[number?, number?]>([])
  const [showDiff, setShowDiff] = useState(false)
  const [filter, setFilter] = useState({
    action: '',
    user: '',
    dateRange: '7d'
  })

  useEffect(() => {
    // Fetch audit trail and versions
    fetchAuditData()
  }, [entityType, entityId, filter])

  const fetchAuditData = async () => {
    // Mock data - in production, this would call the backend
    setAuditEntries([
      {
        id: '1',
        entityType: 'task',
        entityId: entityId || '123',
        action: 'update',
        userId: '1',
        userName: 'John Smith',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        changes: {
          status: { old: 'pending', new: 'in_progress' }
        },
        version: 3
      },
      {
        id: '2',
        entityType: 'task',
        entityId: entityId || '123',
        action: 'submit',
        userId: '2',
        userName: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        changes: {
          responses: { added: 5 }
        },
        version: 2
      },
      {
        id: '3',
        entityType: 'task',
        entityId: entityId || '123',
        action: 'create',
        userId: '3',
        userName: 'Mike Chen',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        version: 1
      }
    ])

    setVersions([
      {
        id: '1',
        versionNumber: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        createdBy: 'John Smith',
        comment: 'Updated task status',
        isCurrent: true,
        data: { status: 'in_progress', responses: 5 }
      },
      {
        id: '2',
        versionNumber: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        createdBy: 'Sarah Johnson',
        comment: 'Submitted initial responses',
        isCurrent: false,
        data: { status: 'pending', responses: 5 }
      },
      {
        id: '3',
        versionNumber: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        createdBy: 'Mike Chen',
        comment: 'Initial creation',
        isCurrent: false,
        data: { status: 'pending', responses: 0 }
      }
    ])
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '+'
      case 'update': return <EditIcon />
      case 'delete': return '×'
      case 'submit': return '✓'
      case 'revert': return <RewindIcon />
      default: return '•'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return { text: '#059669', bg: '#ecfdf5' }
      case 'update': return { text: '#2563eb', bg: '#eff6ff' }
      case 'delete': return { text: '#dc2626', bg: '#fef2f2' }
      case 'submit': return { text: '#7c3aed', bg: '#f3e8ff' }
      case 'revert': return { text: '#d97706', bg: '#fef3c7' }
      default: return { text: '#6b7280', bg: '#f3f4f6' }
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const handleVersionSelect = (version: number) => {
    const [v1, v2] = selectedVersions
    if (!v1) {
      setSelectedVersions([version])
    } else if (!v2 && version !== v1) {
      setSelectedVersions([v1, version])
      setShowDiff(true)
    } else {
      setSelectedVersions([version])
      setShowDiff(false)
    }
  }

  const renderChanges = (changes: any) => {
    if (!changes) return null

    return (
      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {Object.entries(changes).map(([field, change]: [string, any]) => (
          <div key={field} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#6b7280',
            marginBottom: '0.25rem'
          }}>
            <span style={{ fontWeight: '500' }}>{field}:</span>
            {change.old && change.new ? (
              <>
                <span style={{
                  textDecoration: 'line-through',
                  color: '#dc2626'
                }}>
                  {String(change.old)}
                </span>
                <span>→</span>
                <span style={{ color: '#059669' }}>
                  {String(change.new)}
                </span>
              </>
            ) : change.added ? (
              <span style={{ color: '#059669' }}>
                +{change.added} added
              </span>
            ) : change.removed ? (
              <span style={{ color: '#dc2626' }}>
                -{change.removed} removed
              </span>
            ) : (
              <span>changed</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 0.5rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <HistoryIcon />
          Audit Trail & Version History
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          Track changes and manage data versions with complete audit logging
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <nav style={{ display: 'flex' }}>
            <button
              onClick={() => setActiveTab('audit')}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                backgroundColor: activeTab === 'audit' ? 'white' : 'transparent',
                color: activeTab === 'audit' ? '#111827' : '#6b7280',
                borderBottom: activeTab === 'audit' ? '2px solid #7c3aed' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'audit') {
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'audit') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              Audit Trail
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                backgroundColor: activeTab === 'versions' ? 'white' : 'transparent',
                color: activeTab === 'versions' ? '#111827' : '#6b7280',
                borderBottom: activeTab === 'versions' ? '2px solid #7c3aed' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'versions') {
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'versions') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              Version History
            </button>
          </nav>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div>
              {/* Filters */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <select
                  value={filter.action}
                  onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">All Actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="submit">Submit</option>
                  <option value="revert">Revert</option>
                </select>

                <select
                  value={filter.dateRange}
                  onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="all">All time</option>
                </select>
              </div>

              {/* Audit Entries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {auditEntries.map((entry) => {
                  const actionColor = getActionColor(entry.action)

                  return (
                    <div key={entry.id} style={{
                      backgroundColor: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      transition: 'box-shadow 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: actionColor.bg,
                            color: actionColor.text,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getActionIcon(entry.action)}
                          </div>
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#111827'
                              }}>
                                {entry.userName}
                              </span>
                              <span style={{
                                fontSize: '0.875rem',
                                color: '#6b7280'
                              }}>
                                {entry.action}
                              </span>
                              <span style={{
                                fontSize: '0.875rem',
                                color: '#6b7280'
                              }}>
                                {entry.entityType} #{entry.entityId}
                              </span>
                            </div>
                            {renderChanges(entry.changes)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            margin: '0 0 0.25rem 0'
                          }}>
                            {formatTimestamp(entry.timestamp)}
                          </p>
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#9ca3af',
                            margin: 0
                          }}>
                            v{entry.version}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Version History Tab */}
          {activeTab === 'versions' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Select versions to compare changes or revert to a previous state.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {versions.map((version) => {
                  const isSelected = selectedVersions.includes(version.versionNumber)
                  return (
                    <div
                      key={version.id}
                      style={{
                        border: isSelected ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                        backgroundColor: isSelected ? '#f3e8ff' : '#f9fafb',
                        borderRadius: '8px',
                        padding: '1.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleVersionSelect(version.versionNumber)}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#d1d5db'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#e5e7eb'
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#f3e8ff',
                            color: '#7c3aed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <GitBranchIcon />
                          </div>
                          <div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                color: '#111827'
                              }}>
                                Version {version.versionNumber}
                              </span>
                              {version.isCurrent && (
                                <span style={{
                                  padding: '0.25rem 0.5rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  backgroundColor: '#ecfdf5',
                                  color: '#059669',
                                  borderRadius: '9999px'
                                }}>
                                  Current
                                </span>
                              )}
                            </div>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#6b7280',
                              margin: '0 0 0.25rem 0'
                            }}>
                              Created by {version.createdBy} • {formatTimestamp(version.createdAt)}
                            </p>
                            {version.comment && (
                              <p style={{
                                fontSize: '0.875rem',
                                color: '#6b7280',
                                margin: 0,
                                fontStyle: 'italic'
                              }}>
                                "{version.comment}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {!version.isCurrent && (
                            <button style={{
                              padding: '0.25rem 0.75rem',
                              fontSize: '0.875rem',
                              color: '#7c3aed',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#f3e8ff'
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                            >
                              Revert
                            </button>
                          )}
                          <button style={{
                            padding: '0.25rem 0.75rem',
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f3f4f6'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Version Comparison */}
              {showDiff && selectedVersions.length === 2 && (
                <div style={{
                  marginTop: '2rem',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '2rem'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0 0 1rem 0'
                  }}>
                    Comparing Version {selectedVersions[0]} → Version {selectedVersions[1]}
                  </h3>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <pre style={{
                      fontSize: '0.875rem',
                      color: '#374151',
                      margin: 0,
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {JSON.stringify({
                        status: { old: 'pending', new: 'in_progress' },
                        responses: { old: 0, new: 5 }
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}