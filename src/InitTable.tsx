import {useEffect, useMemo, useState} from 'react';
import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable,} from 'material-react-table';
import {Button} from '@mui/material';
import type {CharacterBase, TeamColor} from './types';
import {CharacterInstance} from './types';
import {Howl} from 'howler';

//const diceClacks =
const numDiceSfxs = 10;
const howls = {};
for (let i=0; i < numDiceSfxs; i++) { //10 dice roll sounds in folder labeled 1-9
    howls[i] = new Howl({
        src: ['./src/assets/roll' + i + '.mp3', './src/assets/roll' + i + '.ogg']
    });
}

interface InitTableProps {
    charData: CharacterBase[],
    numdice: number,
    numfaces: number,
}

const InitTable = (props: InitTableProps) => {
    const {charData, numdice, numfaces} = props;
    const [internalnumdice, setinternalnumdice] = useState(numdice);
    const [internalnumfaces, setinternalnumfaces] = useState(numfaces);

    useEffect(() => {
        setinternalnumdice(numdice);
        console.log('numdice changed');
    }, [numdice])

    useEffect(() => {
        setinternalnumfaces(numfaces);
        console.log('numfaces changed');
    }, [numfaces])


    const columns =  useMemo<MRT_ColumnDef<CharacterInstance>[]>(
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

    const roll1Dice = () =>
        [...Array(internalnumdice)].reduce(sum => sum + Math.floor(Math.random() * internalnumfaces) + 1, 0);
    const handleDebugRoll = () => {
        const rollResult = roll1Dice();
        howls[Math.floor(Math.random() * numDiceSfxs)].play();

        setdbgrResult(rollResult);
    };
    const [debugroll, setdbgrResult] = useState(null);

    const createOneCharInstance = (c:CharacterBase): CharacterInstance =>{
        const roll = roll1Dice();
        return {
            id: c.id,  // Added unique identifier
            name: c.name,
            initmod: c.initmod,
            lair: c.lair,
            team: c.team,
            turns: c.turns, //number or undef

            instanceId: crypto.randomUUID(),
            roll: roll,
            init: Boolean(c.lair) ? c.initmod : roll + c.initmod
        };
    }
    const updateCharData=()=>{
        console.log('heres when we would updateCharData');
    }

    const convertAllData = ( d: CharacterBase[] ): CharacterInstance[] =>{
        //for all unique ids in config:
        const result = [];
        for (let i=0; i < d.length; i++) {
            //for number of turns listed: create 1 instance
            for (let j=0; j< Number(d[i].turns) ; j++) {
                result.push( createOneCharInstance(d[i]) )
            }
        }
        result.sort((a:CharacterInstance, b:CharacterInstance) => b.initmod - a.initmod);
        return result;
    }

    const [data, setData] = useState<CharacterInstance[] >(convertAllData(charData));

    useEffect(() => {
        updateCharData();
    }, [charData]);

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
        //have it initially sorted from largest to smallest
     /*   initialState: {
            sorting: [{id: 'init', // This should match your accessorKey
                    desc: true, // Sorts in descending order (highest initiative first)
                }]},*/
        // 1. First define the drag handle configuration
        muiRowDragHandleProps: ({table}) => ({
            onDragStart: () => {
                table.setSorting([]); // Clear sorting when dragging starts
            },
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
        muiTableBodyRowProps: ({row}) => ({
            sx: {
                backgroundColor: getTeamBackgroundColor(row.original.team),
                '&:hover': {
                    backgroundColor: getTeamBackgroundColor(row.original.team, 0.3),
                },
            },
        }),
    });
    return (
        <>
            {numdice} {numfaces} and {internalnumdice} {internalnumfaces}
            <Button onClick={handleDebugRoll}> Roll! </Button>
            {debugroll !== null && (<p>You rolled: {debugroll}</p>)}
            <MaterialReactTable table={table}/>
            </>
    )
};

export default InitTable;