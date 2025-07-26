import { useState } from 'react'

// Icons
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const AlertCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

interface GoldStandard {
  id: string
  projectId: string
  projectName: string
  question: string
  correctAnswer: string
  totalAttempts: number
  passRate: number
  lastUpdated: string
}

interface ConsensusRule {
  id: string
  projectId: string
  projectName: string
  minAgreement: number
  minResponses: number
  enabled: boolean
}

interface QualityMetrics {
  overallAccuracy: number
  goldStandardPass: number
  consensusAgreement: number
  flaggedTasks: number
}

export const QualityControl = () => {
  const [activeTab, setActiveTab] = useState<'gold-standards' | 'consensus' | 'metrics'>('gold-standards')
  const [goldStandards, setGoldStandards] = useState<GoldStandard[]>([
    {
      id: '1',
      projectId: '1',
      projectName: 'Image Classification - Products',
      question: 'Is this a smartphone?',
      correctAnswer: 'Yes',
      totalAttempts: 245,
      passRate: 94.3,
      lastUpdated: '2024-01-25'
    },
    {
      id: '2',
      projectId: '1',
      projectName: 'Image Classification - Products',
      question: 'What color is the product?',
      correctAnswer: 'Black',
      totalAttempts: 189,
      passRate: 87.8,
      lastUpdated: '2024-01-24'
    },
    {
      id: '3',
      projectId: '2',
      projectName: 'Sentiment Analysis',
      question: 'What is the sentiment of this review?',
      correctAnswer: 'Negative',
      totalAttempts: 567,
      passRate: 91.2,
      lastUpdated: '2024-01-26'
    }
  ])

  const [consensusRules, setConsensusRules] = useState<ConsensusRule[]>([
    {
      id: '1',
      projectId: '1',
      projectName: 'Image Classification - Products',
      minAgreement: 80,
      minResponses: 3,
      enabled: true
    },
    {
      id: '2',
      projectId: '2',
      projectName: 'Sentiment Analysis',
      minAgreement: 75,
      minResponses: 5,
      enabled: true
    },
    {
      id: '3',
      projectId: '3',
      projectName: 'Medical Entity Recognition',
      minAgreement: 90,
      minResponses: 7,
      enabled: false
    }
  ])

  const [metrics] = useState<QualityMetrics>({
    overallAccuracy: 92.5,
    goldStandardPass: 89.7,
    consensusAgreement: 85.3,
    flaggedTasks: 23
  })

  const [showAddGoldStandard, setShowAddGoldStandard] = useState(false)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quality Control</h1>
        <p className="text-gray-600">Manage quality standards and consensus rules</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Accuracy</p>
              <p className="text-2xl font-bold text-green-600">{metrics.overallAccuracy}%</p>
            </div>
            <CheckCircleIcon />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gold Standard Pass</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.goldStandardPass}%</p>
            </div>
            <TrendingUpIcon />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consensus Agreement</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.consensusAgreement}%</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flagged Tasks</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.flaggedTasks}</p>
            </div>
            <AlertCircleIcon />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('gold-standards')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'gold-standards'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Gold Standards
            </button>
            <button
              onClick={() => setActiveTab('consensus')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'consensus'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Consensus Rules
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'metrics'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Detailed Metrics
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Gold Standards Tab */}
          {activeTab === 'gold-standards' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Gold Standard Questions</h2>
                <button
                  onClick={() => setShowAddGoldStandard(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Gold Standard
                </button>
              </div>

              <div className="space-y-4">
                {goldStandards.map((standard) => (
                  <div key={standard.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{standard.projectName}</h3>
                        <p className="text-sm text-gray-600 mt-1">Q: {standard.question}</p>
                        <p className="text-sm text-gray-600">A: {standard.correctAnswer}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{standard.passRate}%</div>
                        <p className="text-xs text-gray-500">Pass rate</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <span>{standard.totalAttempts} attempts</span>
                      <span>Updated {standard.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Consensus Rules Tab */}
          {activeTab === 'consensus' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Consensus Configuration</h2>
                <p className="text-sm text-gray-600">Set minimum agreement levels for each project</p>
              </div>

              <div className="space-y-4">
                {consensusRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{rule.projectName}</h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            Minimum agreement: <span className="font-medium">{rule.minAgreement}%</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Minimum responses: <span className="font-medium">{rule.minResponses}</span>
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => {
                            setConsensusRules(consensusRules.map(r => 
                              r.id === rule.id ? { ...r, enabled: e.target.checked } : r
                            ))
                          }}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Metrics Tab */}
          {activeTab === 'metrics' && (
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Performance Metrics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Accuracy by Project */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Accuracy by Project</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Image Classification</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '94.2%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sentiment Analysis</span>
                        <span className="font-medium">91.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '91.8%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Entity Recognition</span>
                        <span className="font-medium">88.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '88.5%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Worker Performance Distribution */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Worker Performance Distribution</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>95-100% accuracy</span>
                      <span className="font-medium">12 workers</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>90-95% accuracy</span>
                      <span className="font-medium">28 workers</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>85-90% accuracy</span>
                      <span className="font-medium">15 workers</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>&lt; 85% accuracy</span>
                      <span className="font-medium text-orange-600">8 workers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Gold Standard Modal */}
      {showAddGoldStandard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Gold Standard Question</h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              setShowAddGoldStandard(false)
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                  <option>Image Classification - Products</option>
                  <option>Sentiment Analysis</option>
                  <option>Medical Entity Recognition</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter the question"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter the correct answer"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add Gold Standard
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGoldStandard(false)}
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