import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Define interface for the data structure
interface ChartData {
  xAxisDim1: number;
  xAxisDim2: number;
  xAxis: string;
}

interface StackedBarChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  width?: string;
  colors?: {
    dim1: string;
    dim2: string;
  };
  labels?: {
    dim1: string;
    dim2: string;
    ylabel?: string;
  };
  onBarClick?: (xAxis: string) => void;
  sortBy?: 'xaxis' | 'dim1'; // New prop for sorting
}

export default function StackedBarChart({ 
    data,
    title = 'Stacked Bar Chart',
    height = 500,
    width = '100%',
    colors = { dim1: '#4CAF50', dim2: '#f44336' },
    labels = { dim1: 'Commercial Long', dim2: 'Commercial Short', ylabel: 'Percentage (%)' },
    onBarClick,
    sortBy = 'dim1'
  }: StackedBarChartProps) {


    // Add check for empty or undefined data
  if (!data || data.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>No data available</p>
      </div>
    );
  }

  const handleBarClick = (event: any) => {
    console.log('Bar clicked event:', event);
    if (onBarClick && event && event.payload) {
      const shortCode = event.payload.xaxis;
      console.log('Extracted short code:', shortCode);
      onBarClick(shortCode);
    }
  };


  // Transform and sort data
  const sortedData = [...data]
    .sort((a, b) => {
      if (sortBy === 'xaxis') {
        // Sort alphabetically by xAxis
        return a.xAxis.localeCompare(b.xAxis);
      } else {
        // Sort numerically by xAxisDim1 (descending)
        return b.xAxisDim1 - a.xAxisDim1;
      }
    })
    .map(item => ({
      xaxis: item.xAxis,
      dim1: item.xAxisDim1,
      dim2: item.xAxisDim2,
    }));

    console.log('Sorted Data:', sortedData);

  return (
    <div style={{ width: width, height: height }}>
      {title && <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 40
          }}
          onClick={(data) => console.log('Chart clicked:', data)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="xaxis"
            angle={-90}
            interval={0}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            label={{ 
              value: labels.ylabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(2)}%`}
          />
          <Legend />
          <Bar
            dataKey="dim1"
            stackId="a"
            fill={colors.dim1}
            name={labels.dim1}
            onClick={handleBarClick}
            cursor="pointer"
          />
          <Bar
            dataKey="dim2"
            stackId="a"
            fill={colors.dim2}
            name={labels.dim2}
            onClick={handleBarClick}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}