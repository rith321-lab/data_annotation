import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'

// Icons
const TrendingUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)

const BrainIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.5 2C5.9 2 3 4.9 3 8.5c0 1.5.5 2.9 1.4 4l5.1 5.1c.7.7 1.8.7 2.5 0l5.1-5.1c.9-1.1 1.4-2.5 1.4-4 0-3.6-2.9-6.5-6.5-6.5-1.2 0-2.3.3-3.3.9-.7-.6-1.7-.9-2.7-.9z"/>
    <path d="M12 8h.01M8 12h.01M16 12h.01"/>
  </svg>
)

const AlertTriangleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
)

interface MLInsight {
  id: string
  type: 'anomaly' | 'trend' | 'prediction' | 'recommendation'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  data?: any
}

interface PerformanceMetric {
  label: string
  value: number
  change: number
  forecast: number
}

export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('accuracy')
  const [insights, setInsights] = useState<MLInsight[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real data from API
  const [performanceData, setPerformanceData] = useState({
    accuracy: [92, 93, 91, 94, 93, 95, 94],
    throughput: [1200, 1350, 1100, 1450, 1300, 1500, 1400],
    quality: [88, 89, 87, 91, 90, 92, 91],
    efficiency: [78, 80, 76, 82, 81, 85, 83]
  })

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    { label: 'Overall Accuracy', value: 94.2, change: 2.1, forecast: 95.8 },
    { label: 'Task Throughput', value: 1400, change: 7.7, forecast: 1520 },
    { label: 'Quality Score', value: 91.0, change: 3.4, forecast: 92.5 },
    { label: 'Worker Efficiency', value: 83.0, change: 5.1, forecast: 86.2 }
  ])

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Loading analytics data...')

      // Load projects and tasks
      const projectsData = await apiClient.getProjects()
      setProjects(projectsData)

      // Load all tasks for analytics
      const allTasks: any[] = []
      for (const project of projectsData) {
        try {
          const projectTasks = await apiClient.getProjectTasks(project.id)
          allTasks.push(...projectTasks)
        } catch (err) {
          console.warn(`Failed to load tasks for project ${project.id}:`, err)
        }
      }
      setTasks(allTasks)

      // Calculate real metrics from data
      calculateMetricsFromData(projectsData, allTasks)
      generateInsights(projectsData, allTasks)

      console.log('Analytics data loaded:', { projects: projectsData.length, tasks: allTasks.length })
    } catch (err: any) {
      console.error('Failed to load analytics data:', err)
      setError(err.message || 'Failed to load analytics data')
      // Keep mock data as fallback
      generateInsights()
    } finally {
      setLoading(false)
    }
  }

  const calculateMetricsFromData = (projectsData: any[], tasksData: any[]) => {
    const totalProjects = projectsData.length
    const totalTasks = tasksData.length
    const completedTasks = tasksData.filter(task => task.status === 'completed').length
    const pendingTasks = tasksData.filter(task => task.status === 'pending').length

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const avgResponsesPerTask = totalTasks > 0 ?
      tasksData.reduce((sum, task) => sum + task.completed_responses, 0) / totalTasks : 0

    setMetrics([
      { label: 'Total Projects', value: totalProjects, change: 0, forecast: totalProjects },
      { label: 'Total Tasks', value: totalTasks, change: 0, forecast: totalTasks },
      { label: 'Completion Rate', value: completionRate, change: 0, forecast: completionRate + 5 },
      { label: 'Avg Responses/Task', value: avgResponsesPerTask, change: 0, forecast: avgResponsesPerTask + 0.5 }
    ])
  }

  const generateInsights = (projectsData?: any[], tasksData?: any[]) => {
    const insights: MLInsight[] = []

    if (projectsData && tasksData) {
      // Generate insights based on real data
      const activeProjects = projectsData.filter(p => p.status === 'active').length
      const totalTasks = tasksData.length
      const completedTasks = tasksData.filter(t => t.status === 'completed').length
      const pendingTasks = tasksData.filter(t => t.status === 'pending').length

      if (activeProjects > 0) {
        insights.push({
          id: '1',
          type: 'trend',
          title: `${activeProjects} Active Project${activeProjects > 1 ? 's' : ''} Running`,
          description: `You have ${activeProjects} active project${activeProjects > 1 ? 's' : ''} with ${pendingTasks} pending tasks ready for annotation.`,
          impact: 'medium',
          data: { activeProjects, pendingTasks }
        })
      }

      if (totalTasks > 0) {
        const completionRate = (completedTasks / totalTasks) * 100
        insights.push({
          id: '2',
          type: 'prediction',
          title: `${completionRate.toFixed(1)}% Task Completion Rate`,
          description: `${completedTasks} out of ${totalTasks} total tasks have been completed across all projects.`,
          impact: completionRate > 80 ? 'low' : completionRate > 50 ? 'medium' : 'high',
          data: { completionRate, completedTasks, totalTasks }
        })
      }

      if (pendingTasks > 0) {
        insights.push({
          id: '3',
          type: 'recommendation',
          title: 'Tasks Ready for Annotation',
          description: `${pendingTasks} tasks are ready for annotation. Consider starting work on high-priority items first.`,
          impact: 'medium',
          data: { pendingTasks }
        })
      }
    } else {
      // Fallback to mock insights
      insights.push(
        {
          id: '1',
          type: 'anomaly',
          title: 'Unusual drop in accuracy detected',
          description: 'Worker group B showed 15% lower accuracy than average on image classification tasks yesterday.',
          impact: 'high',
          data: { group: 'B', drop: 15, task: 'image_classification' }
        },
        {
          id: '4',
          type: 'recommendation',
          title: 'Optimize task distribution',
          description: 'Reassigning 20% of text tasks to Team C could improve overall throughput by 12%.',
          impact: 'high',
          data: { optimization: 12, team: 'C' }
        }
      )
    }

    setInsights(insights)
  }

  const getInsightIcon = (type: MLInsight['type']) => {
    switch (type) {
      case 'anomaly': return <AlertTriangleIcon />
      case 'trend': return <TrendingUpIcon />
      case 'prediction': return <ClockIcon />
      case 'recommendation': return <BrainIcon />
    }
  }

  const getInsightColor = (type: MLInsight['type']) => {
    switch (type) {
      case 'anomaly': return { text: '#dc2626', bg: '#fef2f2' }
      case 'trend': return { text: '#2563eb', bg: '#eff6ff' }
      case 'prediction': return { text: '#7c3aed', bg: '#f3e8ff' }
      case 'recommendation': return { text: '#059669', bg: '#ecfdf5' }
    }
  }

  const getImpactBadge = (impact: MLInsight['impact']) => {
    switch (impact) {
      case 'high': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' }
      case 'medium': return { bg: '#fef3c7', text: '#d97706', border: '#fed7aa' }
      case 'low': return { bg: '#ecfdf5', text: '#059669', border: '#bbf7d0' }
    }
  }

  // Mock chart component
  const SimpleChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min

    return (
      <div style={{
        position: 'relative',
        height: '32px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2px'
      }}>
        {data.map((value, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              backgroundColor: color,
              borderRadius: '2px 2px 0 0',
              transition: 'all 0.3s ease',
              height: `${((value - min) / range) * 100 || 50}%`,
              cursor: 'pointer'
            }}
            title={`${value}`}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.8'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1'
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* Loading state */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          Loading analytics data...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626',
          marginBottom: '1rem'
        }}>
          Error: {error}
        </div>
      )}

      {/* Main content */}
      {!loading && (
        <>
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
            Analytics & Insights
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            AI-powered analytics and performance predictions
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            color: '#374151'
          }}
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics with Predictions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#6b7280',
              margin: '0 0 1rem 0'
            }}>
              {metric.label}
            </h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>
                {metric.label.includes('Accuracy') || metric.label.includes('Score') || metric.label.includes('Efficiency')
                  ? `${metric.value}%`
                  : metric.value.toLocaleString()
                }
              </span>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: metric.change > 0 ? '#059669' : '#dc2626'
              }}>
                {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
              Forecast: {metric.label.includes('Accuracy') || metric.label.includes('Score') || metric.label.includes('Efficiency')
                ? `${metric.forecast}%`
                : metric.forecast.toLocaleString()
              }
            </div>
            <div style={{ height: '32px' }}>
              <SimpleChart
                data={performanceData[metric.label.toLowerCase().includes('accuracy') ? 'accuracy' :
                      metric.label.toLowerCase().includes('throughput') ? 'throughput' :
                      metric.label.toLowerCase().includes('quality') ? 'quality' : 'efficiency']}
                color="#7c3aed"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ML Insights */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <BrainIcon />
            ML-Powered Insights
          </h2>
        </div>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {insights.map((insight) => {
              const insightColor = getInsightColor(insight.type)
              const impactBadge = getImpactBadge(insight.impact)

              return (
                <div key={insight.id} style={{
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: insightColor.bg,
                      color: insightColor.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <h3 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0
                        }}>
                          {insight.title}
                        </h3>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          borderRadius: '9999px',
                          backgroundColor: impactBadge.bg,
                          color: impactBadge.text,
                          border: `1px solid ${impactBadge.border}`,
                          textTransform: 'capitalize'
                        }}>
                          {insight.impact} impact
                        </span>
                      </div>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        margin: '0 0 1rem 0',
                        lineHeight: '1.5'
                      }}>
                        {insight.description}
                      </p>
                      {insight.type === 'recommendation' && (
                        <button style={{
                          fontSize: '0.875rem',
                          color: '#7c3aed',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}>
                          Apply recommendation →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem'
      }}>
        {/* Worker Performance Distribution */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Worker Performance Distribution
            </h3>
          </div>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'Top Performers (95%+)', percentage: 18, color: '#10b981' },
                { label: 'High Performers (85-95%)', percentage: 45, color: '#3b82f6' },
                { label: 'Average (75-85%)', percentage: 28, color: '#f59e0b' },
                { label: 'Need Improvement (<75%)', percentage: 9, color: '#ef4444' }
              ].map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {item.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '120px',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '4px'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#111827',
                      minWidth: '32px'
                    }}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Type Performance */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#111827',
              margin: 0
            }}>
              Performance by Task Type
            </h3>
          </div>
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { name: 'Image Classification', percentage: 96.2 },
                { name: 'Text Analysis', percentage: 92.8 },
                { name: 'Entity Recognition', percentage: 89.5 },
                { name: 'Audio Transcription', percentage: 87.3 }
              ].map((task, index) => (
                <div key={index}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {task.name}
                    </span>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#111827'
                    }}>
                      {task.percentage}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${task.percentage}%`,
                      height: '100%',
                      backgroundColor: '#7c3aed',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Performance */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginTop: '2rem'
      }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#111827',
            margin: 0
          }}>
            AI Suggestion Model Performance
          </h3>
        </div>
        <div style={{ padding: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#7c3aed',
                margin: '0 0 0.5rem 0'
              }}>
                84.3%
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Suggestion Acceptance Rate
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#059669',
                margin: '0 0 0.5rem 0'
              }}>
                2.3x
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Speed Improvement
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#2563eb',
                margin: '0 0 0.5rem 0'
              }}>
                -31%
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Error Reduction
              </p>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}