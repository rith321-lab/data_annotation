import { useState } from 'react'

// Icons
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

interface Report {
  id: string
  name: string
  type: 'project' | 'worker' | 'quality' | 'financial'
  generatedAt: string
  size: string
  status: 'ready' | 'generating' | 'scheduled'
}

interface ChartData {
  label: string
  value: number
}

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'custom' | 'scheduled'>('overview')
  const [dateRange, setDateRange] = useState('last-30-days')
  const [selectedProject, setSelectedProject] = useState('all')
  const [generatingReport, setGeneratingReport] = useState(false)

  const [recentReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Monthly Performance Report - January 2024',
      type: 'quality',
      generatedAt: '2024-01-26 14:30',
      size: '2.4 MB',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Worker Productivity Analysis',
      type: 'worker',
      generatedAt: '2024-01-25 09:15',
      size: '1.8 MB',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Project Cost Summary - Q4 2023',
      type: 'financial',
      generatedAt: '2024-01-20 16:45',
      size: '956 KB',
      status: 'ready'
    }
  ])

  const [projectStats] = useState<ChartData[]>([
    { label: 'Image Classification', value: 4567 },
    { label: 'Sentiment Analysis', value: 3234 },
    { label: 'Entity Recognition', value: 2890 },
    { label: 'Content Moderation', value: 1567 }
  ])

  const generateReport = async (reportType: string) => {
    setGeneratingReport(true)
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false)
      alert(`${reportType} report generated successfully!`)
    }, 2000)
  }

  const downloadReport = (report: Report) => {
    // Mock download
    alert(`Downloading ${report.name}...`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and export detailed reports</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
          <select 
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Projects</option>
            <option value="1">Image Classification</option>
            <option value="2">Sentiment Analysis</option>
            <option value="3">Entity Recognition</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Tasks</h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
              <path d="M9 11H3v10h6V11zM15 3H9v18h6V3zM21 7h-6v14h6V7z"/>
            </svg>
          </div>
          <p className="text-2xl font-bold">12,458</p>
          <p className="text-xs text-green-600">+15% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Active Workers</h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p className="text-2xl font-bold">63</p>
          <p className="text-xs text-green-600">+8% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Accuracy</h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <p className="text-2xl font-bold">94.2%</p>
          <p className="text-xs text-red-600">-0.5% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Cost</h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <p className="text-2xl font-bold">$4,892</p>
          <p className="text-xs text-green-600">-12% from last month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'custom'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Custom Reports
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'scheduled'
                  ? 'border-b-2 border-purple-500 text-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Scheduled Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Tasks by Project Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tasks by Project</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    {projectStats.map((project) => (
                      <div key={project.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{project.label}</span>
                          <span className="font-medium">{project.value.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-600 h-3 rounded-full" 
                            style={{ width: `${(project.value / 5000) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => generateReport('Performance')}
                        disabled={generatingReport}
                        className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 disabled:opacity-50"
                      >
                        Generate Performance Report
                      </button>
                      <button
                        onClick={() => generateReport('Financial')}
                        disabled={generatingReport}
                        className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 disabled:opacity-50"
                      >
                        Generate Financial Report
                      </button>
                      <button
                        onClick={() => generateReport('Quality')}
                        disabled={generatingReport}
                        className="w-full text-left px-3 py-2 bg-white rounded border hover:bg-gray-50 disabled:opacity-50"
                      >
                        Generate Quality Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentReports.map((report) => (
                        <tr key={report.id}>
                          <td className="px-4 py-3 text-sm">{report.name}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              report.type === 'quality' ? 'bg-green-100 text-green-800' :
                              report.type === 'worker' ? 'bg-blue-100 text-blue-800' :
                              report.type === 'financial' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{report.generatedAt}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{report.size}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => downloadReport(report)}
                              className="text-purple-600 hover:text-purple-800"
                            >
                              <DownloadIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Custom Reports Tab */}
          {activeTab === 'custom' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Create Custom Report</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault()
                generateReport('Custom')
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                      <option value="comprehensive">Comprehensive Analysis</option>
                      <option value="worker">Worker Performance</option>
                      <option value="project">Project Summary</option>
                      <option value="quality">Quality Metrics</option>
                      <option value="financial">Financial Report</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Include Sections</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm">Executive Summary</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm">Detailed Analytics</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm">Worker Performance</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm">Financial Breakdown</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={generatingReport}
                  className="w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {generatingReport ? 'Generating...' : 'Generate Report'}
                </button>
              </form>
            </div>
          )}

          {/* Scheduled Reports Tab */}
          {activeTab === 'scheduled' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Scheduled Reports</h3>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                  Schedule New Report
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Performance Report</h4>
                      <p className="text-sm text-gray-600 mt-1">Every Monday at 9:00 AM</p>
                      <p className="text-sm text-gray-500">Recipients: team@company.com</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm">Active</span>
                    </label>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">Monthly Financial Summary</h4>
                      <p className="text-sm text-gray-600 mt-1">1st of every month at 8:00 AM</p>
                      <p className="text-sm text-gray-500">Recipients: finance@company.com, cfo@company.com</p>
                    </div>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm">Active</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}