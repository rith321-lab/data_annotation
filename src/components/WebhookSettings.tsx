import { useState } from 'react'

// Icons
const WebhookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <path d="M2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const TestIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
)

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  headers: Record<string, string>
  active: boolean
  lastTriggered?: string
  failureCount: number
}

const AVAILABLE_EVENTS = [
  { value: 'task.created', label: 'Task Created' },
  { value: 'task.completed', label: 'Task Completed' },
  { value: 'task.rejected', label: 'Task Rejected' },
  { value: 'project.created', label: 'Project Created' },
  { value: 'project.completed', label: 'Project Completed' },
  { value: 'worker.joined', label: 'Worker Joined' },
  { value: 'worker.removed', label: 'Worker Removed' },
  { value: 'quality.threshold_breach', label: 'Quality Threshold Breach' },
  { value: 'webhook.test', label: 'Test Event' }
]

export const WebhookSettings = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'Slack Notifications',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
      events: ['task.completed', 'project.completed'],
      headers: { 'Content-Type': 'application/json' },
      active: true,
      lastTriggered: '2024-01-26 14:30',
      failureCount: 0
    },
    {
      id: '2',
      name: 'Analytics Pipeline',
      url: 'https://api.analytics.com/webhooks/verita',
      events: ['task.created', 'task.completed', 'task.rejected'],
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Key': 'sk_live_xxxxxxxxxxxx'
      },
      active: true,
      lastTriggered: '2024-01-26 15:45',
      failureCount: 0
    },
    {
      id: '3',
      name: 'Error Monitoring',
      url: 'https://sentry.io/api/hooks/verita-ai',
      events: ['quality.threshold_breach'],
      headers: { 'Content-Type': 'application/json' },
      active: false,
      lastTriggered: '2024-01-25 09:20',
      failureCount: 5
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: [] as string[],
    headers: {} as Record<string, string>,
    active: true
  })

  const [newHeaderKey, setNewHeaderKey] = useState('')
  const [newHeaderValue, setNewHeaderValue] = useState('')

  const handleAddWebhook = () => {
    const newWebhook: Webhook = {
      id: String(webhooks.length + 1),
      ...formData,
      failureCount: 0
    }
    setWebhooks([...webhooks, newWebhook])
    setShowAddModal(false)
    resetForm()
  }

  const handleUpdateWebhook = () => {
    if (!editingWebhook) return
    
    setWebhooks(webhooks.map(w => 
      w.id === editingWebhook.id 
        ? { ...w, ...formData }
        : w
    ))
    setEditingWebhook(null)
    resetForm()
  }

  const handleDeleteWebhook = (id: string) => {
    if (confirm('Are you sure you want to delete this webhook?')) {
      setWebhooks(webhooks.filter(w => w.id !== id))
    }
  }

  const handleTestWebhook = async (webhook: Webhook) => {
    setTestingWebhook(webhook.id)
    // Simulate API call
    setTimeout(() => {
      alert(`Test webhook sent to ${webhook.name}`)
      setTestingWebhook(null)
    }, 1500)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      events: [],
      headers: {},
      active: true
    })
    setNewHeaderKey('')
    setNewHeaderValue('')
  }

  const addHeader = () => {
    if (newHeaderKey && newHeaderValue) {
      setFormData({
        ...formData,
        headers: {
          ...formData.headers,
          [newHeaderKey]: newHeaderValue
        }
      })
      setNewHeaderKey('')
      setNewHeaderValue('')
    }
  }

  const removeHeader = (key: string) => {
    const { [key]: _, ...rest } = formData.headers
    setFormData({ ...formData, headers: rest })
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
            Webhook Settings
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Configure webhooks to receive real-time notifications and integrate with external services
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
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
          <PlusIcon />
          Add Webhook
        </button>
      </div>

      {/* Webhook List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {webhooks.map((webhook) => (
          <div key={webhook.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: 0
                  }}>
                    {webhook.name}
                  </h3>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    borderRadius: '9999px',
                    backgroundColor: webhook.active ? '#ecfdf5' : '#f3f4f6',
                    color: webhook.active ? '#059669' : '#6b7280'
                  }}>
                    {webhook.active ? 'Active' : 'Inactive'}
                  </span>
                  {webhook.failureCount > 0 && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '9999px'
                    }}>
                      {webhook.failureCount} failures
                    </span>
                  )}
                </div>

                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: '0 0 1rem 0',
                  fontFamily: 'monospace',
                  backgroundColor: '#f9fafb',
                  padding: '0.5rem',
                  borderRadius: '4px'
                }}>
                  {webhook.url}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {webhook.events.map((event) => (
                    <span key={event} style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: '#f3e8ff',
                      color: '#7c3aed',
                      borderRadius: '4px'
                    }}>
                      {AVAILABLE_EVENTS.find(e => e.value === event)?.label || event}
                    </span>
                  ))}
                </div>

                {webhook.lastTriggered && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    Last triggered: {webhook.lastTriggered}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => handleTestWebhook(webhook)}
                  disabled={testingWebhook === webhook.id}
                  style={{
                    padding: '0.5rem',
                    color: testingWebhook === webhook.id ? '#9ca3af' : '#7c3aed',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: testingWebhook === webhook.id ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (testingWebhook !== webhook.id) {
                      e.currentTarget.style.backgroundColor = '#f3e8ff'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (testingWebhook !== webhook.id) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                  title="Test webhook"
                >
                  <TestIcon />
                </button>
                <button
                  onClick={() => {
                    setEditingWebhook(webhook)
                    setFormData({
                      name: webhook.name,
                      url: webhook.url,
                      events: webhook.events,
                      headers: webhook.headers,
                      active: webhook.active
                    })
                  }}
                  style={{
                    padding: '0.5rem',
                    color: '#6b7280',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  title="Edit webhook"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDeleteWebhook(webhook.id)}
                  style={{
                    padding: '0.5rem',
                    color: '#dc2626',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  title="Delete webhook"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingWebhook) && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 1.5rem 0'
            }}>
              {editingWebhook ? 'Edit Webhook' : 'Add Webhook'}
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault()
              editingWebhook ? handleUpdateWebhook() : handleAddWebhook()
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                    placeholder="e.g., Slack Notifications"
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                    placeholder="https://example.com/webhook"
                    required
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Events
                  </label>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    {AVAILABLE_EVENTS.map((event) => (
                      <label key={event.value} style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.events.includes(event.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                events: [...formData.events, event.value]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                events: formData.events.filter(ev => ev !== event.value)
                              })
                            }
                          }}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#7c3aed',
                            marginRight: '0.5rem'
                          }}
                        />
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {event.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Headers
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {Object.entries(formData.headers).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={key}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: '#f9fafb',
                            fontSize: '0.875rem'
                          }}
                          disabled
                        />
                        <input
                          type="text"
                          value={value}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            backgroundColor: '#f9fafb',
                            fontSize: '0.875rem'
                          }}
                          disabled
                        />
                        <button
                          type="button"
                          onClick={() => removeHeader(key)}
                          style={{
                            color: '#dc2626',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = '#b91c1c'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = '#dc2626'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="text"
                        value={newHeaderKey}
                        onChange={(e) => setNewHeaderKey(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                        placeholder="Header name"
                      />
                      <input
                        type="text"
                        value={newHeaderValue}
                        onChange={(e) => setNewHeaderValue(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                        placeholder="Header value"
                      />
                      <button
                        type="button"
                        onClick={addHeader}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#e5e7eb',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#d1d5db'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#e5e7eb'
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#7c3aed',
                        marginRight: '0.5rem'
                      }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
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
                  {editingWebhook ? 'Update Webhook' : 'Create Webhook'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingWebhook(null)
                    resetForm()
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
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