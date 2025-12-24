import React from 'react'
import { Header } from '../components/layout/Header'
import { Card } from '../components/common/Card'
import { StatCard } from '../components/common/StatCard'
import { Button } from '../components/common/Button'
import { LineChart } from '../components/charts/LineChart'
import { BarChart } from '../components/charts/BarChart'
import { Clock, DollarSign, TrendingDown, TrendingUp, Download } from 'lucide-react'
import { mockAnalytics, mockROITrend, mockClientROI } from '../data/mockData'

export const Analytics: React.FC = () => {
  const handleExport = () => {
    console.log('Exporting analytics report...')
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
            label="Total Hours Reclaimed"
            value={`${mockAnalytics.totalHoursReclaimed.toLocaleString()}h`}
          />
          <StatCard
            icon={DollarSign}
            label="Total Value Reclaimed"
            value={`$${(mockAnalytics.totalValueReclaimed / 1000).toFixed(1)}k`}
            accent
          />
          <StatCard
            icon={TrendingDown}
            label="Total VA Cost"
            value={`$${(mockAnalytics.totalVACost / 1000).toFixed(1)}k`}
          />
          <StatCard
            icon={TrendingUp}
            label="Net Savings"
            value={`$${(mockAnalytics.netSavings / 1000).toFixed(1)}k`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <Card>
            <LineChart
              data={mockROITrend}
              xKey="month"
              yKey="roi"
              title="ROI Trend (6 Months)"
            />
          </Card>

          <Card>
            <BarChart
              data={mockClientROI}
              xKey="client"
              yKey="hours"
              title="Hours Reclaimed by Client"
              layout="horizontal"
            />
          </Card>
        </div>

        <Card className="mb-5">
          <h2 className="text-xl font-bold font-serif text-black mb-5">
            Client ROI Comparison
          </h2>
          <BarChart
            data={mockClientROI}
            xKey="client"
            yKey="roi"
            layout="vertical"
          />
        </Card>

        <Card>
          <h2 className="text-xl font-bold font-serif text-black mb-5">
            Top Performers
          </h2>
          <div className="overflow-x-auto">
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
                {mockClientROI.map((client, index) => {
                  const hourlyValue = 65
                  const vaCost = 60
                  const netSavings = (client.hours * hourlyValue) - (client.hours * vaCost)

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
          </div>
        </Card>
      </div>
    </div>
  )
}
