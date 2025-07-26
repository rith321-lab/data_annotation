import { cn } from './ui/utils'
import { 
  BarChart3, 
  Award, 
  CreditCard, 
  Users, 
  Mail, 
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from './ui/button'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  { icon: BarChart3, label: 'Projects', active: true },
  { icon: Award, label: 'Qualifications' },
  { icon: CreditCard, label: 'Add funds' },
  { icon: Users, label: 'Team' },
  { icon: Mail, label: 'Inbox' },
  { icon: FileText, label: 'Announcements' },
  { icon: CreditCard, label: 'Add funds' },
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <div className={cn(
      "bg-black/20 backdrop-blur-sm border-r border-white/10 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-sm transform rotate-12"></div>
                </div>
                <div>
                  <h1 className="text-white text-xl">surge<sup className="text-xs">AI</sup></h1>
                  <p className="text-purple-300 text-xs">Design System</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-sm transform rotate-12"></div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/80 hover:text-white hover:bg-white/10",
                    item.active && "bg-white/10 text-white",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full text-white/80 hover:text-white hover:bg-white/10"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}