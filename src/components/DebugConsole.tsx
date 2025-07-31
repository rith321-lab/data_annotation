
import React, { useEffect } from 'react'

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
