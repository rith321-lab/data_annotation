import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Progress } from './ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { MoreHorizontal, Search, Filter, Download } from 'lucide-react'

export function DashboardContent() {
  const topMessage = "Sweet dreams!"
  const hireUsButton = "Hire us"

  return (
    <div className="p-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white/80">Surge AI</span>
          <span className="text-white/60">UX & UI</span>
          <span className="text-white/60">Product Design</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-400">{topMessage}</span>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            {hireUsButton}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm transform rotate-12"></div>
              </div>
              <span className="text-gray-600">surge</span>
            </div>
            <h3 className="text-xl mb-2">Welcome Aboard</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get started with your first project
            </p>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Start Project
            </Button>
          </CardContent>
        </Card>

        {/* My Teams Section */}
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>My teams</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  This week
                </Button>
                <Button variant="ghost" size="sm">
                  All teams
                </Button>
                <MoreHorizontal className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { name: 'Braeden R.', role: 'Project Lead', color: 'bg-red-500' },
                { name: 'Alex', role: 'Designer', color: 'bg-blue-500' },
                { name: 'Sarah M.', role: 'Developer', color: 'bg-blue-600' },
                { name: 'Mike J.', role: 'QA', color: 'bg-purple-500' },
                { name: 'Emma S.', role: 'Manager', color: 'bg-red-400' },
                { name: 'Chris L.', role: 'Analytics', color: 'bg-orange-500' },
                { name: 'Lisa K.', role: 'UX', color: 'bg-blue-400' },
                { name: 'Tom R.', role: 'Backend', color: 'bg-red-600' },
                { name: 'Anna P.', role: 'Frontend', color: 'bg-orange-400' },
                { name: 'David W.', role: 'DevOps', color: 'bg-red-500' },
                { name: 'Sophie T.', role: 'Design', color: 'bg-purple-600' },
                { name: 'Mark H.', role: 'Lead', color: 'bg-blue-500' },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <Avatar className="mx-auto mb-2">
                    <AvatarFallback className={`${member.color} text-white`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                  <p className="text-xs text-gray-400">10 hours</p>
                  <p className="text-xs text-gray-400">3 active tasks</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Analytics */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Portuguese Toxicity on Social Media</CardTitle>
            <p className="text-gray-600 text-sm">
              Collaboratively administrate empowered markets via plug-and-play networks.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2">Analytics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Positive Sentiment</span>
                    <span className="text-sm">75%</span>
                  </div>
                  <Progress value={75} className="h-2 bg-orange-200">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '75%' }}></div>
                  </Progress>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Negative Sentiment</span>
                    <span className="text-sm">45%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-orange-200">
                    <div className="h-full bg-orange-600 rounded-full" style={{ width: '45%' }}></div>
                  </Progress>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neutral</span>
                    <span className="text-sm">85%</span>
                  </div>
                  <Progress value={85} className="h-2 bg-teal-200">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }}></div>
                  </Progress>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project History Table */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>BrandleyD's History</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { project: 'Brazilian Ads Data Collection', status: 'Completed', hours: '24', accuracy: '98%' },
                  { project: 'Security Alert Review', status: 'In Progress', hours: '12', accuracy: '95%' },
                  { project: 'Content Moderation', status: 'Completed', hours: '36', accuracy: '97%' },
                  { project: 'Data Analysis', status: 'Review', hours: '18', accuracy: '94%' },
                  { project: 'Quality Check', status: 'Completed', hours: '8', accuracy: '99%' },
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.project}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'Completed' ? 'default' : 'secondary'}
                        className={
                          item.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.hours}</TableCell>
                    <TableCell>{item.accuracy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* All Responses Table */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Responses</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Queue Time</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Contributor</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: '2ZDEPQJMHUP40', created: 'Dec 13, 2023', queue: '5m', quality: 'High Quality', contributor: 'English', time: '1m' },
                { name: '2ZDEPQJMHUP41', created: 'Dec 13, 2023', queue: '3m', quality: 'High Quality', contributor: 'English', time: '2m' },
                { name: '2ZDEPQJMHUP42', created: 'Dec 13, 2023', queue: '7m', quality: 'Medium Quality', contributor: 'English', time: '1m' },
                { name: '2ZDEPQJMHUP43', created: 'Dec 13, 2023', queue: '2m', quality: 'High Quality', contributor: 'English', time: '3m' },
                { name: '2ZDEPQJMHUP44', created: 'Dec 13, 2023', queue: '4m', quality: 'High Quality', contributor: 'English', time: '1m' },
              ].map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.created}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      {item.queue}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={item.quality === 'High Quality' ? 'text-green-600' : 'text-yellow-600'}
                    >
                      {item.quality}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.contributor}</TableCell>
                  <TableCell>{item.created}</TableCell>
                  <TableCell>{item.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}