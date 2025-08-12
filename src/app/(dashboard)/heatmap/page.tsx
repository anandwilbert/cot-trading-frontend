"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MaterialTable from '@/components/MaterialTable';
import MaterialTable2 from '@/components/MaterialTable2';


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



interface Indicator  {
  short_code: string;
  comm_long_pct: number;
  comm_cot_index: number;
  retail_cot_index: number;
  usd_valuation: number;
  ustb_valuation: number;
  gold_valuation: number; //optional field
  chg_open_int_pct: number;
  chg_comm_net_pct: number;
  chg_retail_net_pct: number;
  call_put_ratio: number;
  chg_weekly_close_pct: number;
};


export default function OrdersPage() {

  const [data, setData] = useState<Indicator[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);


  const loadData = async () => {
  
      setLoading(true);
  
      try {
        // Call the Next.js API route
        //const response = await fetch('/api/chat', {
        const response = await fetch('/api/heatmap', {
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
        const mappedData: Indicator[] = Array.isArray(responseArray) ? responseArray.map((item) => ({
          short_code: item.Short_Code,
          comm_long_pct: item.Commercial_Positions_Long_All_Percent,
          comm_cot_index: item.Comm_COT_Index,
          retail_cot_index: item.NonRept_COT_Index,
          usd_valuation: item.Valuation_DXY,
          ustb_valuation: item.Valuation_USTB,
          gold_valuation: item.Valuation_Gold,
          chg_open_int_pct: item.Pct_Change_Open_Interest,
          chg_comm_net_pct: item.Pct_Change_Commercial_Positions_Net,
          chg_retail_net_pct: item.Pct_Change_NonRept_Positions_Net,
          call_put_ratio: item.Call_Put_Ratio,
          chg_weekly_close_pct: item.Weekly_Close_Percent_Change,
        })) : [];
         
        //console.log(mappedData);
       
  
        setData(mappedData);

        //console.log(data);

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
                <MaterialTable2 data={data} title="Indicators" height={600} width="100%"/>
              </Item>
            </Grid>
            </Grid>
        </Box>
      </div>
    );

}
