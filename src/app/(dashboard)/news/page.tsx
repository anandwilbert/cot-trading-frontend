"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import NewsTable from '@/components/NewsTable';


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



interface Event {
  date: string;
  currency: string;
  impact: string;
  event: string;
  actual: number;
  forecast: number;
  previous: number;
  unit: string;
  currency_outlook: string;
  stock_outlook: string;
};


export default function NewsPage() {

  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
  
      setLoading(true);
  
      try {
        // Call the Next.js API route
        //const response = await fetch('/api/chat', {
        const response = await fetch('/api/news', {
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
  
        console.log(responseData.response)

        const responseArray = responseData.response || [];

        // Map the response data to ensure it matches CotData interface
        const mappedData: Event[] = Array.isArray(responseArray) ? responseArray.map((item) => ({
          date: item.date,
          currency: item.currency,
          impact: item.impact,
          event: item.event,
          actual: item.actual,
          forecast: item.forecast,
          previous: item.previous,
          unit: item.unit,
          currency_outlook: item.currency_outlook,
          stock_outlook: item.stock_outlook,
        })) : [];
         
        //console.log(mappedData);
        setData(mappedData);

      } finally {
        setLoading(false);
      }
    };

  return (
      <div>
        
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Item>
                <NewsTable data={data} title="News Events" height={600} width="100%"/>
              </Item>
            </Grid>
            </Grid>
        </Box>
      </div>
    );

}
