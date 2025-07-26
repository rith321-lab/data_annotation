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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhook Settings</h1>
          <p className="text-gray-600">Configure webhooks to receive real-time notifications</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <PlusIcon />
          Add Webhook
        </button>
      </div>

      {/* Webhook List */}
      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{webhook.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    webhook.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {webhook.active ? 'Active' : 'Inactive'}
                  </span>
                  {webhook.failureCount > 0 && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      {webhook.failureCount} failures
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{webhook.url}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {webhook.events.map((event) => (
                    <span key={event} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      {AVAILABLE_EVENTS.find(e => e.value === event)?.label || event}
                    </span>
                  ))}
                </div>

                {webhook.lastTriggered && (
                  <p className="text-xs text-gray-500">
                    Last triggered: {webhook.lastTriggered}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTestWebhook(webhook)}
                  disabled={testingWebhook === webhook.id}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded disabled:opacity-50"
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
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                  title="Edit webhook"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDeleteWebhook(webhook.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingWebhook ? 'Edit Webhook' : 'Add Webhook'}
            </h2>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              editingWebhook ? handleUpdateWebhook() : handleAddWebhook()
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Slack Notifications"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/webhook"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Events</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                    {AVAILABLE_EVENTS.map((event) => (
                      <label key={event.value} className="flex items-center">
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
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm">{event.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Headers</label>
                  <div className="space-y-2">
                    {Object.entries(formData.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={key}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          disabled
                        />
                        <input
                          type="text"
                          value={value}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                          disabled
                        />
                        <button
                          type="button"
                          onClick={() => removeHeader(key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newHeaderKey}
                        onChange={(e) => setNewHeaderKey(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Header name"
                      />
                      <input
                        type="text"
                        value={newHeaderValue}
                        onChange={(e) => setNewHeaderValue(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Header value"
                      />
                      <button
                        type="button"
                        onClick={addHeader}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">Active</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
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