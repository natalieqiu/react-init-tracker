import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {useMemo, useState} from "react";
import type {Character, CharacterBase, TableData, TeamColor} from "./types";
import {Checkbox} from "@mui/material";
import {playerConfigTestData, playerConfigTestData as data} from "./initData";

interface PlayerDataConfigProps {
    columns?: MRT_ColumnDef<CharacterBase>[];
}

const PlayerDataConfig = ({columns: columnsProp}: PlayerDataConfigProps) => {
    const defaultColumns = useMemo<MRT_ColumnDef<CharacterBase>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'id',
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
                Cell: ({cell}) => (
                    <Checkbox checked={cell.getValue<boolean>()}/>
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
    const columns = columnsProp || defaultColumns;
    const [data, setData] = useState<CharacterBase[] >(playerConfigTestData);

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
        enableEditing: true,
        enableTableFooter: false,

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
export default PlayerDataConfig;