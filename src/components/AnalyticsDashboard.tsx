import { useState, useEffect } from 'react'

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
  
  // Mock data - in production, this would come from the backend
  const [performanceData] = useState({
    accuracy: [92, 93, 91, 94, 93, 95, 94],
    throughput: [1200, 1350, 1100, 1450, 1300, 1500, 1400],
    quality: [88, 89, 87, 91, 90, 92, 91],
    efficiency: [78, 80, 76, 82, 81, 85, 83]
  })

  const [metrics] = useState<PerformanceMetric[]>([
    { label: 'Overall Accuracy', value: 94.2, change: 2.1, forecast: 95.8 },
    { label: 'Task Throughput', value: 1400, change: 7.7, forecast: 1520 },
    { label: 'Quality Score', value: 91.0, change: 3.4, forecast: 92.5 },
    { label: 'Worker Efficiency', value: 83.0, change: 5.1, forecast: 86.2 }
  ])

  useEffect(() => {
    // Simulate ML insights generation
    generateInsights()
  }, [timeRange])

  const generateInsights = () => {
    setInsights([
      {
        id: '1',
        type: 'anomaly',
        title: 'Unusual drop in accuracy detected',
        description: 'Worker group B showed 15% lower accuracy than average on image classification tasks yesterday.',
        impact: 'high',
        data: { group: 'B', drop: 15, task: 'image_classification' }
      },
      {
        id: '2',
        type: 'trend',
        title: 'Increasing annotation speed',
        description: 'Average time per annotation has decreased by 23% over the past week while maintaining quality.',
        impact: 'medium',
        data: { improvement: 23, metric: 'speed' }
      },
      {
        id: '3',
        type: 'prediction',
        title: 'Project completion forecast',
        description: 'Based on current velocity, Project Alpha will complete 2 days ahead of schedule.',
        impact: 'medium',
        data: { project: 'Alpha', daysAhead: 2 }
      },
      {
        id: '4',
        type: 'recommendation',
        title: 'Optimize task distribution',
        description: 'Reassigning 20% of text tasks to Team C could improve overall throughput by 12%.',
        impact: 'high',
        data: { optimization: 12, team: 'C' }
      }
    ])
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
      case 'anomaly': return 'text-red-600 bg-red-100'
      case 'trend': return 'text-blue-600 bg-blue-100'
      case 'prediction': return 'text-purple-600 bg-purple-100'
      case 'recommendation': return 'text-green-600 bg-green-100'
    }
  }

  const getImpactBadge = (impact: MLInsight['impact']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return colors[impact]
  }

  // Mock chart component
  const SimpleChart = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min

    return (
      <div className="relative h-32 flex items-end gap-1">
        {data.map((value, index) => (
          <div
            key={index}
            className="flex-1 bg-current rounded-t transition-all duration-300 hover:opacity-80"
            style={{
              height: `${((value - min) / range) * 100 || 50}%`,
              color: color
            }}
            title={`${value}`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & ML Insights</h1>
          <p className="text-gray-600">AI-powered analytics and performance predictions</p>
        </div>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics with Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">{metric.label}</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">
                {metric.label.includes('Accuracy') || metric.label.includes('Score') || metric.label.includes('Efficiency')
                  ? `${metric.value}%`
                  : metric.value.toLocaleString()
                }
              </span>
              <span className={`text-sm font-medium ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Forecast: {metric.label.includes('Accuracy') || metric.label.includes('Score') || metric.label.includes('Efficiency')
                ? `${metric.forecast}%`
                : metric.forecast.toLocaleString()
              }
            </div>
            <div className="mt-2 h-8">
              <SimpleChart 
                data={performanceData[metric.label.toLowerCase().includes('accuracy') ? 'accuracy' : 
                      metric.label.toLowerCase().includes('throughput') ? 'throughput' :
                      metric.label.toLowerCase().includes('quality') ? 'quality' : 'efficiency']}
                color="#8b5cf6"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ML Insights */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BrainIcon />
            ML-Powered Insights
          </h2>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getInsightColor(insight.type)}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{insight.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getImpactBadge(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    {insight.type === 'recommendation' && (
                      <button className="mt-2 text-sm text-purple-600 hover:text-purple-800">
                        Apply recommendation →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Worker Performance Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Worker Performance Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Top Performers (95%+)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: '18%' }} />
                </div>
                <span className="text-sm font-medium">18%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">High Performers (85-95%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average (75-85%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '28%' }} />
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Need Improvement (&lt;75%)</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-200 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: '9%' }} />
                </div>
                <span className="text-sm font-medium">9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Type Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Task Type</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Image Classification</span>
                <span className="font-medium">96.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96.2%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Text Analysis</span>
                <span className="font-medium">92.8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Entity Recognition</span>
                <span className="font-medium">89.5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89.5%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Audio Transcription</span>
                <span className="font-medium">87.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '87.3%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Model Performance */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">AI Suggestion Model Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">84.3%</div>
            <p className="text-sm text-gray-600">Suggestion Acceptance Rate</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">2.3x</div>
            <p className="text-sm text-gray-600">Speed Improvement</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">-31%</div>
            <p className="text-sm text-gray-600">Error Reduction</p>
          </div>
        </div>
      </div>
    </div>
  )
}