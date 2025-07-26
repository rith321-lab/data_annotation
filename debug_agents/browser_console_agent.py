#!/usr/bin/env python3
"""
Browser Console Debug Agent
Checks for browser console errors by injecting debug scripts
"""
import os
import json
from datetime import datetime


class BrowserConsoleAgent:
    def __init__(self):
        self.report = {
            "timestamp": datetime.now().isoformat(),
            "agent": "Browser Console Agent",
            "diagnostics": []
        }
    
    def create_debug_component(self):
        """Create a debug component that logs errors"""
        debug_component = '''
import { useEffect } from 'react'

export function DebugConsole() {
  useEffect(() => {
    // Log when component mounts
    console.log('[DEBUG] DebugConsole mounted at', new Date().toISOString())
    
    // Check for common issues
    const checks = {
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
      fetch: typeof fetch !== 'undefined',
      reactVersion: typeof React !== 'undefined' ? React.version : 'not found',
      routerAvailable: typeof window !== 'undefined' && window.location,
    }
    
    console.log('[DEBUG] Environment checks:', checks)
    
    // Listen for errors
    const errorHandler = (event: ErrorEvent) => {
      console.error('[DEBUG] Error caught:', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error
      })
    }
    
    // Listen for unhandled promise rejections
    const unhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[DEBUG] Unhandled promise rejection:', event.reason)
    }
    
    window.addEventListener('error', errorHandler)
    window.addEventListener('unhandledrejection', unhandledRejection)
    
    // Check authentication store
    try {
      const token = localStorage.getItem('access_token')
      console.log('[DEBUG] Auth token exists:', !!token)
    } catch (e) {
      console.error('[DEBUG] Error accessing localStorage:', e)
    }
    
    return () => {
      window.removeEventListener('error', errorHandler)
      window.removeEventListener('unhandledrejection', unhandledRejection)
    }
  }, [])
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Debug Console Active - Check browser console (F12)
    </div>
  )
}
'''
        
        # Write the debug component
        debug_path = "/Users/rishi/verita-ai-backend/src/components/DebugConsole.tsx"
        with open(debug_path, 'w') as f:
            f.write(debug_component)
        
        self.report["diagnostics"].append({
            "action": "Created DebugConsole component",
            "path": debug_path,
            "description": "Component will log errors to browser console"
        })
        
        return debug_path
    
    def inject_debug_component(self):
        """Inject debug component into App.tsx"""
        app_path = "/Users/rishi/verita-ai-backend/src/App.tsx"
        
        try:
            with open(app_path, 'r') as f:
                content = f.read()
            
            # Check if already injected
            if 'DebugConsole' in content:
                self.report["diagnostics"].append({
                    "status": "skipped",
                    "reason": "DebugConsole already injected"
                })
                return
            
            # Add import
            import_line = "import { DebugConsole } from './components/DebugConsole'\n"
            content = content.replace(
                "import { Toaster } from 'sonner'", 
                "import { Toaster } from 'sonner'\n" + import_line
            )
            
            # Add component before closing tags
            content = content.replace(
                "      <Toaster richColors position=\"top-right\" />",
                "      <Toaster richColors position=\"top-right\" />\n      <DebugConsole />"
            )
            
            with open(app_path, 'w') as f:
                f.write(content)
            
            self.report["diagnostics"].append({
                "action": "Injected DebugConsole into App.tsx",
                "status": "success"
            })
            
        except Exception as e:
            self.report["diagnostics"].append({
                "action": "Failed to inject DebugConsole",
                "error": str(e)
            })
    
    def create_error_boundary(self):
        """Create React Error Boundary component"""
        error_boundary = '''
import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#ff6b6b',
          color: 'white',
          margin: '20px',
          borderRadius: '8px'
        }}>
          <h2>Something went wrong!</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Error details</summary>
            <p>{this.state.error && this.state.error.toString()}</p>
            <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: 'white',
              color: '#ff6b6b',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
'''
        
        # Write error boundary
        boundary_path = "/Users/rishi/verita-ai-backend/src/components/ErrorBoundary.tsx"
        with open(boundary_path, 'w') as f:
            f.write(error_boundary)
        
        self.report["diagnostics"].append({
            "action": "Created ErrorBoundary component",
            "path": boundary_path
        })
        
        return boundary_path
    
    def wrap_app_with_error_boundary(self):
        """Wrap App component with ErrorBoundary"""
        app_path = "/Users/rishi/verita-ai-backend/src/main.tsx"
        
        try:
            with open(app_path, 'r') as f:
                content = f.read()
            
            if 'ErrorBoundary' in content:
                self.report["diagnostics"].append({
                    "status": "skipped",
                    "reason": "ErrorBoundary already added"
                })
                return
            
            # Add import
            content = content.replace(
                "import App from './App'",
                "import App from './App'\nimport { ErrorBoundary } from './components/ErrorBoundary'"
            )
            
            # Wrap App
            content = content.replace(
                "    <App />",
                "    <ErrorBoundary>\n      <App />\n    </ErrorBoundary>"
            )
            
            with open(app_path, 'w') as f:
                f.write(content)
            
            self.report["diagnostics"].append({
                "action": "Wrapped App with ErrorBoundary",
                "status": "success"
            })
            
        except Exception as e:
            self.report["diagnostics"].append({
                "action": "Failed to add ErrorBoundary",
                "error": str(e)
            })
    
    def run_diagnostics(self):
        """Run all browser console diagnostics"""
        print("🔍 Browser Console Agent - Setting up diagnostics...")
        
        # Create and inject debug components
        self.create_debug_component()
        self.inject_debug_component()
        self.create_error_boundary()
        self.wrap_app_with_error_boundary()
        
        print("\n✅ Browser diagnostics setup complete!")
        print("\n📝 Instructions:")
        print("1. Refresh your browser (Ctrl+R or Cmd+R)")
        print("2. Open browser console (F12)")
        print("3. Look for [DEBUG] and [ErrorBoundary] messages")
        print("4. Check for any red error messages")
        print("\n🔍 Common issues to look for:")
        print("- Failed to resolve import")
        print("- Cannot read property of undefined")
        print("- Network/CORS errors")
        print("- React hooks errors")
        
        return self.report
    
    def save_report(self, report_dir: str = "debug_agents/reports"):
        """Save the report"""
        os.makedirs(report_dir, exist_ok=True)
        
        filename = f"browser_console_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(report_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(self.report, f, indent=2)
        
        print(f"\n💾 Report saved to: {filepath}")


if __name__ == "__main__":
    agent = BrowserConsoleAgent()
    report = agent.run_diagnostics()
    agent.save_report()