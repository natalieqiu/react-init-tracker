import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {useMemo, useState} from "react";
import type {CharacterBase, TeamColor} from "./types";
import {Button, Checkbox} from "@mui/material";
import {playerConfigTestData, playerConfigTestData as data} from "./types";
import { Box, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface PlayerDataConfigProps {
    columns?: MRT_ColumnDef<CharacterBase>[];
}

const PlayerDataConfig = (props) => {
    const {charData, onChange} = props;
    const defaultColumns = useMemo<MRT_ColumnDef<CharacterBase>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'id',
                size: 150,
                enableEditing: false, // Make ID non-editable
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
                    <Checkbox checked={cell.getValue<boolean>()} disabled/>
                ),
                Edit: ({cell, column, row, table}) => (
                    <Checkbox
                        checked={row._valuesCache[column.id] ?? cell.getValue()}
                        onChange={(e) => {
                            row._valuesCache[column.id] = e.target.checked;
                        }}
                    />
                ),
                size: 150,
            },
            {
                accessorKey: 'team',
                header: 'team',
                size: 150,
                editVariant: 'select',
                editSelectOptions: ['red', 'blue', 'green'] as TeamColor[],
            },
            {
                accessorKey: 'turns',
                header: 'turns',
                size: 150,
            },
        ],
        [],
    );
    const columns =  defaultColumns;
    //const [data, setData] = useState<CharacterBase[]>(playerConfigTestData);
    const [data, setData] = useState<CharacterBase[]>(charData);


    const handleSaveRow = ({row, values}: { row: any; values: CharacterBase }) => {
        console.log('in handleSaveRow', row, values);
        console.log( Number(values.initmod));
        if ( isNaN(Number(values.initmod)) ) {
            alert('Initmod must be a number');
            return;
        }
        if ( isNaN(Number(values.turns)) ) {
            alert('Turns must be a number');
            return;
        }
        setData(prevData =>
            prevData.map(character =>
                character.id === row.original.id ? {...character, ...values} : character
            )
        );
        table.setEditingRow(null)
    };

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

    const coloredData = useMemo(() => data.map(character => ({
        ...character,
        _rowColor: getTeamBackgroundColor(character.team),
        _rowHoverColor: getTeamBackgroundColor(character.team, 0.5)
    })), [data]);

    const handleDeleteRow = (row: any) => {
        if (window.confirm('Are you sure you want to delete this row?')) {
            setData(prevData => prevData.filter(character => character.id !== row.original.id));
        }
    };

    const table = useMaterialReactTable({
        columns,
        data,
        enableSorting: true,
        enablePagination: false,
        enableEditing: true,
        enableTableFooter: true,

        editDisplayMode: 'row', // Use row editing mode instead of modal
        onEditingRowSave: handleSaveRow,
        muiTableBodyRowProps: ({row}) => {
            // Type-safe way to get the current team without .find()
            const currentTeam = data[row.index]?.team ?? row.original.team;
            return {
                sx: {
                    backgroundColor: getTeamBackgroundColor(currentTeam),
                    '&:hover': {
                        backgroundColor: getTeamBackgroundColor(currentTeam, 0.5),
                    },
                },
            };
        },
        createDisplayMode: "row",
        positionCreatingRow: "bottom",
        onCreatingRowSave: ({table, values}) => {
            // Generate a new ID (simple increment for demo - use UUID in production)
            const newId = crypto.randomUUID(); //data.length > 0 ? Math.max(...data.map(c => c.id)) + 1 : 1;

            const newCharacter: CharacterBase = {
                id: newId,
                name: values.name || 'New Character',
                initmod: Number(values.initmod) || 0,
                lair: Boolean(values.lair),
                team: 'red', // default to red
                turns: values.turns ? Number(values.turns) : 1,
            };

            setData(prev => [...prev, newCharacter]);
            table.setCreatingRow(null);
        },
        onCreatingRowCancel: () => {
            //clear any validation errors
        },
        renderTopToolbarCustomActions: ({table}) => (
            <Button
                onClick={() => {
                    table.setCreatingRow(true); //simplest way to open the create row modal with no default values
                    //or you can pass in a row object to set default values with the `createRow` helper function
                    // table.setCreatingRow(
                    //   createRow(table, {
                    //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
                    //   }),
                    // );
                }}
            >
                Add Combat Entity
            </Button>
        ),
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                    <Delete />
                </IconButton>
            </Box>
        ),

    });
    return <MaterialReactTable table={table}/>;
};
export default PlayerDataConfig;