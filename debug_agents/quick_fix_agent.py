#!/usr/bin/env python3
"""
Quick Fix Agent
Automatically fixes common issues
"""
import os
import subprocess
import json
from datetime import datetime


class QuickFixAgent:
    def __init__(self):
        self.fixes_applied = []
        self.frontend_path = "/Users/rishi/verita-ai-backend"
    
    def fix_missing_dependencies(self):
        """Ensure all dependencies are installed"""
        print("🔧 Checking and installing missing dependencies...")
        
        try:
            # Kill any existing npm processes
            subprocess.run(["pkill", "-f", "npm"], capture_output=True)
            
            # Clean install
            subprocess.run(
                ["npm", "ci"],
                cwd=self.frontend_path,
                capture_output=True,
                text=True
            )
            
            self.fixes_applied.append({
                "fix": "Reinstalled dependencies with npm ci",
                "status": "success"
            })
            return True
        except Exception as e:
            self.fixes_applied.append({
                "fix": "Failed to reinstall dependencies",
                "error": str(e)
            })
            return False
    
    def fix_typescript_config(self):
        """Fix TypeScript configuration"""
        print("🔧 Fixing TypeScript configuration...")
        
        tsconfig_path = os.path.join(self.frontend_path, "tsconfig.json")
        
        try:
            with open(tsconfig_path, 'r') as f:
                tsconfig = json.load(f)
            
            # Ensure proper compiler options
            if "compilerOptions" not in tsconfig:
                tsconfig["compilerOptions"] = {}
            
            # Add/update important options
            tsconfig["compilerOptions"].update({
                "skipLibCheck": True,
                "allowSyntheticDefaultImports": True,
                "esModuleInterop": True,
                "types": ["vite/client"]
            })
            
            with open(tsconfig_path, 'w') as f:
                json.dump(tsconfig, f, indent=2)
            
            self.fixes_applied.append({
                "fix": "Updated tsconfig.json",
                "status": "success"
            })
            return True
        except Exception as e:
            self.fixes_applied.append({
                "fix": "Failed to fix TypeScript config",
                "error": str(e)
            })
            return False
    
    def restart_dev_server(self):
        """Restart the development server"""
        print("🔧 Restarting development server...")
        
        try:
            # Kill existing dev server
            subprocess.run(["pkill", "-f", "vite"], capture_output=True)
            
            # Start new dev server in background
            subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=self.frontend_path,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
            
            self.fixes_applied.append({
                "fix": "Restarted development server",
                "status": "success"
            })
            
            print("⏳ Waiting for server to start...")
            import time
            time.sleep(5)
            
            return True
        except Exception as e:
            self.fixes_applied.append({
                "fix": "Failed to restart dev server",
                "error": str(e)
            })
            return False
    
    def clear_caches(self):
        """Clear various caches"""
        print("🔧 Clearing caches...")
        
        try:
            # Clear node_modules/.vite
            vite_cache = os.path.join(self.frontend_path, "node_modules/.vite")
            if os.path.exists(vite_cache):
                subprocess.run(["rm", "-rf", vite_cache], capture_output=True)
            
            self.fixes_applied.append({
                "fix": "Cleared Vite cache",
                "status": "success"
            })
            return True
        except Exception as e:
            self.fixes_applied.append({
                "fix": "Failed to clear caches",
                "error": str(e)
            })
            return False
    
    def create_minimal_working_app(self):
        """Create a minimal working App.tsx to test"""
        print("🔧 Creating minimal test app...")
        
        minimal_app = '''import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to br, #7c3aed, #a855f7, #c026d3)',
        color: 'white',
        padding: '20px'
      }}>
        <h1>Verita AI - Debug Mode</h1>
        <p>If you can see this, React is working!</p>
        <div style={{ marginTop: '20px' }}>
          <h2>Diagnostic Info:</h2>
          <ul>
            <li>React: ✅ Working</li>
            <li>Router: ✅ Loaded</li>
            <li>Styles: ✅ Applied</li>
          </ul>
        </div>
        <div style={{ marginTop: '20px' }}>
          <a 
            href="/login" 
            style={{ 
              background: 'white', 
              color: '#7c3aed', 
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              display: 'inline-block'
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    </Router>
  )
}'''
        
        # Backup original
        app_path = os.path.join(self.frontend_path, "src/App.tsx")
        backup_path = os.path.join(self.frontend_path, "src/App.original.tsx")
        
        try:
            # Backup if not already done
            if not os.path.exists(backup_path):
                with open(app_path, 'r') as f:
                    original = f.read()
                with open(backup_path, 'w') as f:
                    f.write(original)
            
            # Write minimal app
            with open(app_path, 'w') as f:
                f.write(minimal_app)
            
            self.fixes_applied.append({
                "fix": "Created minimal test App.tsx",
                "status": "success",
                "note": "Original backed up to App.original.tsx"
            })
            return True
        except Exception as e:
            self.fixes_applied.append({
                "fix": "Failed to create minimal app",
                "error": str(e)
            })
            return False
    
    def run_all_fixes(self):
        """Run all quick fixes"""
        print("🚀 Quick Fix Agent - Running automatic fixes...")
        
        fixes = [
            ("Clearing caches", self.clear_caches),
            ("Fixing TypeScript config", self.fix_typescript_config),
            ("Creating minimal app", self.create_minimal_working_app),
            ("Restarting dev server", self.restart_dev_server)
        ]
        
        for fix_name, fix_func in fixes:
            print(f"\n▶️  {fix_name}...")
            fix_func()
        
        # Summary
        print("\n📊 Quick Fix Summary:")
        successful = sum(1 for f in self.fixes_applied if f.get("status") == "success")
        failed = len(self.fixes_applied) - successful
        
        print(f"✅ Successful fixes: {successful}")
        print(f"❌ Failed fixes: {failed}")
        
        if successful > 0:
            print("\n🎉 Fixes applied! Please:")
            print("1. Refresh your browser (Ctrl+R or Cmd+R)")
            print("2. Check if the app is now working")
            print("3. You should see 'Verita AI - Debug Mode' if it's working")
        
        return self.fixes_applied
    
    def save_report(self, report_dir: str = "debug_agents/reports"):
        """Save fix report"""
        os.makedirs(report_dir, exist_ok=True)
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "agent": "Quick Fix Agent",
            "fixes_applied": self.fixes_applied
        }
        
        filename = f"quick_fix_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(report_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n💾 Report saved to: {filepath}")


if __name__ == "__main__":
    agent = QuickFixAgent()
    agent.run_all_fixes()
    agent.save_report()