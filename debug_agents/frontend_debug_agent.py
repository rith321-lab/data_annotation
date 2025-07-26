#!/usr/bin/env python3
"""
Frontend Debug Agent
Specializes in debugging React/TypeScript issues in the Verita AI frontend
"""
import os
import json
import subprocess
import requests
from datetime import datetime
from typing import Dict, List, Any
import re


class FrontendDebugAgent:
    def __init__(self):
        self.frontend_path = "/Users/rishi/verita-ai-backend"
        self.report = {
            "timestamp": datetime.now().isoformat(),
            "agent": "Frontend Debug Agent",
            "issues": [],
            "warnings": [],
            "suggestions": []
        }
    
    def check_node_modules(self) -> bool:
        """Check if node_modules exists and has expected packages"""
        node_modules = os.path.join(self.frontend_path, "node_modules")
        if not os.path.exists(node_modules):
            self.report["issues"].append({
                "severity": "critical",
                "issue": "node_modules directory not found",
                "fix": "Run: npm install"
            })
            return False
        
        # Check for critical packages
        critical_packages = [
            "react", "react-dom", "react-router-dom", 
            "axios", "zustand", "@tanstack/react-query"
        ]
        
        missing_packages = []
        for package in critical_packages:
            if not os.path.exists(os.path.join(node_modules, package)):
                missing_packages.append(package)
        
        if missing_packages:
            self.report["issues"].append({
                "severity": "critical",
                "issue": f"Missing packages: {', '.join(missing_packages)}",
                "fix": "Run: npm install"
            })
            return False
        
        return True
    
    def check_typescript_errors(self) -> bool:
        """Run TypeScript compiler to check for errors"""
        try:
            result = subprocess.run(
                ["npx", "tsc", "--noEmit"],
                cwd=self.frontend_path,
                capture_output=True,
                text=True
            )
            
            if result.returncode != 0:
                errors = result.stdout + result.stderr
                self.report["issues"].append({
                    "severity": "high",
                    "issue": "TypeScript compilation errors",
                    "details": errors[:500],  # First 500 chars
                    "fix": "Fix TypeScript errors in the listed files"
                })
                return False
            
            return True
        except Exception as e:
            self.report["warnings"].append({
                "warning": "Could not run TypeScript check",
                "details": str(e)
            })
            return True
    
    def check_import_errors(self) -> bool:
        """Check for common import errors"""
        issues_found = False
        
        # Check all TypeScript/JavaScript files
        for root, dirs, files in os.walk(os.path.join(self.frontend_path, "src")):
            # Skip node_modules
            if "node_modules" in root:
                continue
                
            for file in files:
                if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    filepath = os.path.join(root, file)
                    try:
                        with open(filepath, 'r') as f:
                            content = f.read()
                            
                        # Check for problematic imports
                        import_pattern = r"import\s+.*?\s+from\s+['\"](.+?)['\"]"
                        imports = re.findall(import_pattern, content)
                        
                        for imp in imports:
                            # Check relative imports
                            if imp.startswith('.'):
                                import_path = os.path.normpath(
                                    os.path.join(os.path.dirname(filepath), imp)
                                )
                                
                                # Check if file exists (try different extensions)
                                extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx']
                                found = False
                                
                                for ext in extensions:
                                    if os.path.exists(import_path + ext) or os.path.exists(import_path):
                                        found = True
                                        break
                                
                                if not found and not imp.endswith(('.css', '.scss', '.json')):
                                    self.report["issues"].append({
                                        "severity": "high",
                                        "issue": f"Import not found in {file}",
                                        "details": f"Cannot resolve: {imp}",
                                        "fix": f"Check if file exists or fix import path"
                                    })
                                    issues_found = True
                                    
                    except Exception as e:
                        self.report["warnings"].append({
                            "warning": f"Could not check file: {file}",
                            "details": str(e)
                        })
        
        return not issues_found
    
    def check_vite_config(self) -> bool:
        """Check Vite configuration"""
        vite_config = os.path.join(self.frontend_path, "vite.config.ts")
        
        if not os.path.exists(vite_config):
            self.report["issues"].append({
                "severity": "critical",
                "issue": "vite.config.ts not found",
                "fix": "Create vite.config.ts file"
            })
            return False
        
        try:
            with open(vite_config, 'r') as f:
                content = f.read()
                
            # Check for proxy configuration
            if '/api' not in content:
                self.report["warnings"].append({
                    "warning": "No API proxy configuration found",
                    "suggestion": "Add proxy configuration for backend API"
                })
        except Exception as e:
            self.report["warnings"].append({
                "warning": "Could not read vite.config.ts",
                "details": str(e)
            })
        
        return True
    
    def check_frontend_server(self) -> bool:
        """Check if frontend dev server is responding"""
        try:
            response = requests.get("http://localhost:3000", timeout=5)
            if response.status_code != 200:
                self.report["issues"].append({
                    "severity": "high",
                    "issue": "Frontend server returned non-200 status",
                    "details": f"Status code: {response.status_code}",
                    "fix": "Check server logs for errors"
                })
                return False
            return True
        except requests.exceptions.ConnectionError:
            self.report["issues"].append({
                "severity": "critical",
                "issue": "Frontend server not responding",
                "fix": "Start frontend server with: npm run dev"
            })
            return False
        except Exception as e:
            self.report["warnings"].append({
                "warning": "Error checking frontend server",
                "details": str(e)
            })
            return False
    
    def check_console_errors(self) -> bool:
        """Simulate checking for console errors (would need browser automation)"""
        self.report["suggestions"].append({
            "suggestion": "Manual Check Required",
            "details": "Open browser console (F12) and check for errors",
            "common_issues": [
                "Failed to resolve import",
                "Cannot read property of undefined",
                "Network errors (CORS)",
                "React hooks errors"
            ]
        })
        return True
    
    def check_environment_setup(self) -> bool:
        """Check environment variables and configuration"""
        env_file = os.path.join(self.frontend_path, ".env")
        
        if not os.path.exists(env_file):
            self.report["warnings"].append({
                "warning": ".env file not found",
                "suggestion": "Create .env file with VITE_API_URL=http://localhost:8000"
            })
        
        # Check package.json
        package_json = os.path.join(self.frontend_path, "package.json")
        if os.path.exists(package_json):
            try:
                with open(package_json, 'r') as f:
                    pkg = json.load(f)
                    
                # Check scripts
                if "scripts" not in pkg:
                    self.report["issues"].append({
                        "severity": "high",
                        "issue": "No scripts found in package.json",
                        "fix": "Add dev, build, and preview scripts"
                    })
                elif "dev" not in pkg.get("scripts", {}):
                    self.report["issues"].append({
                        "severity": "high",
                        "issue": "No dev script in package.json",
                        "fix": "Add: \"dev\": \"vite\""
                    })
                    
            except Exception as e:
                self.report["warnings"].append({
                    "warning": "Could not parse package.json",
                    "details": str(e)
                })
        
        return True
    
    def generate_fixes(self) -> List[Dict[str, Any]]:
        """Generate automated fixes for common issues"""
        fixes = []
        
        # Fix for missing node_modules
        if any("node_modules" in issue.get("issue", "") for issue in self.report["issues"]):
            fixes.append({
                "issue": "Missing node_modules",
                "command": "cd /Users/rishi/verita-ai-backend && npm install",
                "description": "Install all dependencies"
            })
        
        # Fix for TypeScript errors
        if any("TypeScript" in issue.get("issue", "") for issue in self.report["issues"]):
            fixes.append({
                "issue": "TypeScript errors",
                "command": "cd /Users/rishi/verita-ai-backend && npx tsc --noEmit",
                "description": "Show all TypeScript errors to fix"
            })
        
        # Fix for server not running
        if any("server not responding" in issue.get("issue", "") for issue in self.report["issues"]):
            fixes.append({
                "issue": "Frontend server not running",
                "command": "cd /Users/rishi/verita-ai-backend && npm run dev",
                "description": "Start the development server"
            })
        
        return fixes
    
    def run_diagnostics(self) -> Dict[str, Any]:
        """Run all diagnostic checks"""
        print("🔍 Frontend Debug Agent - Starting diagnostics...")
        
        # Run all checks
        checks = [
            ("Node modules", self.check_node_modules()),
            ("Environment setup", self.check_environment_setup()),
            ("Vite configuration", self.check_vite_config()),
            ("Import errors", self.check_import_errors()),
            ("TypeScript errors", self.check_typescript_errors()),
            ("Frontend server", self.check_frontend_server()),
            ("Console errors", self.check_console_errors())
        ]
        
        # Summary
        self.report["summary"] = {
            "total_checks": len(checks),
            "passed": sum(1 for _, passed in checks if passed),
            "failed": sum(1 for _, passed in checks if not passed),
            "critical_issues": len([i for i in self.report["issues"] if i.get("severity") == "critical"]),
            "high_issues": len([i for i in self.report["issues"] if i.get("severity") == "high"]),
            "warnings": len(self.report["warnings"])
        }
        
        # Add automated fixes
        self.report["automated_fixes"] = self.generate_fixes()
        
        # Print summary
        print("\n📊 Frontend Debug Summary:")
        print(f"✅ Passed: {self.report['summary']['passed']}/{self.report['summary']['total_checks']}")
        print(f"❌ Critical Issues: {self.report['summary']['critical_issues']}")
        print(f"⚠️  Warnings: {self.report['summary']['warnings']}")
        
        if self.report["issues"]:
            print("\n🔴 Issues Found:")
            for issue in self.report["issues"][:3]:  # Show first 3
                print(f"  - [{issue['severity'].upper()}] {issue['issue']}")
                if "fix" in issue:
                    print(f"    Fix: {issue['fix']}")
        
        if self.report["automated_fixes"]:
            print("\n🔧 Automated Fixes Available:")
            for fix in self.report["automated_fixes"]:
                print(f"  - {fix['issue']}: {fix['command']}")
        
        return self.report
    
    def save_report(self, report_dir: str = "debug_agents/reports"):
        """Save the report to a file"""
        os.makedirs(report_dir, exist_ok=True)
        
        filename = f"frontend_debug_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        filepath = os.path.join(report_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(self.report, f, indent=2)
        
        print(f"\n💾 Report saved to: {filepath}")


if __name__ == "__main__":
    agent = FrontendDebugAgent()
    report = agent.run_diagnostics()
    agent.save_report()