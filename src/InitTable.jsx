import { useMemo, useState } from 'react';
//import {useMemo} from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';

import { Checkbox } from '@mui/material';

// nested data is ok, see accessorKeys in ColumnDef below
const initData = [
    {
        init: 0,
        initmod: 1,
        name: 'ally',
        lair: false,
    },
    {
        init: 0,
        initmod: 2,
        name: 'billan',
        lair: false,
    },
    {
        name: 'lair',
        initmod: 20,
        init: 20,
        lair: true,
    }
];

const Example = () => {
    // should be memoized or stable
    const columns = useMemo(
        () => [
            {
                accessorKey: 'init', // access nested data with dot notation
                header: 'init',
                size: 150,
            },
            {
                accessorKey: 'initmod',
                header: 'initmod',
                size: 150,
            },
            {
                accessorKey: 'name', // normal accessorKey
                header: 'name',
                size: 200,
            },
            {
                accessorKey: 'lair',
                header: 'lair',
                Cell: ({ cell }) => (
                    <Checkbox
                        checked={cell.getValue()}
                        //disabled // Make it read-only, remove this if you want it editable
                    />
                ),
                size: 150,
            },
        ],
        [],
    );


    const [data, setData] = useState(() => initData);

    const table = useMaterialReactTable({
        columns,
        data: data, // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        enableRowOrdering: true,
        enableSorting: true,
        enablePagination: false,
        enableEditing: true,
        enableTableFooter: false,
        //muiEditTextFieldProps(name){},
        muiRowDragHandleProps: ({ table }) => ({
            onDragEnd: () => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow) {
                    data.splice(
                        hoveredRow.index,
                        0,
                        data.splice(draggingRow.index, 1)[0],
                    );
                    setData([...data]);
                }
            },
        }),
    });

    return <MaterialReactTable table={table}/>;
};

export default Example;