import React, { useState } from 'react'
import { apiClient } from '../api/client'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Eye, EyeOff, Sparkles, Zap, Shield, Database } from 'lucide-react'

interface AuthPageProps {
  onAuthSuccess: () => void
}

export const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const [loginData, setLoginData] = useState({
    email: 'admin@demo.com',
    password: 'demo123'
  })
  
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login button clicked!', { email: loginData.email })
    setLoading(true)
    setError('')

    try {
      // Send JSON data to match backend expectations
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.email,
          password: loginData.password
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Login successful!', data)
        
        // Set tokens in both localStorage and API client
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token || '')
        apiClient.setTokens(data.access_token, data.refresh_token || '')
        
        console.log('Tokens set, calling onAuthSuccess')
        onAuthSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Login failed')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError('Unable to connect to server. Please check if the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await apiClient.register(registerData)
      // After successful registration, switch to login
      setIsLogin(true)
      setError('')
      alert('Registration successful! Please login.')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSkipLogin = async () => {
    console.log('Skip login clicked!')
    setLoading(true)
    setError('')
    
    try {
      // Automatically login with demo credentials
      const response = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin@demo.com',
          password: 'demo123'
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Demo login successful!', data)
        
        // Set tokens in both localStorage and API client
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token || '')
        apiClient.setTokens(data.access_token, data.refresh_token || '')
        
        console.log('Demo tokens set, calling onAuthSuccess')
        onAuthSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Demo login failed')
      }
    } catch (err: any) {
      console.error('Demo login error:', err)
      setError('Unable to connect to server for demo login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-md relative z-10">
        <Card className="bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  V
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Verita AI
              </CardTitle>
              <CardDescription className="text-base">
                Advanced Data Annotation Platform
              </CardDescription>
            </div>
            
            {/* Features badges */}
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Database className="w-3 h-3 mr-1" />
                Real-time
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
                <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <Shield className="h-4 w-4" />
                  <div className="font-medium">Authentication Error</div>
                  <div className="text-sm">{error}</div>
                </Alert>
              )}

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="admin@demo.com"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={registerData.full_name}
                      onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      placeholder="Choose a username"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email Address</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Password</Label>
                    <div className="relative">
                      <Input
                        id="registerPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Create a password"
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-9 w-9 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            
            <div className="space-y-4">
              <Separator className="my-6" />
              
              {/* Demo Section */}
              <div className="text-center space-y-4">
                <div className="text-xs text-muted-foreground">
                  Demo Credentials: admin@demo.com / demo123
                </div>
                
                <Button
                  onClick={handleSkipLogin}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-dashed border-accent/50 text-accent hover:bg-accent/10 hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {loading ? 'Connecting to demo...' : 'Skip Login (Demo Mode)'}
                </Button>
              </div>
              
              {/* Footer */}
              <div className="text-center text-xs text-muted-foreground">
                Powered by modern AI technology
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
