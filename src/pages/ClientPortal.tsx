import React from 'react'
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
  Target
} from 'lucide-react'

export const ClientPortal: React.FC = () => {
  // Mock client data
  const clientFirstName = 'Sarah'

  const yourVAs = [
    {
      id: '1',
      name: 'Maria Rodriguez',
      role: 'Executive Assistant',
      avatar: 'MR',
      hoursThisWeek: 28,
      totalHours: 40,
      status: 'active' as const,
      lastActive: '2 hours ago',
      specialties: ['Email Management', 'Calendar', 'Travel'],
      rating: 4.9
    },
    {
      id: '2',
      name: 'James Chen',
      role: 'Research Specialist',
      avatar: 'JC',
      hoursThisWeek: 15,
      totalHours: 20,
      status: 'active' as const,
      lastActive: '1 hour ago',
      specialties: ['Market Research', 'Data Analysis', 'Reports'],
      rating: 5.0
    }
  ]

  const currentProjects = [
    {
      id: '1',
      name: 'Q1 Market Research Report',
      assignedTo: 'James Chen',
      progress: 75,
      dueDate: 'Jan 28, 2025',
      status: 'on-track' as const
    },
    {
      id: '2',
      name: 'Executive Calendar Optimization',
      assignedTo: 'Maria Rodriguez',
      progress: 100,
      dueDate: 'Jan 25, 2025',
      status: 'completed' as const
    },
    {
      id: '3',
      name: 'Travel Arrangements - Miami Conference',
      assignedTo: 'Maria Rodriguez',
      progress: 60,
      dueDate: 'Feb 1, 2025',
      status: 'on-track' as const
    }
  ]

  const recentDeliverables = [
    {
      id: '1',
      name: 'Weekly Email Digest (Jan 20-24)',
      deliveredBy: 'Maria Rodriguez',
      completedAt: 'Today, 9:00 AM',
      type: 'Report'
    },
    {
      id: '2',
      name: 'Competitor Analysis - Tech Sector',
      deliveredBy: 'James Chen',
      completedAt: 'Yesterday, 4:30 PM',
      type: 'Research'
    },
    {
      id: '3',
      name: 'Meeting Notes - Strategy Session',
      deliveredBy: 'Maria Rodriguez',
      completedAt: 'Jan 23, 2:15 PM',
      type: 'Documentation'
    }
  ]

  const monthlyROI = {
    hoursSaved: 87,
    hoursSavedTrend: '+12%',
    costSavings: 4350,
    costSavingsTrend: '+8%',
    tasksCompleted: 156,
    tasksCompletedTrend: '+23%',
    responseTime: '< 2 hrs',
    responseTimeTrend: '18% faster'
  }

  const availableServices = [
    {
      id: '1',
      title: 'Scale Your Team',
      description: 'Clients with 2+ VAs report 3x efficiency gains',
      icon: Users,
      benefit: '+200% productivity',
      cta: 'Explore Team Options',
      context: 'Based on your growth'
    },
    {
      id: '2',
      title: 'Advanced Reporting',
      description: 'Get deeper insights into your operations with custom analytics',
      icon: FileText,
      benefit: '40% better insights',
      cta: 'See Sample Reports',
      context: 'Recommended for you'
    },
    {
      id: '3',
      title: 'Process Documentation',
      description: 'Systemize your workflows for seamless delegation',
      icon: Target,
      benefit: 'Save 10+ hrs/month',
      cta: 'Learn More',
      context: 'Popular upgrade'
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
          subtitle={`Here's how your team is performing this week`}
          actions={
            <div className="flex gap-3">
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
                        <span className="text-sm font-semibold text-gray-700">{va.rating}</span>
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
              Want to discuss a custom solution?{' '}
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
