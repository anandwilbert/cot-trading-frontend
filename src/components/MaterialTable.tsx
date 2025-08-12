import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

//example data type
type Indicator = {
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


    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<Indicator>[]>(
        () => [
        {
            accessorKey: 'short_code', //access nested data with dot notation
            header: 'Short Code',
            size: 20,
        },
        {
            accessorKey: 'comm_long_pct',
            header: 'Com Long',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'comm_cot_index', //normal accessorKey
            header: 'Com COT Idx',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'retail_cot_index',
            header: 'Ret Cot Idx',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'usd_valuation',
            header: 'USD Val',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'ustb_valuation',
            header: 'USTB Val',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'gold_valuation',
            header: 'Gold Val',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'chg_open_int_pct',
            header: 'Chg OI',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'chg_comm_net_pct',
            header: 'Chg Com Net',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'chg_retail_net_pct',
            header: 'Chg Ret Net',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'call_put_ratio',
            header: 'Call/Put',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'chg_weekly_close_pct',
            header: 'Chg Wk Cl',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        initialState: {
            pagination: { pageIndex: 0, pageSize: 50 }, // <-- default rows per page
        },
        muiPaginationProps: {
            rowsPerPageOptions: [10, 25, 50, 100], // dropdown options
        },
    });

    return <MaterialReactTable table={table} />;
};

