import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface BarChartProps {
  data: any[]
  xKey: string
  yKey: string
  title?: string
  layout?: 'horizontal' | 'vertical'
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  title,
  layout = 'vertical'
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xl font-semibold font-serif text-black mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e3dd" />
          {layout === 'vertical' ? (
            <>
              <XAxis type="number" stroke="#6b6b6b" style={{ fontSize: '12px' }} />
              <YAxis type="category" dataKey={xKey} stroke="#6b6b6b" style={{ fontSize: '12px' }} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} stroke="#6b6b6b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b6b6b" style={{ fontSize: '12px' }} />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e8e3dd',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey={yKey} fill="#d4af37" radius={[4, 4, 4, 4]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
