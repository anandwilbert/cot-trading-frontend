import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';


interface BarChartProps {
  data: {
    date: string;
    value: number;
    xaxis: string;
  }[];
  title?: string;
  height?: number;
  width?: string;
}

export default function PositiveNegativeBarChart({
  data,
  title = 'Net Positions',
  height = 400,
  width = '100%'
}: BarChartProps) {


  console.log('Bar chart data:', data);

  return (
    <div style={{ width: width, height: height }}>
      {title && <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          
          <ReferenceLine y={0} stroke="#000" />
          <Bar dataKey="value" fill="#3843b5ff" >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#388E3C' : '#A03232'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

