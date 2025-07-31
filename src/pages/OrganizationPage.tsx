import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Settings, TrendingUp, UserPlus, Trash2, Crown, Shield, User } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { useOrganizationStore } from '../stores/organizationStore'

export function OrganizationPage() {
  const navigate = useNavigate()
  const { 
    organization, 
    members, 
    teams,
    isLoading, 
    error,
    fetchOrganization, 
    createOrganization,
    updateOrganization,
    fetchMembers,
    fetchTeams,
    inviteUser,
    removeUser,
    createTeam,
    deleteTeam,
    clearError
  } = useOrganizationStore()

  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false)
  const [inviteData, setInviteData] = useState({ email: '', team_id: '', role: 'member' })
  const [teamData, setTeamData] = useState({ 
    name: '', 
    description: '', 
    can_create_projects: true, 
    can_manage_workers: false 
  })
  const [orgFormData, setOrgFormData] = useState({
    name: '',
    description: ''
  })
  const [createOrgData, setCreateOrgData] = useState({
    name: '',
    slug: '',
    description: '',
    industry: 'technology',
    company_size: '1-10'
  })

  useEffect(() => {
    clearError() // Clear any previous errors
    fetchOrganization()
    fetchMembers()
    fetchTeams()
  }, [fetchOrganization, fetchMembers, fetchTeams, clearError])

  useEffect(() => {
    if (organization) {
      setOrgFormData({
        name: organization.name || '',
        description: organization.description || ''
      })
    }
  }, [organization])

  const handleCreateOrg = async (e) => {
    e.preventDefault()
    try {
      // Generate slug from name if not provided
      const slug = createOrgData.slug || createOrgData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      await createOrganization({
        ...createOrgData,
        slug
      })
      toast.success('Organization created successfully!')
      // Redirect to dashboard instead of staying on org page
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create organization')
    }
  }

  const handleOrgUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateOrganization(orgFormData)
      toast.success('Organization updated successfully!')
    } catch (error) {
      toast.error('Failed to update organization')
    }
  }

  const handleInviteUser = async (e) => {
    e.preventDefault()
    if (!inviteData.team_id) {
      toast.error('Please select a team')
      return
    }
    try {
      await inviteUser(inviteData)
      toast.success('User invited successfully!')
      setShowInviteDialog(false)
      setInviteData({ email: '', team_id: '', role: 'member' })
    } catch (error) {
      toast.error('Failed to invite user')
    }
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    try {
      await createTeam(teamData)
      toast.success('Team created successfully!')
      setShowCreateTeamDialog(false)
      setTeamData({ name: '', description: '', can_create_projects: true, can_manage_workers: false })
    } catch (error) {
      toast.error('Failed to create team')
    }
  }

  const handleRemoveUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to remove ${userName} from the organization?`)) {
      try {
        await removeUser(userId)
        toast.success('User removed successfully!')
      } catch (error) {
        toast.error('Failed to remove user')
      }
    }
  }

  const getRoleIcon = (role) => {
    if (!role) return <User className="w-4 h-4 text-gray-600" />
    
    switch (role.toLowerCase()) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-600" />
      case 'manager':
        return <Shield className="w-4 h-4 text-blue-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getSubscriptionBadge = (tier) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      pro: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800'
    }
    return colors[tier] || colors.free
  }

  if (isLoading && !organization) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading organization...</div>
      </div>
    )
  }

  // Show error state if there's an error and we're not loading
  if (error && !isLoading && !organization) {

    // If error is about not having an organization, show creation form
    if (error.includes('does not belong to an organization') || error.includes('Organization not found')) {
      return (
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Create Organization</h1>
              <p className="text-white/60 mt-1">Create your organization to start managing projects and teams</p>
            </div>
          </div>

          {/* Creation Form */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateOrg} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="org-name" className="text-white">Organization Name *</Label>
                    <Input
                      id="org-name"
                      name="organizationName"
                      value={createOrgData.name}
                      onChange={(e) => setCreateOrgData(prev => ({ 
                        ...prev, 
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                      }))}
                      placeholder="My Organization"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-slug" className="text-white">URL Slug *</Label>
                    <Input
                      id="org-slug"
                      name="organizationSlug"
                      value={createOrgData.slug}
                      onChange={(e) => setCreateOrgData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="my-organization"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="org-description" className="text-white">Description</Label>
                  <Textarea
                    id="org-description"
                    name="organizationDescription"
                    value={createOrgData.description}
                    onChange={(e) => setCreateOrgData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your organization..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="org-industry" className="text-white">Industry</Label>
                    <Select name="organizationIndustry" value={createOrgData.industry} onValueChange={(value) => setCreateOrgData(prev => ({ ...prev, industry: value }))}>
                      <SelectTrigger id="org-industry" name="organizationIndustry" className="bg-white/10 border-white/30 text-white backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-2xl">
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Hidden input for form validation */}
                    <input
                      type="hidden"
                      name="organizationIndustry"
                      value={createOrgData.industry}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="org-size" className="text-white">Company Size</Label>
                    <Select name="organizationSize" value={createOrgData.company_size} onValueChange={(value) => setCreateOrgData(prev => ({ ...prev, company_size: value }))}>
                      <SelectTrigger id="org-size" name="organizationSize" className="bg-white/10 border-white/30 text-white backdrop-blur-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300 shadow-2xl">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* Hidden input for form validation */}
                    <input
                      type="hidden"
                      name="organizationSize"
                      value={createOrgData.company_size}
                    />
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-md text-sm">
                  {error}
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isLoading ? 'Creating...' : 'Create Organization'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )
    } else {
      // Show generic error
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-white">
            <h2 className="text-xl mb-2">Error loading organization</h2>
            <p className="text-white/60 mb-4">{error}</p>
            <Button onClick={() => {
              clearError()
              fetchOrganization()
            }} className="bg-purple-600 hover:bg-purple-700">
              Try Again
            </Button>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Organization</h1>
          <p className="text-white/60 mt-1">Manage your organization settings and members</p>
        </div>
        {organization && organization.subscription_tier && (
          <Badge className={getSubscriptionBadge(organization.subscription_tier)}>
            {organization.subscription_tier.toUpperCase()}
          </Badge>
        )}
      </div>

      {organization && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 text-white">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <Users className="w-4 h-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="teams" className="data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <Users className="w-4 h-4 mr-2" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-purple-900">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{organization.user_count || 0}</div>
                  <p className="text-sm text-gray-600">
                    Active team members
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{organization.project_count || 0}</div>
                  <p className="text-sm text-gray-600">
                    {organization.active_projects || 0} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Plan Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Projects:</span>
                      <span>{organization.project_count || 0}/{organization.max_projects || '∞'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Workers:</span>
                      <span>{organization.user_count || 0}/{organization.max_workers || '∞'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tasks/month:</span>
                      <span>~/{organization.max_tasks_per_month ? organization.max_tasks_per_month.toLocaleString() : '∞'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-lg">{organization.name}</p>
                </div>
                {organization.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-gray-600">{organization.description}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Organization ID</Label>
                  <p className="text-sm font-mono text-gray-600">{organization.slug}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(organization.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">Team Members</h3>
                <p className="text-white/60">Manage who has access to your organization</p>
              </div>
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Invite a user to join your organization by adding them to a team.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInviteUser} className="space-y-4">
                    <div>
                      <Label htmlFor="invite-email">Email Address</Label>
                      <Input
                        id="invite-email"
                        name="inviteEmail"
                        type="email"
                        value={inviteData.email}
                        onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="user@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-team">Team</Label>
                      <Select name="inviteTeam" value={inviteData.team_id} onValueChange={(value) => setInviteData(prev => ({ ...prev, team_id: value }))}>
                        <SelectTrigger id="invite-team" name="inviteTeam">
                          <SelectValue placeholder="Select a team" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Hidden input for form validation */}
                      <input
                        type="hidden"
                        name="inviteTeam"
                        value={inviteData.team_id}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="invite-role">Team Role</Label>
                      <Select name="inviteRole" value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger id="invite-role" name="inviteRole">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Hidden input for form validation */}
                      <input
                        type="hidden"
                        name="inviteRole"
                        value={inviteData.role}
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Inviting...' : 'Send Invite'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.full_name}`} />
                              <AvatarFallback>
                                {member.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.full_name}</p>
                              <p className="text-sm text-gray-600">{member.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(member.role)}
                            <span className="capitalize">{member.role || 'member'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.is_active ? 'default' : 'secondary'}>
                            {member.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(member.id, member.full_name || member.email)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Tab */}
          <TabsContent value="teams" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">Teams</h3>
                <p className="text-white/60">Manage teams and their permissions</p>
              </div>
              <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                    <DialogDescription>
                      Create a new team with specific permissions for your organization.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <Label htmlFor="team-name">Team Name</Label>
                      <Input
                        id="team-name"
                        name="teamName"
                        value={teamData.name}
                        onChange={(e) => setTeamData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Team name"
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="team-description">Description</Label>
                      <Textarea
                        id="team-description"
                        name="teamDescription"
                        value={teamData.description}
                        onChange={(e) => setTeamData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Team description"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Permissions</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="can-create-projects"
                          name="canCreateProjects"
                          checked={teamData.can_create_projects}
                          onChange={(e) => setTeamData(prev => ({ ...prev, can_create_projects: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="can-create-projects" className="text-sm">Can create projects</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="can-manage-workers"
                          name="canManageWorkers"
                          checked={teamData.can_manage_workers}
                          onChange={(e) => setTeamData(prev => ({ ...prev, can_manage_workers: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="can-manage-workers" className="text-sm">Can manage workers</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setShowCreateTeamDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create Team'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">{team.name}</TableCell>
                        <TableCell>{team.description || 'No description'}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {team.can_create_projects && (
                              <Badge variant="secondary" className="text-xs">Create Projects</Badge>
                            )}
                            {team.can_manage_workers && (
                              <Badge variant="secondary" className="text-xs">Manage Workers</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={team.is_active ? 'default' : 'secondary'}>
                            {team.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {!['Default Team', 'Organization Admins'].includes(team.name) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete the ${team.name} team?`)) {
                                  deleteTeam(team.id).catch(() => toast.error('Failed to delete team'))
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOrgUpdate} className="space-y-6">
                  <div>
                    <Label htmlFor="settings-org-name">Organization Name</Label>
                    <Input
                      id="settings-org-name"
                      name="organizationName"
                      value={orgFormData.name}
                      onChange={(e) => setOrgFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your organization name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="settings-org-description">Description</Label>
                    <Textarea
                      id="settings-org-description"
                      name="organizationDescription"
                      value={orgFormData.description}
                      onChange={(e) => setOrgFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your organization"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}