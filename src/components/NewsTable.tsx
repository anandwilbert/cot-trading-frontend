import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';


type Event = {
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



interface TableProps {
  data: Event[];
  title?: string;
  height?: number;
  width?: string;
}

export default function NewsTable({ data, title, height, width }: TableProps) {
    
    const numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    });


    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<Event>[]>(
        () => [
        {
            accessorKey: 'date', //access nested data with dot notation
            header: 'Date',
            size: 150,
            Cell: ({ cell }) => {
              const dateValue = cell.getValue<string>();
              if (!dateValue) return ''; // Handle null/undefined
              const date = new Date(dateValue);
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
        },
        },
        {
            accessorKey: 'currency',
            header: 'Currency',
            size: 20,
        },
        {
            accessorKey: 'impact', //normal accessorKey
            header: 'Impact',
            size: 20,
            muiTableBodyCellProps: ({ cell }) => {
              const impactValue = cell.getValue<string>();
              let backgroundColor = 'transparent'; // Default background
              if (impactValue === 'red') {
                backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Light red background
              } else if (impactValue === 'orange') {
                backgroundColor = 'rgba(255, 165, 0, 0.5)'; // Light orange background
              }
              return {
                style: {
                  backgroundColor,
                },
              };
            }
        },
        {
            accessorKey: 'event',
            header: 'Event',
            size: 300,
        },
        {
            accessorKey: 'currency_outlook',
            header: 'Currency Outlook',
            size: 20,
            muiTableBodyCellProps: ({ cell }) => {
              const impactValue = cell.getValue<string>();
              let backgroundColor = 'transparent'; // Default background
              if (impactValue === 'Positive') {
                backgroundColor = 'rgba(49, 171, 59, 0.73)'; // Light red background
              } else if (impactValue === 'Negative') {
                backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Light orange background
              } else if (impactValue === 'Neutral') {
                backgroundColor = 'rgba(150, 148, 144, 0.94)'; // Light orange background
              }
              return {
                style: {
                  backgroundColor,
                },
              };
            }
        },
        {
            accessorKey: 'stock_outlook',
            header: 'Stock Outlook',
            size: 20,
            muiTableBodyCellProps: ({ cell }) => {
              const impactValue = cell.getValue<string>();
              let backgroundColor = 'transparent'; // Default background
              if (impactValue === 'Positive') {
                backgroundColor = 'rgba(49, 171, 59, 0.73)'; // Light red background
              } else if (impactValue === 'Negative') {
                backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Light orange background
              } else if (impactValue === 'Neutral') {
                backgroundColor = 'rgba(150, 148, 144, 0.94)'; // Light orange background
              }
              return {
                style: {
                  backgroundColor,
                },
              };
            }
        },
        {
            accessorKey: 'actual',
            header: 'Actual',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'forecast',
            header: 'Forecast',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'previous',
            header: 'Previous',
            size: 20,
            Cell: ({ cell }) => numberFormatter.format(cell.getValue<number>()),
        },
        {
            accessorKey: 'unit',
            header: 'Unit',
            size: 20,
        }        
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
            height: '32px',
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

            // Add check for empty or undefined data
    if (!data || data.length === 0) {
        return (
        <div style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p>No data available</p>
        </div>
        );
    }


    return <MaterialReactTable table={table} />;
};

