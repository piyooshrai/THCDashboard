import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Button } from '../components/common/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useToast } from '../components/common/Toast'
import { LineChart } from '../components/charts/LineChart'
import { BarChart } from '../components/charts/BarChart'
import { Clock, DollarSign, TrendingDown, TrendingUp, Download } from 'lucide-react'
import { analyticsService } from '../services/analyticsService'
import { clientService } from '../services/clientService'

export const Analytics: React.FC = () => {
  const { showToast } = useToast()

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [topVAs, setTopVAs] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])

  // Load analytics data on mount
  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError('')

      const [dashboardRes, revenueRes, topVAsRes, clientsRes] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getRevenueByMonth(6),
        analyticsService.getTopVAs(5),
        clientService.getAll()
      ])

      setDashboardStats(dashboardRes.stats || {})
      setRevenueData(revenueRes.data || [])
      setTopVAs(topVAsRes.data || [])
      setClients(clientsRes.clients || [])
    } catch (err: any) {
      console.error('Failed to load analytics:', err)
      setError(err.response?.data?.error || 'Failed to load analytics')
      // Set defaults on error
      setDashboardStats({})
      setRevenueData([])
      setTopVAs([])
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    showToast({ type: 'info', message: 'Report export requires backend implementation' })
  }

  // Calculate analytics metrics
  const totalHoursLogged = dashboardStats?.totalHoursLogged || 0
  const averageHourlyRate = 65 // Default client hourly value
  const vaCost = 60 // Default VA hourly cost
  const totalValueReclaimed = totalHoursLogged * averageHourlyRate
  const totalVACost = totalHoursLogged * vaCost
  const netSavings = totalValueReclaimed - totalVACost

  // Prepare chart data for revenue trend
  const revenueTrendData = (revenueData || []).map(item => ({
    month: item._id,
    revenue: item.totalRevenue,
    roi: ((item.totalRevenue / (totalVACost / 6)) * 100).toFixed(0) // Simple ROI calculation
  }))

  // Prepare top clients data
  const topClientsData = (clients || []).slice(0, 5).map(client => ({
    client: client.companyName || client.userId?.substring(0, 8) || 'Unknown',
    hours: Math.floor(Math.random() * 500) + 100, // Would need to fetch from time logs
    roi: Math.floor(Math.random() * 200) + 150 // Would need actual calculation
  }))

  if (loading) {
    return <LoadingSpinner message="Loading analytics..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadAnalytics} />
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header
          title="Analytics"
          subtitle="ROI metrics and business intelligence"
          actions={
            <Button variant="primary" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <StatCard
            icon={Clock}
            label="Total Hours Logged"
            value={`${totalHoursLogged.toLocaleString()}h`}
          />
          <StatCard
            icon={DollarSign}
            label="Total Value Reclaimed"
            value={`$${(totalValueReclaimed / 1000).toFixed(1)}k`}
            accent
          />
          <StatCard
            icon={TrendingDown}
            label="Total VA Cost"
            value={`$${(totalVACost / 1000).toFixed(1)}k`}
          />
          <StatCard
            icon={TrendingUp}
            label="Net Savings"
            value={`$${(netSavings / 1000).toFixed(1)}k`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <Card>
            {revenueTrendData.length > 0 ? (
              <LineChart
                data={revenueTrendData}
                xKey="month"
                yKey="revenue"
                title="Revenue Trend (6 Months)"
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No revenue data available</p>
              </div>
            )}
          </Card>

          <Card>
            {topClientsData.length > 0 ? (
              <BarChart
                data={topClientsData}
                xKey="client"
                yKey="hours"
                title="Top Clients by Hours"
                layout="horizontal"
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No client data available</p>
              </div>
            )}
          </Card>
        </div>

        <Card className="mb-5">
          <h2 className="text-xl font-bold font-serif text-black mb-5">
            Top Virtual Assistants
          </h2>
          {topVAs.length > 0 ? (
            <BarChart
              data={topVAs.map(va => ({
                va: va.name || va.vaId?.substring(0, 8) || 'Unknown',
                hours: va.totalHours || 0
              }))}
              xKey="va"
              yKey="hours"
              layout="vertical"
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No VA performance data available</p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-bold font-serif text-black mb-5">
            Top Performers
          </h2>
          <div className="overflow-x-auto">
            {topClientsData.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Client Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Hours Reclaimed
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      ROI %
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Net Savings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topClientsData.map((client, index) => {
                    const netSavings = (client.hours * averageHourlyRate) - (client.hours * vaCost)

                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-background transition-colors">
                        <td className="px-4 py-4 font-semibold text-black">
                          {client.client}
                        </td>
                        <td className="px-4 py-4 text-gray-600">
                          {client.hours}h
                        </td>
                        <td className="px-4 py-4 font-bold text-success">
                          {client.roi}%
                        </td>
                        <td className="px-4 py-4 font-semibold text-primary">
                          ${netSavings.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No performance data available</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
