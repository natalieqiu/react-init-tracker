import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import {useState, useMemo} from "react";

type Person = {
    name: string;
    surname: string;
    birthYear: number;
    birthCity: number;
};

function CustomEditComponent() {
    const [data, setData] = useState<Person[]>([
        { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
        { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
    ]);

    const columns = useMemo<MRT_ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                Edit: ({ cell, column, row, table }) => (
                    <input
                        type="text"
                        value={row.getValue('name')}
                        onChange={e => row._valuesCache.name = e.target.value}
                    />
                ),
            },
            {
                accessorKey: 'surname',
                header: 'Surname'
            },
            {
                accessorKey: 'birthYear',
                header: 'Birth Year'
            },
            {
                accessorKey: 'birthCity',
                header: 'Birth Place',
                // For lookup functionality, you might need to use a custom cell render
            },
        ],
        [],
    );

    return (
        <MaterialReactTable
            columns={columns}
            data={data}
            enableEditing
            onEditingRowSave={async ({ values, table }) => {
                // Handle save logic here
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setData(data.map((d, i) => i === table.editingRow?.index ? values : d));
                table.setEditingRow(null);
            }}
            onCreatingRowSave={async ({ values, table }) => {
                // Handle create logic here
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setData([...data, values]);
                table.setCreatingRow(null);
            }}
            onDeletingRow={async ({ row, table }) => {
                // Handle delete logic here
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setData(data.filter((_, i) => i !== row.index));
                table.setDeletingRow(null);
            }}
        />
    );
}