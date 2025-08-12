"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import StackedBarChart from '@/components/StackedBarChart';
import PositiveNegativeBarChart from '@/components/PositiveNegativeBarChart';

import { Theme, useTheme } from '@mui/material/styles';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MultipleSelectChip from '@/components/MultipleSelectChip';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import SendIcon from '@mui/icons-material/Send';

import { MuiMarkdown } from 'mui-markdown';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  boxShadow: 'none',
  textAlign: 'left',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const names = [
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CORN',
  'SOYBEAN',
];


const codeDictionary: { [key: string]: string } = {
  'USD-IDX': 'USD',
  'AUD': 'AUD',
  'CHF': 'CHF',
  'JPY': 'JPY',
  'CAD': 'CAD',
  'GBP': 'GBP',
  'NZD': 'NZD',
  'MXN': 'MXN',
  'EUR-FX': 'EUR-FX',

  'BTC': 'BTC',  
  'ETH': 'ETH',

  'WHEAT-S': 'WHEAT-S',
  'WHEAT-H': 'WHEAT-H',
  'CORN': 'CORN',
  'SOY-ML': 'SOY-ML',
  'NAT-GAS': 'NAT-GAS',
  'SOYBEAN': 'SOYBEAN',
  'SOY-OIL': 'SOY-OIL',
  'COCOA': 'COCOA',
  'CRUDE-OIL': 'CRUDE-OIL',
  'COFFEE': 'COFFEE',
  'LUMBER': 'LUMBER',

  'PALL': 'PALL',
  'PLAT': 'PLAT',
  'SILVER': 'SILVER',
  'GOLD': 'GOLD',

  'DOW-JONES': 'DOW-JONES',
  'VIX': 'VIX',
  'NASDAQ': 'NASDAQ',
  'USTB': 'USTB',

};


function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}



export default function AIAnalysisPage() {

    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [shortCode, setShortCode] = React.useState<string[]>([]);

    const [aiAnalysis, setAiAnalysis] = React.useState<string>();
  
    const handleChange = (event: SelectChangeEvent<typeof shortCode>) => {
      const {
        target: { value },
      } = event;
      setShortCode(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };


    const handleButtonCLick = async () => {
        if (shortCode.length == 0) return;
    
        setLoading(true);

        
        const commaShortCodes: string = shortCode.join(", ");

    
        try {
          // Call the Next.js API route
          //const response = await fetch('/api/chat', {
          const response = await fetch('/api/aianalysis', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              //prompt: newUserMessage.text,
              shortCode: commaShortCodes,
            }),
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
  
          const aiResponseText = data.response;

          console.log(aiResponseText);

          setAiAnalysis(aiResponseText);
    
        } catch (error) {
          console.error('API Error:', error);
        } finally {
          setLoading(false);
        }
      };

    
  return (
      <div>
        
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={0} boxShadow='none'>
            <Grid size={8} spacing={0} boxShadow='none'>
                  <Item>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={shortCode}
                      onChange={handleChange}
                      fullWidth={true}
                      input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={codeDictionary[value] || value} />
                          ))}
                        </Box>

                      )}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, shortCode, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                      {Object.entries(codeDictionary).map(([key, value]) => (
                        <MenuItem
                          key={key}
                          value={key}
                          style={getStyles(key, shortCode, theme)}
                        >
                          {value}
                        </MenuItem>
                      ))}
                    </Select>
                  </Item>
                </Grid>
                <Grid size={4} spacing={0} boxShadow='none'>
                  <Item>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, boxShadow: 'none'  }}>
                      <Button variant="contained" onClick={handleButtonCLick} startIcon={<SendIcon />}>Start Analysis</Button>
                    </Box>
                  </Item>
                </Grid>
              <Grid size={12} >
                <Item>
                  <Paper 
                    sx={{
                    p: 1,
                    //backgroundColor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                    backgroundColor: 'background.default',
                    maxWidth: { xs: '100%', sm: '100%', md: '100%' }, // Responsive message width
                    color: 'text.primary', // White text for readability
                    boxShadow: 'none'
                  }}
                >
                  <MuiMarkdown>{aiAnalysis}</MuiMarkdown>
                </Paper>
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CircularProgress size={20} />
                  </Box>
                )}
              </Item>
            </Grid> 
           
          </Grid>
        </Box>
      </div>
    );

}
