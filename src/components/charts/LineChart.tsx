import React from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface LineChartProps {
  data: any[]
  xKey: string
  yKey: string
  title?: string
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  title
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-semibold font-serif text-black mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dd" />
          <XAxis
            dataKey={xKey}
            stroke="#6b6b6b"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#6b6b6b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e3dd',
              borderRadius: '8px'
            }}
          />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#0F2052"
            strokeWidth={3}
            dot={{ fill: '#d4af37', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
