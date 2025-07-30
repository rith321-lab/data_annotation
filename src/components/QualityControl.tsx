import { useState } from 'react'

// Clean, modern icons
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
)

const AlertTriangleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <path d="M12 9v4"/>
    <path d="m12 17 .01 0"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14"/>
    <path d="M5 12h14"/>
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
  const [activeTab, setActiveTab] = useState<'overview' | 'gold-standards' | 'consensus'>('overview')
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
    <div style={{ padding: '2rem', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 0.5rem 0'
        }}>
          Quality Control
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1rem',
          margin: 0
        }}>
          Monitor and maintain annotation quality across all projects
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                Overall Accuracy
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#059669', margin: 0 }}>
                {metrics.overallAccuracy}%
              </p>
            </div>
            <div style={{
              backgroundColor: '#ecfdf5',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#059669'
            }}>
              <CheckCircleIcon />
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
                Gold Standard Pass
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb', margin: 0 }}>
                {metrics.goldStandardPass}%
              </p>
            </div>
            <div style={{
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#2563eb'
            }}>
              <TrendingUpIcon />
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
                Consensus Agreement
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#7c3aed', margin: 0 }}>
                {metrics.consensusAgreement}%
              </p>
            </div>
            <div style={{
              backgroundColor: '#f3e8ff',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#7c3aed'
            }}>
              <UsersIcon />
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
                Flagged Tasks
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626', margin: 0 }}>
                {metrics.flaggedTasks}
              </p>
            </div>
            <div style={{
              backgroundColor: '#fef2f2',
              borderRadius: '8px',
              padding: '0.75rem',
              color: '#dc2626'
            }}>
              <AlertTriangleIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'gold-standards', label: 'Gold Standards' },
            { key: 'consensus', label: 'Consensus Rules' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? '#111827' : '#6b7280',
                borderBottom: activeTab === tab.key ? '2px solid #7c3aed' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== tab.key) {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 1.5rem 0'
              }}>
                Quality Overview
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Accuracy by Project */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0 0 1rem 0'
                  }}>
                    Accuracy by Project
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { name: 'Image Classification', accuracy: 94.2, color: '#059669' },
                      { name: 'Sentiment Analysis', accuracy: 91.8, color: '#2563eb' },
                      { name: 'Entity Recognition', accuracy: 88.5, color: '#d97706' }
                    ].map((project) => (
                      <div key={project.name}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {project.name}
                          </span>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: project.color
                          }}>
                            {project.accuracy}%
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${project.accuracy}%`,
                            height: '100%',
                            backgroundColor: project.color,
                            borderRadius: '3px'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Worker Performance */}
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0 0 1rem 0'
                  }}>
                    Worker Performance Distribution
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { range: '95-100% accuracy', count: 12, color: '#059669' },
                      { range: '90-95% accuracy', count: 28, color: '#2563eb' },
                      { range: '85-90% accuracy', count: 15, color: '#d97706' },
                      { range: '< 85% accuracy', count: 8, color: '#dc2626' }
                    ].map((item) => (
                      <div key={item.range} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                          {item.range}
                        </span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: item.color
                        }}>
                          {item.count} workers
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gold Standards Tab */}
          {activeTab === 'gold-standards' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Gold Standard Questions
                </h2>
                <button
                  onClick={() => setShowAddGoldStandard(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
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
                  <PlusIcon />
                  Add Gold Standard
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {goldStandards.map((standard) => (
                  <div key={standard.id} style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 0.5rem 0'
                        }}>
                          {standard.projectName}
                        </h3>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          margin: '0 0 0.25rem 0'
                        }}>
                          <strong>Q:</strong> {standard.question}
                        </p>
                        <p style={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          margin: 0
                        }}>
                          <strong>A:</strong> {standard.correctAnswer}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          color: '#059669',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {standard.passRate}%
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          margin: 0
                        }}>
                          Pass rate
                        </p>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.75rem',
                      color: '#6b7280'
                    }}>
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
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 0.5rem 0'
                }}>
                  Consensus Configuration
                </h2>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Set minimum agreement levels for each project
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {consensusRules.map((rule) => (
                  <div key={rule.id} style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 1rem 0'
                        }}>
                          {rule.projectName}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#374151',
                            margin: 0
                          }}>
                            Minimum agreement: <strong>{rule.minAgreement}%</strong>
                          </p>
                          <p style={{
                            fontSize: '0.875rem',
                            color: '#374151',
                            margin: 0
                          }}>
                            Minimum responses: <strong>{rule.minResponses}</strong>
                          </p>
                        </div>
                      </div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) => {
                            setConsensusRules(consensusRules.map(r =>
                              r.id === rule.id ? { ...r, enabled: e.target.checked } : r
                            ))
                          }}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#7c3aed'
                          }}
                        />
                        <span style={{
                          fontSize: '0.875rem',
                          color: '#374151',
                          fontWeight: '500'
                        }}>
                          Enabled
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add Gold Standard Modal */}
      {showAddGoldStandard && (
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
              Add Gold Standard Question
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              setShowAddGoldStandard(false)
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Project
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  backgroundColor: 'white'
                }}>
                  <option>Image Classification - Products</option>
                  <option>Sentiment Analysis</option>
                  <option>Medical Entity Recognition</option>
                </select>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Question
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter the question"
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
                  Correct Answer
                </label>
                <input
                  type="text"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Enter the correct answer"
                  required
                />
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
                  Add Gold Standard
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGoldStandard(false)}
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