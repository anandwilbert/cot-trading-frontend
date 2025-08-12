import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Cell,
} from 'material-react-table';

// Example data type
type Indicator = {
  short_code: string;
  comm_long_pct: number;
  comm_cot_index: number;
  retail_cot_index: number;
  usd_valuation: number;
  ustb_valuation: number;
  gold_valuation: number; // optional
  chg_open_int_pct: number;
  chg_comm_net_pct: number;
  chg_retail_net_pct: number;
  call_put_ratio: number;
  chg_weekly_close_pct: number;
};

interface TableProps {
  data: Indicator[];
  title?: string;
  height?: number;
  width?: string;
}

export default function MaterialTable({ data, title, height, width }: TableProps) {
  // Add check for empty or undefined data
  if (!data || data.length === 0) {
    return (
      <div style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>No data available</p>
      </div>
    );
  }

  const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Function to calculate gradient color based on value
  const getGradientColor = (value: number, min: number, max: number) => {
    if (isNaN(value) || min === undefined || max === undefined) {
      return 'transparent'; // Fallback for invalid values
    }
    const normalized = max === min ? 0.5 : (value - min) / (max - min); // Use 0.5 if min === max
    const r = Math.floor(normalized * 255);
    const g = Math.floor((1 - normalized) * 255);
    const color = `rgba(${r}, ${g}, 0, 0.5)`; // Opacity 0.5 for visibility
    console.log(`Value: ${value}, Min: ${min}, Max: ${max}, Color: ${color}`); // Debug log
    return color;
  };

  // Calculate min/max for each numeric column
  const numericColumns = [
    'comm_long_pct',
    'comm_cot_index',
    'retail_cot_index',
    'usd_valuation',
    'ustb_valuation',
    'gold_valuation',
    'chg_open_int_pct',
    'chg_comm_net_pct',
    'chg_retail_net_pct',
    'call_put_ratio',
    'chg_weekly_close_pct',
  ];

  const minMaxValues = useMemo(() => {
    const result: { [key: string]: { min: number; max: number } } = {};
    numericColumns.forEach((key) => {
      const values = data
        .map((row) => row[key as keyof Indicator])
        .filter((v): v is number => typeof v === 'number' && !isNaN(v)) as number[];
      if (values.length > 0) {
        result[key] = {
          min: Math.min(...values),
          max: Math.max(...values),
        };
      } else {
        result[key] = { min: 0, max: 1 }; // Fallback for empty/invalid data
      }
      console.log(`Column: ${key}, Min: ${result[key].min}, Max: ${result[key].max}, Values: ${values.length}`); // Debug log
    });
    return result;
  }, [data]);

  // Memoized columns with gradient coloring and original headers
  const columns = useMemo<MRT_ColumnDef<Indicator>[]>(
    () => [
      {
        accessorKey: 'short_code',
        header: 'Short Code',
        size: 20,
        muiTableBodyCellProps: {
          style: {
            padding: '3px',
            height: '25px',
            border: 'none', // Remove borders for body cells
          },
        },
      },
      {
        accessorKey: 'comm_long_pct',
        header: 'Com Long',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['comm_long_pct'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'comm_cot_index',
        header: 'Com COT Idx',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['comm_cot_index'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'retail_cot_index',
        header: 'Ret Cot Idx',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['retail_cot_index'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'usd_valuation',
        header: 'USD Val',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['usd_valuation'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'ustb_valuation',
        header: 'USTB Val',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['ustb_valuation'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'gold_valuation',
        header: 'Gold Val',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (value === undefined || isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['gold_valuation'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'chg_open_int_pct',
        header: 'Chg OI',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['chg_open_int_pct'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'chg_comm_net_pct',
        header: 'Chg Com Net',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['chg_comm_net_pct'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'chg_retail_net_pct',
        header: 'Chg Ret Net',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['chg_retail_net_pct'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'call_put_ratio',
        header: 'Call/Put',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['call_put_ratio'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
      {
        accessorKey: 'chg_weekly_close_pct',
        header: 'Chg Wk Cl',
        size: 20,
        Cell: ({ cell }: { cell: MRT_Cell<Indicator> }) => {
          const value = cell.getValue<number>();
          if (isNaN(value)) {
            return (
              <div style={{ padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
                {'-'}
              </div>
            );
          }
          const { min, max } = minMaxValues['chg_weekly_close_pct'];
          const backgroundColor = getGradientColor(value, min, max);
          return (
            <div style={{ backgroundColor, padding: '3px', textAlign: 'right', height: '25px', border: 'none' }}>
              {numberFormatter.format(value)}
            </div>
          );
        },
      },
    ],
    [minMaxValues]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 50 },
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 25, 50, 100],
    },
    muiTableBodyCellProps: {
      style: {
        padding: '3px',
        height: '25px',
        lineHeight: '1.2',
        border: 'none', // Remove borders for body cells
      },
    },
    muiTableHeadCellProps: {
      style: {
        padding: '3px', // Keep minimal padding
        height: '25px',
        lineHeight: '1.2',
        border: 'none', // Remove borders for header cells
        margin: 0, // Ensure no margin
      },
    },
    muiTableProps: {
      style: {
        borderCollapse: 'collapse', // Remove white spaces between cells
        border: 'none', // Ensure no table-level borders
      },
    },
  });

  return <MaterialReactTable table={table} />;
}