import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { cn } from './ui/utils'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react'

export const AnalyticsPage = () => {
  // Mock data for the analytics dashboard
  const stats = [
    {
      title: 'Total Tasks',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Target,
      description: 'Tasks completed this month'
    },
    {
      title: 'Active Workers',
      value: '89',
      change: '+4.2%',
      trend: 'up',
      icon: Users,
      description: 'Currently working on projects'
    },
    {
      title: 'Avg. Completion Time',
      value: '3.2h',
      change: '-8.1%',
      trend: 'down',
      icon: Clock,
      description: 'Per task completion time'
    },
    {
      title: 'Quality Score',
      value: '94.7%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle2,
      description: 'Average annotation quality'
    }
  ]

  const projects = [
    {
      name: 'Text Sentiment Analysis',
      progress: 87,
      tasks: 445,
      completed: 387,
      status: 'active',
      quality: 96.2
    },
    {
      name: 'Medical Image Annotation',
      progress: 62,
      tasks: 520,
      completed: 322,
      status: 'active',
      quality: 94.8
    },
    {
      name: 'E-commerce Product Classification',
      progress: 34,
      tasks: 282,
      completed: 96,
      status: 'paused',
      quality: 91.5
    }
  ]

  const recentActivity = [
    { type: 'task_completed', user: 'Sarah Chen', project: 'Text Sentiment', time: '2 min ago' },
    { type: 'quality_check', user: 'System', project: 'Medical Images', time: '5 min ago' },
    { type: 'task_assigned', user: 'Mike Johnson', project: 'Product Classification', time: '8 min ago' },
    { type: 'milestone_reached', user: 'Team', project: 'Text Sentiment', time: '15 min ago' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">Real-time insights into your data annotation projects</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.trend === 'up'
          
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isPositive ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                    isPositive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                  )}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-1",
                isPositive ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"
              )} />
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Progress */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Project Progress
                  </CardTitle>
                  <CardDescription>Track completion status across all projects</CardDescription>
                </div>
                <Badge variant="secondary">
                  <Eye className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {projects.map((project) => (
                <div key={project.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {project.completed} of {project.tasks} tasks completed
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{project.progress}%</p>
                      <p className="text-xs text-muted-foreground">Quality: {project.quality}%</p>
                    </div>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    activity.type === 'task_completed' && "bg-green-500/10 text-green-600",
                    activity.type === 'quality_check' && "bg-blue-500/10 text-blue-600",
                    activity.type === 'task_assigned' && "bg-purple-500/10 text-purple-600",
                    activity.type === 'milestone_reached' && "bg-orange-500/10 text-orange-600"
                  )}>
                    {activity.type === 'task_completed' && <CheckCircle2 className="w-4 h-4" />}
                    {activity.type === 'quality_check' && <AlertCircle className="w-4 h-4" />}
                    {activity.type === 'task_assigned' && <Users className="w-4 h-4" />}
                    {activity.type === 'milestone_reached' && <Target className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.user}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.project}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Completion Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Completion Rate Trends
            </CardTitle>
            <CardDescription>Weekly task completion performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">87.3%</p>
                  <p className="text-sm text-muted-foreground">Average completion rate</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2% from last week
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quality Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quality Metrics
            </CardTitle>
            <CardDescription>Annotation quality across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                <div>
                  <p className="font-medium text-green-700">Excellent Quality</p>
                  <p className="text-sm text-green-600">≥95% accuracy</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-700">67%</p>
                  <p className="text-xs text-green-600">of all tasks</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <div>
                  <p className="font-medium text-blue-700">Good Quality</p>
                  <p className="text-sm text-blue-600">90-94% accuracy</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-700">28%</p>
                  <p className="text-xs text-blue-600">of all tasks</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-orange-500/5 rounded-lg border border-orange-500/20">
                <div>
                  <p className="font-medium text-orange-700">Needs Review</p>
                  <p className="text-sm text-orange-600">&lt;90% accuracy</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-700">5%</p>
                  <p className="text-xs text-orange-600">of all tasks</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time-based Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Time-based Analytics
          </CardTitle>
          <CardDescription>Task completion patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center bg-secondary/20 rounded-lg">
            <div className="text-center space-y-2">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Interactive charts will be displayed here</p>
              <Badge variant="secondary">Chart Component Integration Needed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}