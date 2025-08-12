"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import StackedBarChart from '@/components/StackedBarChart';
import PositiveNegativeBarChart from '@/components/PositiveNegativeBarChart';


import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


interface CotData {
  CFTC_Commodity_Code: number;
  Comm_COT_Index: number;
  Commercial_Positions_Long_All: number;
  Commercial_Positions_Long_All_Percent: number;
  Commercial_Positions_Net: number;
  Commercial_Positions_Short_All: number;
  Commercial_Positions_Short_All_Percent: number;
  Market_and_Exchange_Names: string;
  NonRept_COT_Index: number;
  NonRept_Positions_Long_All: number;
  NonRept_Positions_Long_All_Percent: number;
  NonRept_Positions_Net: number;
  NonRept_Positions_Short_All: number;
  NonRept_Positions_Short_All_Percent: number;
  OI_Index: number;
  Open_Interest_All: number;
  Pct_Change_Commercial_Positions_Net: number;
  Pct_Change_NonRept_Positions_Net: number;
  Pct_Change_Open_Interest: number;
  Report_Date_as_YYYY_MM_DD: string;
  Report_ID: string;
  Short_Code: string;
  WillCo_Index: number;
}

interface ChartData {
  xAxisDim1: number;
  xAxisDim2: number;
  xAxis: string;
}

export default function OrdersPage() {

  const [data, setData] = useState<CotData[]>([]);
  const [cotDetails, setCotDetails] = useState<CotData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

    // Transform data for chart
  const chartData = useMemo(() => 
    data.map(item => ({
      xAxisDim1: item.NonRept_Positions_Long_All_Percent,
      xAxisDim2: item.NonRept_Positions_Short_All_Percent,
      xAxis: item.Short_Code
    }))
  , [data]);

  const chartCommData = useMemo(() => 
    data.map(item => ({
      xAxisDim1: item.Commercial_Positions_Long_All_Percent,
      xAxisDim2: item.Commercial_Positions_Short_All_Percent,
      xAxis: item.Short_Code
    }))
  , [data]);



  const loadData = async () => {
  
      setLoading(true);
  
      try {
        // Call the Next.js API route
        //const response = await fetch('/api/chat', {
        const response = await fetch('/api/cot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const responseData = await response.json();
        if (responseData.error) {
          throw new Error(responseData.error);
        }
  
        //console.log(responseData.response)

        const responseArray = responseData.response || [];

        
        // Map the response data to ensure it matches CotData interface
        const mappedData: CotData[] = Array.isArray(responseArray) ? responseArray.map((item) => ({
          CFTC_Commodity_Code: item.CFTC_Commodity_Code,
          Comm_COT_Index: item.Comm_COT_Index,
          Commercial_Positions_Long_All: item.Commercial_Positions_Long_All,
          Commercial_Positions_Long_All_Percent: item.Commercial_Positions_Long_All_Percent,
          Commercial_Positions_Net: item.Commercial_Positions_Net,
          Commercial_Positions_Short_All: item.Commercial_Positions_Short_All,
          Commercial_Positions_Short_All_Percent: item.Commercial_Positions_Short_All_Percent,
          Market_and_Exchange_Names: item.Market_and_Exchange_Names,
          NonRept_COT_Index: item.NonRept_COT_Index,
          NonRept_Positions_Long_All: item.NonRept_Positions_Long_All,
          NonRept_Positions_Long_All_Percent: item.NonRept_Positions_Long_All_Percent,
          NonRept_Positions_Net: item.NonRept_Positions_Net,
          NonRept_Positions_Short_All: item.NonRept_Positions_Short_All,
          NonRept_Positions_Short_All_Percent: item.NonRept_Positions_Short_All_Percent,
          OI_Index: item.OI_Index,
          Open_Interest_All: item.Open_Interest_All,
          Pct_Change_Commercial_Positions_Net: item.Pct_Change_Commercial_Positions_Net,
          Pct_Change_NonRept_Positions_Net: item.Pct_Change_NonRept_Positions_Net,
          Pct_Change_Open_Interest: item.Pct_Change_Open_Interest,
          Report_Date_as_YYYY_MM_DD: item.Report_Date_as_YYYY_MM_DD,
          Report_ID: item.Report_ID,
          Short_Code: item.Short_Code,
          WillCo_Index: item.WillCo_Index,
        })) : [];
         
        //console.log(mappedData);
       
  
        setData(responseArray);

        //console.log(data);

      } finally {
        setLoading(false);
      }
    };


    const handleBarClick = async (shortCode: string) => {
    try {

      console.log('handleBarClick called with:', shortCode);
      const response = await fetch('/api/cot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortCode }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const detailData = await response.json();
      // Handle the response data here
      console.log('Detail data to be mapped:', detailData);

      const responseArray = detailData.response || [];

      // Map the response data to ensure it matches CotData interface
      const mappedData: CotData[] = Array.isArray(responseArray) ? responseArray.map((item) => ({
        CFTC_Commodity_Code: item.CFTC_Commodity_Code,
        Comm_COT_Index: item.Comm_COT_Index,
        Commercial_Positions_Long_All: item.Commercial_Positions_Long_All,
        Commercial_Positions_Long_All_Percent: item.Commercial_Positions_Long_All_Percent,
        Commercial_Positions_Net: item.Commercial_Positions_Net,
        Commercial_Positions_Short_All: item.Commercial_Positions_Short_All,
        Commercial_Positions_Short_All_Percent: item.Commercial_Positions_Short_All_Percent,
        Market_and_Exchange_Names: item.Market_and_Exchange_Names,
        NonRept_COT_Index: item.NonRept_COT_Index,
        NonRept_Positions_Long_All: item.NonRept_Positions_Long_All,
        NonRept_Positions_Long_All_Percent: item.NonRept_Positions_Long_All_Percent,
        NonRept_Positions_Net: item.NonRept_Positions_Net,
        NonRept_Positions_Short_All: item.NonRept_Positions_Short_All,
        NonRept_Positions_Short_All_Percent: item.NonRept_Positions_Short_All_Percent,
        OI_Index: item.OI_Index,
        Open_Interest_All: item.Open_Interest_All,
        Pct_Change_Commercial_Positions_Net: item.Pct_Change_Commercial_Positions_Net,
        Pct_Change_NonRept_Positions_Net: item.Pct_Change_NonRept_Positions_Net,
        Pct_Change_Open_Interest: item.Pct_Change_Open_Interest,
        Report_Date_as_YYYY_MM_DD: item.Report_Date_as_YYYY_MM_DD,
        Report_ID: item.Report_ID,
        Short_Code: item.Short_Code,
        WillCo_Index: item.WillCo_Index,
      })) : [];
        
      console.log('Mapped data for pos neg chart :', mappedData);
      setCotDetails(mappedData);
      
      // You can set this to a new state variable if needed
      // setDetailData(detailData);
    } catch (error) {
      console.error('Error fetching detail data:', error);
    }
  };


    // const chartData = transformToChartData(data);

    // console.log(chartData);

  return (
      <div>
        
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Item>
                <StackedBarChart 
                  data={chartCommData} 
                  title="Commercial Positions"
                  height={400}
                  width='100%'
                  colors={{ 
                    dim1: '#388E3C', 
                    dim2: '#A03232' 
                  }}
                  labels={{
                    dim1: 'Long Position',
                    dim2: 'Short Position',
                    ylabel: 'Percentage (%)'
                  }}
                  onBarClick={handleBarClick}
                  />
              </Item>
            </Grid>
            <Grid size={12}>
              <Item>
                <StackedBarChart 
                  data={chartData} 
                  title="Retail Positions"
                  height={400}
                  width='100%'
                  colors={{ 
                    dim1: '#388E3C', 
                    dim2: '#A03232' 
                  }}
                  labels={{
                    dim1: 'Long Position',
                    dim2: 'Short Position',
                    ylabel: 'Percentage (%)'
                  }}
                  onBarClick={handleBarClick}
                  />
              </Item>
            </Grid>

            
            <Grid size={6}>
              <Item>
                <StackedBarChart 
                  data={cotDetails.map(item => ({
                    xAxisDim1: item.Commercial_Positions_Long_All_Percent,
                    xAxisDim2: item.Commercial_Positions_Short_All_Percent,
                    xAxis: item.Report_Date_as_YYYY_MM_DD
                  }))} 
                  title="Commercial Positions (%)"
                  height={400}
                  width='100%'
                  colors={{ 
                    dim1: '#388E3C', 
                    dim2: '#A03232' 
                  }}
                  labels={{
                    dim1: 'Long Position',
                    dim2: 'Short Position',
                    ylabel: 'Percentage (%)'
                  }}
                  sortBy="xaxis"
                  />
              </Item>
            </Grid>
            <Grid size={6}>
              <Item>
                <StackedBarChart 
                  data={cotDetails.map(item => ({
                    xAxisDim1: item.Commercial_Positions_Long_All,
                    xAxisDim2: item.Commercial_Positions_Short_All,
                    xAxis: item.Report_Date_as_YYYY_MM_DD
                  }))} 
                  title="Commercial Positions (Contracts)"
                  height={400}
                  width='100%'
                  colors={{ 
                    dim1: '#388E3C', 
                    dim2: '#A03232' 
                  }}
                  labels={{
                    dim1: 'Long Position',
                    dim2: 'Short Position',
                    ylabel: 'Contracts'
                  }}
                  sortBy="xaxis"
                  />
              </Item>
            </Grid>
             <Grid size={6}>
              <Item>
                <StackedBarChart 
                  data={cotDetails.map(item => ({
                    xAxisDim1: item.Open_Interest_All,
                    xAxisDim2: 0,
                    xAxis: item.Report_Date_as_YYYY_MM_DD
                  }))} 
                  title="Open Interest"
                  height={400}
                  width='100%'
                  colors={{ 
                    dim1: '#f9ae3eff', 
                    dim2: '#ffffffff' 
                  }}
                  labels={{
                    dim1: 'Open Interest',
                    dim2: ' ',
                    ylabel: 'Contracts'
                  }}
                  sortBy="xaxis"
                  />
              </Item>
            </Grid>
            <Grid size={6}>
              <Item>
                <StackedBarChart 
                  data={cotDetails.map(item => ({
                    xAxisDim1: item.Commercial_Positions_Net,
                    xAxisDim2: 0,
                    xAxis: item.Report_Date_as_YYYY_MM_DD
                  }))} 
                  title="Net Commercial Positions"
                  height={400}
                  width='100%'
                  colors={{ 
                    dim1: '#f9ae3eff', 
                    dim2: '#ffffffff' 
                  }}
                  labels={{
                    dim1: 'Net Commercial Positions',
                    dim2: ' ',
                    ylabel: 'Contracts'
                  }}
                  sortBy="xaxis"
                  />
              </Item>
            </Grid>
            <Grid size={6}>
              <Item>
                <PositiveNegativeBarChart
                  data={cotDetails.map(item => ({
                    date: item.Report_Date_as_YYYY_MM_DD,
                    value: item.Pct_Change_Commercial_Positions_Net,
                    xaxis: item.Short_Code
                  }))}
                  title="% Change in Net Commercial Positions"
                  height={400}
                  width="100%"
                />
              </Item>
            </Grid>
           <Grid size={6}>
              <Item>
                <PositiveNegativeBarChart
                  data={cotDetails.map(item => ({
                    date: item.Report_Date_as_YYYY_MM_DD,
                    value: item.Pct_Change_NonRept_Positions_Net,
                    xaxis: item.Short_Code
                  }))}
                  title="% Change in Retail Positions"
                  height={400}
                  width="100%"
                />
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
    );

}
