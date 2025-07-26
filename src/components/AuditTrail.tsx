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
      case 'create': return 'text-green-600 bg-green-100'
      case 'update': return 'text-blue-600 bg-blue-100'
      case 'delete': return 'text-red-600 bg-red-100'
      case 'submit': return 'text-purple-600 bg-purple-100'
      case 'revert': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
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
      <div className="mt-2 text-sm">
        {Object.entries(changes).map(([field, change]: [string, any]) => (
          <div key={field} className="flex items-center gap-2 text-gray-600">
            <span className="font-medium">{field}:</span>
            {change.old && change.new ? (
              <>
                <span className="line-through text-red-600">{String(change.old)}</span>
                <span>→</span>
                <span className="text-green-600">{String(change.new)}</span>
              </>
            ) : change.added ? (
              <span className="text-green-600">+{change.added} added</span>
            ) : change.removed ? (
              <span className="text-red-600">-{change.removed} removed</span>
            ) : (
              <span>changed</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <HistoryIcon />
          Audit Trail & Version History
        </h1>
        <p className="text-gray-600">Track changes and manage data versions</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'audit'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Audit Trail
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'versions'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Version History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <select
                  value={filter.action}
                  onChange={(e) => setFilter({ ...filter, action: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="all">All time</option>
                </select>
              </div>

              {/* Audit Entries */}
              <div className="space-y-4">
                {auditEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActionColor(entry.action)}`}>
                          {getActionIcon(entry.action)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.userName}</span>
                            <span className="text-sm text-gray-500">{entry.action}</span>
                            <span className="text-sm text-gray-500">
                              {entry.entityType} #{entry.entityId}
                            </span>
                          </div>
                          {renderChanges(entry.changes)}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatTimestamp(entry.timestamp)}</p>
                        <p className="text-xs text-gray-400">v{entry.version}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Version History Tab */}
          {activeTab === 'versions' && (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Select two versions to compare changes, or select one to view/revert.
                </p>
              </div>

              <div className="space-y-4">
                {versions.map((version) => {
                  const isSelected = selectedVersions.includes(version.versionNumber)
                  return (
                    <div
                      key={version.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleVersionSelect(version.versionNumber)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                            <GitBranchIcon />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Version {version.versionNumber}</span>
                              {version.isCurrent && (
                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Created by {version.createdBy} • {formatTimestamp(version.createdAt)}
                            </p>
                            {version.comment && (
                              <p className="text-sm text-gray-500 mt-1">"{version.comment}"</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!version.isCurrent && (
                            <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-100 rounded">
                              Revert
                            </button>
                          )}
                          <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
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
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Comparing Version {selectedVersions[0]} → Version {selectedVersions[1]}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700">
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