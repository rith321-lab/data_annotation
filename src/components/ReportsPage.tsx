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
            Reports & Analytics
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Generate and export detailed reports with custom analytics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="custom">Custom range</option>
          </select>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              backgroundColor: 'white'
            }}
          >
            <option value="all">All Projects</option>
            <option value="1">Image Classification</option>
            <option value="2">Sentiment Analysis</option>
            <option value="3">Entity Recognition</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
              Total Tasks
            </h3>
            <div style={{ color: '#7c3aed' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H3v10h6V11zM15 3H9v18h6V3zM21 7h-6v14h6V7z"/>
              </svg>
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>
            12,458
          </p>
          <p style={{ fontSize: '0.75rem', color: '#059669', margin: 0 }}>
            +15% from last month
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
              Active Workers
            </h3>
            <div style={{ color: '#2563eb' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>
            63
          </p>
          <p style={{ fontSize: '0.75rem', color: '#059669', margin: 0 }}>
            +8% from last month
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
              Avg Accuracy
            </h3>
            <div style={{ color: '#059669' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>
            94.2%
          </p>
          <p style={{ fontSize: '0.75rem', color: '#dc2626', margin: 0 }}>
            -0.5% from last month
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>
              Total Cost
            </h3>
            <div style={{ color: '#d97706' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>
            $4,892
          </p>
          <p style={{ fontSize: '0.75rem', color: '#059669', margin: 0 }}>
            -12% from last month
          </p>
        </div>
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
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                backgroundColor: activeTab === 'overview' ? 'white' : 'transparent',
                color: activeTab === 'overview' ? '#111827' : '#6b7280',
                borderBottom: activeTab === 'overview' ? '2px solid #7c3aed' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'overview') {
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'overview') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                backgroundColor: activeTab === 'custom' ? 'white' : 'transparent',
                color: activeTab === 'custom' ? '#111827' : '#6b7280',
                borderBottom: activeTab === 'custom' ? '2px solid #7c3aed' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'custom') {
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'custom') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              Custom Reports
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              style={{
                padding: '1rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                border: 'none',
                backgroundColor: activeTab === 'scheduled' ? 'white' : 'transparent',
                color: activeTab === 'scheduled' ? '#111827' : '#6b7280',
                borderBottom: activeTab === 'scheduled' ? '2px solid #7c3aed' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'scheduled') {
                  e.currentTarget.style.color = '#374151'
                }
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'scheduled') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              Scheduled Reports
            </button>
          </nav>
        </div>

        <div style={{ padding: '2rem' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Tasks by Project Chart */}
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 1.5rem 0'
                }}>
                  Tasks by Project
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {projectStats.map((project) => (
                      <div key={project.label}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '0.875rem',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{ color: '#374151' }}>{project.label}</span>
                          <span style={{ fontWeight: '500', color: '#111827' }}>
                            {project.value.toLocaleString()}
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '12px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '6px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(project.value / 5000) * 100}%`,
                            height: '100%',
                            backgroundColor: '#7c3aed',
                            borderRadius: '6px',
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#111827',
                      margin: '0 0 1rem 0'
                    }}>
                      Quick Actions
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        onClick={() => generateReport('Performance')}
                        disabled={generatingReport}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: generatingReport ? 'not-allowed' : 'pointer',
                          opacity: generatingReport ? 0.5 : 1,
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (!generatingReport) {
                            e.currentTarget.style.backgroundColor = '#f9fafb'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!generatingReport) {
                            e.currentTarget.style.backgroundColor = 'white'
                          }
                        }}
                      >
                        Generate Performance Report
                      </button>
                      <button
                        onClick={() => generateReport('Financial')}
                        disabled={generatingReport}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: generatingReport ? 'not-allowed' : 'pointer',
                          opacity: generatingReport ? 0.5 : 1,
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (!generatingReport) {
                            e.currentTarget.style.backgroundColor = '#f9fafb'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!generatingReport) {
                            e.currentTarget.style.backgroundColor = 'white'
                          }
                        }}
                      >
                        Generate Financial Report
                      </button>
                      <button
                        onClick={() => generateReport('Quality')}
                        disabled={generatingReport}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: generatingReport ? 'not-allowed' : 'pointer',
                          opacity: generatingReport ? 0.5 : 1,
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          if (!generatingReport) {
                            e.currentTarget.style.backgroundColor = '#f9fafb'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!generatingReport) {
                            e.currentTarget.style.backgroundColor = 'white'
                          }
                        }}
                      >
                        Generate Quality Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 1.5rem 0'
                }}>
                  Recent Reports
                </h3>
                <div style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden'
                }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ backgroundColor: '#f3f4f6' }}>
                        <tr>
                          <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Report Name
                          </th>
                          <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Type
                          </th>
                          <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Generated
                          </th>
                          <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Size
                          </th>
                          <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: 'white' }}>
                        {recentReports.map((report, index) => {
                          const getTypeColor = (type: string) => {
                            switch (type) {
                              case 'quality': return { bg: '#ecfdf5', text: '#059669' }
                              case 'worker': return { bg: '#eff6ff', text: '#2563eb' }
                              case 'financial': return { bg: '#fff7ed', text: '#ea580c' }
                              default: return { bg: '#f3f4f6', text: '#6b7280' }
                            }
                          }
                          const typeColor = getTypeColor(report.type)

                          return (
                            <tr key={report.id} style={{
                              borderBottom: index < recentReports.length - 1 ? '1px solid #e5e7eb' : 'none'
                            }}>
                              <td style={{
                                padding: '1rem 1.5rem',
                                fontSize: '0.875rem',
                                color: '#111827'
                              }}>
                                {report.name}
                              </td>
                              <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                                <span style={{
                                  padding: '0.25rem 0.75rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  borderRadius: '9999px',
                                  backgroundColor: typeColor.bg,
                                  color: typeColor.text,
                                  textTransform: 'capitalize'
                                }}>
                                  {report.type}
                                </span>
                              </td>
                              <td style={{
                                padding: '1rem 1.5rem',
                                fontSize: '0.875rem',
                                color: '#6b7280'
                              }}>
                                {report.generatedAt}
                              </td>
                              <td style={{
                                padding: '1rem 1.5rem',
                                fontSize: '0.875rem',
                                color: '#6b7280'
                              }}>
                                {report.size}
                              </td>
                              <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                                <button
                                  onClick={() => downloadReport(report)}
                                  style={{
                                    color: '#7c3aed',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem',
                                    borderRadius: '4px',
                                    transition: 'color 0.2s ease'
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.color = '#6d28d9'
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.color = '#7c3aed'
                                  }}
                                >
                                  <DownloadIcon />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Reports Tab */}
          {activeTab === 'custom' && (
            <div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#111827',
                margin: '0 0 1.5rem 0'
              }}>
                Create Custom Report
              </h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={(e) => {
                e.preventDefault()
                generateReport('Custom')
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Report Type
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}>
                      <option value="comprehensive">Comprehensive Analysis</option>
                      <option value="worker">Worker Performance</option>
                      <option value="project">Project Summary</option>
                      <option value="quality">Quality Metrics</option>
                      <option value="financial">Financial Report</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '0.5rem'
                    }}>
                      Format
                    </label>
                    <select style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      backgroundColor: 'white'
                    }}>
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.75rem'
                  }}>
                    Include Sections
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#7c3aed',
                          marginRight: '0.5rem'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                        Executive Summary
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#7c3aed',
                          marginRight: '0.5rem'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                        Detailed Analytics
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#7c3aed',
                          marginRight: '0.5rem'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                        Worker Performance
                      </span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#7c3aed',
                          marginRight: '0.5rem'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                        Financial Breakdown
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={generatingReport}
                  style={{
                    width: 'fit-content',
                    padding: '0.75rem 1.5rem',
                    backgroundColor: generatingReport ? '#9ca3af' : '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: generatingReport ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!generatingReport) {
                      e.currentTarget.style.backgroundColor = '#6d28d9'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!generatingReport) {
                      e.currentTarget.style.backgroundColor = '#7c3aed'
                    }
                  }}
                >
                  {generatingReport ? 'Generating...' : 'Generate Report'}
                </button>
              </form>
            </div>
          )}

          {/* Scheduled Reports Tab */}
          {activeTab === 'scheduled' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  Scheduled Reports
                </h3>
                <button style={{
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
                  Schedule New Report
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: '#111827',
                        margin: '0 0 0.5rem 0'
                      }}>
                        Weekly Performance Report
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        margin: '0 0 0.25rem 0'
                      }}>
                        Every Monday at 9:00 AM
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        margin: 0
                      }}>
                        Recipients: team@company.com
                      </p>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#7c3aed',
                          marginRight: '0.5rem'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>Active</span>
                    </label>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: '500',
                        color: '#111827',
                        margin: '0 0 0.5rem 0'
                      }}>
                        Monthly Financial Summary
                      </h4>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        margin: '0 0 0.25rem 0'
                      }}>
                        1st of every month at 8:00 AM
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#9ca3af',
                        margin: 0
                      }}>
                        Recipients: finance@company.com, cfo@company.com
                      </p>
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        defaultChecked
                        style={{
                          width: '16px',
                          height: '16px',
                          accentColor: '#7c3aed',
                          marginRight: '0.5rem'
                        }}
                      />
                      <span style={{ fontSize: '0.875rem', color: '#374151' }}>Active</span>
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