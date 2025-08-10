import { useMemo, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { Checkbox } from '@mui/material';
import { initData } from './initData';
import type { Character, TableData, TeamColor } from './types';

const InitTable = () => {
    const columns = useMemo<MRT_ColumnDef<Character>[]>(
        () => [
            {
                accessorKey: 'init',
                header: 'init',
                size: 150,
            },
            {
                accessorKey: 'initmod',
                header: 'initmod',
                size: 150,
            },
            {
                accessorKey: 'name',
                header: 'name',
                size: 200,
            },
            {
                accessorKey: 'lair',
                header: 'lair',
                Cell: ({ cell }) => (
                    <Checkbox checked={cell.getValue<boolean>()}  />
                ),
                size: 150,
            },
            {
                accessorKey: 'team',
                header: 'team',
                size: 150,
            },
        ],
        [],
    );

    const [data, setData] = useState<TableData>(initData);

    // Team color styles
    const teamStyles = {
        red: { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
        blue: { backgroundColor: 'rgba(0, 0, 255, 0.1)' },
        green: { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
    };
    const getTeamBackgroundColor = (team: TeamColor, opacity = 0.3) => {
        switch (team) {
            case 'red': return `rgba(255, 0, 0, ${opacity})`;
            case 'blue': return `rgba(0, 0, 255, ${opacity})`;
            case 'green': return `rgba(0, 255, 0, ${opacity})`;
            default: return 'transparent';
        }
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowOrdering: true,
        enableSorting: true,
        enablePagination: false,
        enableEditing: true,
        enableTableFooter: false,
        // 1. First define the drag handle configuration
        muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow) {
                    const newData = [...data];
                    newData.splice(
                        hoveredRow.index,
                        0,
                        newData.splice(draggingRow.index, 1)[0],
                    );
                    setData(newData);
                }
            },
        }),

        // 2. Then add row styling that won't interfere with dragging
        muiTableBodyRowProps: ({ row }) => ({
            sx: {
                backgroundColor: getTeamBackgroundColor(row.original.team),
                '&:hover': {
                    backgroundColor: getTeamBackgroundColor(row.original.team, 0.3),
                },
            },
        }),
    });
    return <MaterialReactTable table={table} />;
};

export default InitTable;