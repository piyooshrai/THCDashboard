import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import {
  Clock,
  TrendingUp,
  CheckCircle,
  DollarSign,
  Users,
  Calendar,
  MessageSquare,
  ArrowRight,
  Star,
  FileText,
  Zap,
  Target,
  ArrowLeft
} from 'lucide-react'
import { mockClients, mockVAs } from '../data/mockData'

// Client-to-VA mapping (which VAs are assigned to which clients)
const clientVAMapping: Record<string, string[]> = {
  '1': ['3', '4'], // John Doe -> Emily Rodriguez, Maria Garcia
  '2': ['1', '2'], // Mike Kumar -> Sarah Anderson, Lisa Smith
  '3': ['3'], // Robert Chen -> Emily Rodriguez
  '4': ['2'] // Jennifer Wu -> Lisa Smith
}

export const ClientPortal: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>()
  const navigate = useNavigate()

  // Find the client by ID
  const client = mockClients.find(c => c.id === clientId)

  if (!client) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-black mb-2">Client Not Found</h2>
            <p className="text-gray-600 mb-6">The requested client portal could not be found.</p>
            <Button onClick={() => navigate('/clients')}>Back to Clients</Button>
          </div>
        </Card>
      </div>
    )
  }

  const clientFirstName = client.name.split(' ')[0]

  // Get VAs assigned to this client
  const assignedVAIds = clientVAMapping[client.id] || []
  const yourVAs = mockVAs
    .filter(va => assignedVAIds.includes(va.id))
    .map(va => ({
      ...va,
      role: va.department,
      hoursThisWeek: Math.floor(va.hoursThisMonth / 4), // Estimate weekly from monthly
      totalHours: 40,
      specialties: va.department === 'Marketing'
        ? ['Social Media', 'Content', 'Analytics']
        : va.department === 'Accounting'
        ? ['Bookkeeping', 'Invoicing', 'Reports']
        : va.department === 'Admin'
        ? ['Email Management', 'Calendar', 'Travel']
        : ['Support Tickets', 'Chat', 'Email'],
      lastActive: va.status === 'active' ? `${Math.floor(Math.random() * 3) + 1} hours ago` : 'Offline'
    }))

  // Generate client-specific projects
  const currentProjects = [
    {
      id: '1',
      name: `${client.industry} Market Analysis`,
      assignedTo: yourVAs[0]?.name || 'VA Team',
      progress: 75,
      dueDate: 'Jan 28, 2025',
      status: 'on-track' as const
    },
    {
      id: '2',
      name: `${client.company} Calendar Optimization`,
      assignedTo: yourVAs[yourVAs.length - 1]?.name || 'VA Team',
      progress: 100,
      dueDate: 'Jan 25, 2025',
      status: 'completed' as const
    },
    {
      id: '3',
      name: `${client.jobTitle} Task Automation`,
      assignedTo: yourVAs[0]?.name || 'VA Team',
      progress: 60,
      dueDate: 'Feb 1, 2025',
      status: 'on-track' as const
    }
  ]

  // Client-specific deliverables
  const recentDeliverables = [
    {
      id: '1',
      name: `Weekly Digest - ${client.company}`,
      deliveredBy: yourVAs[0]?.name || 'Your VA',
      completedAt: 'Today, 9:00 AM',
      type: 'Report'
    },
    {
      id: '2',
      name: `${client.industry} Competitor Research`,
      deliveredBy: yourVAs[yourVAs.length - 1]?.name || 'Your VA',
      completedAt: 'Yesterday, 4:30 PM',
      type: 'Research'
    },
    {
      id: '3',
      name: `${client.jobTitle} Meeting Notes`,
      deliveredBy: yourVAs[0]?.name || 'Your VA',
      completedAt: 'Jan 23, 2:15 PM',
      type: 'Documentation'
    }
  ]

  // Calculate client-specific ROI metrics
  const monthlyROI = {
    hoursSaved: client.hoursReclaimed,
    hoursSavedTrend: '+12%',
    costSavings: Math.floor(client.hoursReclaimed * client.hourlyValue),
    costSavingsTrend: '+8%',
    tasksCompleted: Math.floor(client.hoursReclaimed * 1.8), // Estimate
    tasksCompletedTrend: '+23%',
    responseTime: '< 2 hrs',
    responseTimeTrend: '18% faster'
  }

  // Dynamic service suggestions based on client data
  const availableServices = [
    {
      id: '1',
      title: yourVAs.length === 1 ? 'Scale Your Team' : 'Expand Your Team',
      description: yourVAs.length === 1
        ? 'Clients with 2+ VAs report 3x efficiency gains'
        : 'Add specialized VAs for even greater impact',
      icon: Users,
      benefit: yourVAs.length === 1 ? '+200% productivity' : '+150% efficiency',
      cta: 'Explore Team Options',
      context: yourVAs.length === 1 ? 'Based on your growth' : 'Recommended upgrade'
    },
    {
      id: '2',
      title: 'Advanced Reporting',
      description: 'Get deeper insights into your operations with custom analytics',
      icon: FileText,
      benefit: '40% better insights',
      cta: 'See Sample Reports',
      context: client.roi > 400 ? 'For high performers' : 'Recommended for you'
    },
    {
      id: '3',
      title: 'Process Documentation',
      description: 'Systemize your workflows for seamless delegation',
      icon: Target,
      benefit: 'Save 10+ hrs/month',
      cta: 'Learn More',
      context: client.hoursReclaimed > 150 ? 'Popular with teams like yours' : 'Popular upgrade'
    }
  ]

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success'
      case 'on-track':
        return 'bg-primary'
      case 'at-risk':
        return 'bg-warning'
      default:
        return 'bg-gray-400'
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title={`Welcome back, ${clientFirstName}`}
          subtitle={`${client.company} · Here's how your team is performing this week`}
          actions={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => navigate('/clients')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Clients
              </Button>
              <Button variant="secondary">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message Your Team
              </Button>
              <Button variant="primary">
                <Calendar className="w-4 h-4 mr-2" />
                Book a Strategy Call
              </Button>
            </div>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-5">
        {/* ROI Metrics - The Immediate Value */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={Clock}
            label="Hours Saved This Month"
            value={monthlyROI.hoursSaved.toString()}
            trend={monthlyROI.hoursSavedTrend}
            trendPositive={true}
          />
          <StatCard
            icon={DollarSign}
            label="Cost Savings"
            value={`$${monthlyROI.costSavings.toLocaleString()}`}
            trend={monthlyROI.costSavingsTrend}
            trendPositive={true}
            accent
          />
          <StatCard
            icon={CheckCircle}
            label="Tasks Completed"
            value={monthlyROI.tasksCompleted.toString()}
            trend={monthlyROI.tasksCompletedTrend}
            trendPositive={true}
          />
          <StatCard
            icon={Zap}
            label="Avg Response Time"
            value={monthlyROI.responseTime}
            trend={monthlyROI.responseTimeTrend}
            trendPositive={true}
          />
        </div>

        {/* Your VA Team */}
        <div>
          <h2 className="text-2xl font-bold font-serif text-black mb-4">Your Dedicated Team</h2>
          {yourVAs.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No VAs assigned yet</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {yourVAs.map((va) => (
                <Card key={va.id} className="hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl">
                        {va.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-black">{va.name}</h3>
                        <p className="text-sm text-gray-600">{va.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-accent fill-accent" />
                          <span className="text-sm font-semibold text-gray-700">{va.avgRating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge status={va.status} />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">This Week</span>
                        <span className="text-sm font-semibold text-black">
                          {va.hoursThisWeek}/{va.totalHours} hrs
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${(va.hoursThisWeek / va.totalHours) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {va.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-background rounded text-xs font-medium text-gray-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-success rounded-full" />
                      Active {va.lastActive}
                    </div>

                    <Button variant="secondary" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Current Projects & Recent Deliverables */}
        <div className="grid grid-cols-2 gap-5">
          <Card className="flex flex-col">
            <h2 className="text-xl font-bold font-serif text-black mb-4">Current Projects</h2>
            <div className="space-y-3 flex-1">
              {currentProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-background rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-black text-sm">{project.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">Assigned to {project.assignedTo}</p>
                    </div>
                    <Badge
                      status={project.status === 'completed' ? 'active' : 'pending'}
                    />
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-black">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`${getProjectStatusColor(project.status)} rounded-full h-1.5 transition-all`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Due {project.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col">
            <h2 className="text-xl font-bold font-serif text-black mb-4">Recent Deliverables</h2>
            <div className="space-y-3 flex-1">
              {recentDeliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="p-4 bg-background rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-black text-sm">{deliverable.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">By {deliverable.deliveredBy}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                          {deliverable.type}
                        </span>
                        <span className="text-xs text-gray-500">{deliverable.completedAt}</span>
                      </div>
                    </div>
                    <Button variant="secondary" className="flex-shrink-0">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Contextual Services - Value-based, not salesy */}
        <Card className="border-2 border-accent/20 bg-gradient-to-br from-background to-accent/5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold font-serif text-black">
              Ways to Maximize Your ROI
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {availableServices.map((service) => {
              const Icon = service.icon
              return (
                <div
                  key={service.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-accent/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-black text-sm mb-1">{service.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded text-xs font-semibold">
                        <TrendingUp className="w-3 h-3" />
                        {service.benefit}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{service.context}</span>
                      <button className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        {service.cta}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Want to discuss a custom solution for {client.company}?{' '}
              <button className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Schedule a 15-minute strategy call
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
