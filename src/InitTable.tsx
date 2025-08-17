import {useMemo, useState} from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import {Checkbox} from '@mui/material';
import {CharacterInstance, playerConfigTestData} from './types';
import type {CharacterData, TeamColor} from './types';

interface InitTableProps {
    columns?: MRT_ColumnDef<CharacterData>[];
    charData?: MRT_ColumnDef<CharacterData>[];
}

const InitTable = (props) => {
    const {charData, numdice, numfaces} = props;
    const defaultColumns = useMemo<MRT_ColumnDef<CharacterInstance>[]>(
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

        ],
        [],
    );
    const columns =  defaultColumns;
    const [data, setData] = useState<CharacterInstance[] >(charData);

    // Team color styles
    const getTeamBackgroundColor = (team: TeamColor, opacity = 0.3) => {
        switch (team) {
            case 'red':
                return `rgba(255, 0, 0, ${opacity})`;
            case 'blue':
                return `rgba(0, 0, 255, ${opacity})`;
            case 'green':
                return `rgba(0, 255, 0, ${opacity})`;
            default:
                return 'transparent';
        }
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableRowOrdering: true,
        enableSorting: true,
        enablePagination: false,
        enableEditing: false,
        enableTableFooter: false,
        // 1. First define the drag handle configuration
        muiRowDragHandleProps: ({table}) => ({
            onDragEnd: () => {
                const {draggingRow, hoveredRow} = table.getState();
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
        muiTableBodyRowProps: ({row}) => ({
            sx: {
                backgroundColor: getTeamBackgroundColor(row.original.team),
                '&:hover': {
                    backgroundColor: getTeamBackgroundColor(row.original.team, 0.3),
                },
            },
        }),
    });
    return <MaterialReactTable table={table}/>;
};

export default InitTable;