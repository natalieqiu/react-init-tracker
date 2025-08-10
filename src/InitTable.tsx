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

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowOrdering: true,
        enableSorting: true,
        enablePagination: false,
        enableEditing: true,
        enableTableFooter: false,
        muiTableBodyRowProps: ({ row }) => ({
            sx: { // Using MUI's sx prop for better theming support
                backgroundColor: theme => {
                    switch (row.original.team) {
                        case 'red': return theme.palette.error.light + '40'; // 40 = 25% opacity
                        case 'blue': return theme.palette.info.light + '40';
                        case 'green': return theme.palette.success.light + '40';
                        default: return 'transparent';
                    }
                },
                '&:hover': {
                    backgroundColor: theme => {
                        switch (row.original.team) {
                            case 'red':
                                return theme.palette.error.light + '60';
                            case 'blue':
                                return theme.palette.info.light + '60';
                            case 'green':
                                return theme.palette.success.light + '60';
                            default:
                                return 'transparent';
                        }
                        }
                }
            },
        }),
    });

    return <MaterialReactTable table={table} />;
};

export default InitTable;