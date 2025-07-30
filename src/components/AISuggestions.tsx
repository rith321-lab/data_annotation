import { useState } from 'react'

// Icons
const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
)

const LightbulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
  </svg>
)

const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

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

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

interface AISuggestion {
  id: string
  type: 'quality_improvement' | 'efficiency' | 'accuracy' | 'workflow'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  projectId?: string
  projectName?: string
  actionable: boolean
}

export const AISuggestions = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions' | 'settings'>('overview')
  const [suggestions] = useState<AISuggestion[]>([
    {
      id: '1',
      type: 'quality_improvement',
      title: 'Improve Gold Standard Questions',
      description: 'Add 3 more gold standard questions to the Image Classification project to improve quality control accuracy from 94.2% to 97.1%.',
      impact: 'high',
      confidence: 89,
      projectId: '1',
      projectName: 'Image Classification - Products',
      actionable: true
    },
    {
      id: '2',
      type: 'efficiency',
      title: 'Optimize Task Distribution',
      description: 'Redistribute tasks based on worker expertise. Sarah Johnson shows 15% higher accuracy on sentiment analysis tasks.',
      impact: 'medium',
      confidence: 76,
      actionable: true
    },
    {
      id: '3',
      type: 'accuracy',
      title: 'Review Consensus Rules',
      description: 'Lower minimum agreement threshold for Medical Entity Recognition from 85% to 80% to reduce bottlenecks while maintaining quality.',
      impact: 'medium',
      confidence: 82,
      projectId: '3',
      projectName: 'Medical Entity Recognition',
      actionable: true
    },
    {
      id: '4',
      type: 'workflow',
      title: 'Automated Quality Checks',
      description: 'Implement automated pre-screening for obvious errors. Could reduce manual review time by 23%.',
      impact: 'high',
      confidence: 91,
      actionable: false
    }
  ])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
      case 'medium': return { bg: '#fef3c7', text: '#d97706', border: '#fed7aa' }
      case 'low': return { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' }
      default: return { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quality_improvement': return <CheckCircleIcon />
      case 'efficiency': return <TrendingUpIcon />
      case 'accuracy': return <AlertTriangleIcon />
      case 'workflow': return <SettingsIcon />
      default: return <LightbulbIcon />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quality_improvement': return '#059669'
      case 'efficiency': return '#2563eb'
      case 'accuracy': return '#dc2626'
      case 'workflow': return '#7c3aed'
      default: return '#6b7280'
    }
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
          AI Suggestions
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '1rem', 
          margin: 0 
        }}>
          AI-powered insights to optimize your annotation workflow and quality
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
                Active Suggestions
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#7c3aed', margin: 0 }}>
                {suggestions.length}
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#f3e8ff', 
              borderRadius: '8px', 
              padding: '0.75rem',
              color: '#7c3aed'
            }}>
              <BrainIcon />
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
                High Impact
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626', margin: 0 }}>
                {suggestions.filter(s => s.impact === 'high').length}
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
                Avg Confidence
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#059669', margin: 0 }}>
                {Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)}%
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
                Actionable Now
              </p>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb', margin: 0 }}>
                {suggestions.filter(s => s.actionable).length}
              </p>
            </div>
            <div style={{ 
              backgroundColor: '#eff6ff', 
              borderRadius: '8px', 
              padding: '0.75rem',
              color: '#2563eb'
            }}>
              <LightbulbIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Simple suggestions list for now */}
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
            Recent AI Insights
          </h2>
        </div>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {suggestions.slice(0, 3).map((suggestion) => {
              const impactColor = getImpactColor(suggestion.impact)
              const typeColor = getTypeColor(suggestion.type)

              return (
                <div key={suggestion.id} style={{
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        color: typeColor,
                        backgroundColor: `${typeColor}20`,
                        padding: '0.5rem',
                        borderRadius: '6px'
                      }}>
                        {getTypeIcon(suggestion.type)}
                      </div>
                      <div>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: '0 0 0.25rem 0'
                        }}>
                          {suggestion.title}
                        </h3>
                        {suggestion.projectName && (
                          <p style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            margin: 0
                          }}>
                            {suggestion.projectName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '4px',
                        backgroundColor: impactColor.bg,
                        color: impactColor.text,
                        border: `1px solid ${impactColor.border}`,
                        textTransform: 'capitalize'
                      }}>
                        {suggestion.impact} impact
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {suggestion.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#374151',
                    margin: '0 0 1rem 0',
                    lineHeight: '1.5'
                  }}>
                    {suggestion.description}
                  </p>
                  {suggestion.actionable && (
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Apply Suggestion
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}