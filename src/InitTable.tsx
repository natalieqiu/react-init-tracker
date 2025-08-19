import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MaterialReactTable, type MRT_ColumnDef, useMaterialReactTable,} from 'material-react-table';
import {Button} from '@mui/material';
import type {CharacterBase, TeamColor} from './types';
import {CharacterInstance} from './types';
import {Howl} from 'howler';

//const diceClacks =
const numDiceSfxs = 10;
const howls = {};
for (let i = 0; i < numDiceSfxs; i++) { //10 dice roll sounds in folder labeled 1-9
    howls[i] = new Howl({
        src: ['./src/assets/roll' + i + '.mp3', './src/assets/roll' + i + '.ogg']
    });
}
const playRandomDice = () => {
    howls[Math.floor(Math.random() * numDiceSfxs)].play();
};

interface InitTableProps {
    charData: CharacterBase[],
    numdice: number,
    numfaces: number,
    rerolltrigger?: number,
}

const InitTable = (props: InitTableProps) => {
        const {charData, numdice, numfaces, rerolltrigger =1} = props;
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


        const columns = useMemo<MRT_ColumnDef<CharacterInstance>[]>(
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
            playRandomDice();

            setdbgrResult(rollResult);
        };
        const [debugroll, setdbgrResult] = useState(null);

        const rerollInit = (character: CharacterInstance): CharacterInstance => {
            // Explicitly type the roll variable
            const roll = roll1Dice();
            return {
                ...character,
                roll: roll,
                init: character.lair ? character.initmod : roll + character.initmod,
            };
        };

        const createOneCharInstance = (c: CharacterBase): CharacterInstance => {
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
                init: Boolean(c.lair) ? c.initmod : roll + Number(c.initmod)
            };
        }

        const initiativeSort = useCallback((a: CharacterInstance, b: CharacterInstance) =>
                b.init - a.init === 0 ? b.initmod - a.initmod : b.init - a.init
            , []);

        const convertAllData = (d: CharacterBase[]): CharacterInstance[] => {
            //for all unique ids in config:
            const result = [];
            for (let i = 0; i < d.length; i++) {
                //for number of turns listed: create 1 instance
                for (let j = 0; j < Number(d[i].turns); j++) {
                    result.push(createOneCharInstance(d[i]))
                }
            }
            result.sort(initiativeSort);
            return result;
        }
        //if numdice change, reroll and resort
        useEffect(() => {
            setData(prevData =>
                prevData.map(char => rerollInit(char)).sort(initiativeSort) // Creates NEW array
            );
            //resortInit();
        }, [numdice, numfaces, rerolltrigger]);

        const [data, setData] = useState<CharacterInstance[]>(convertAllData(charData));
        const prevCharDataRef = useRef<CharacterBase[]>();

        //two hooks for safety
        useEffect(() => {
            prevCharDataRef.current = charData;

        });

        const removeDeletedCharacters = () => {
            const validIds = new Set(charData.map((item: CharacterBase) => item.id));
            setData((prev: CharacterInstance[]) => prev.filter(item => validIds.has(item.id)));
        };
        const addNewCharactersIfExist = () => {
            // new ids = set of character ids in charData that are not already in data (local data var)
            const existingIds = new Set(data.map((item: CharacterInstance) => item.id));
            // Filter charData to only include characters not already in data
            const newCharacters = charData.filter((item: CharacterBase) => !existingIds.has(item.id));
            if (newCharacters.length > 0) {
                // Convert new characters to instances
                const newInstances = convertAllData(newCharacters.filter(item => item.id));

                // Combine new data with preexisting data
                setData([...data, ...newInstances]);
            }

        };
        //update data if changes:
        //compare prevCharDataRef.current (old data) with the new charData (current data)
        useEffect(() => {
            if (prevCharDataRef.current) {
                //here, its different. we just need to figre out how:
                //check for added character row
                addNewCharactersIfExist();
                //check for deleted character
                removeDeletedCharacters();

                //check for change in turn number, adjust instances as needed

                //easy stuff = name, initmod, color, is lair...
                //generated with deepseek.ai
                setData(prev => {
                    const charDataMap = new Map(charData.map(char => [char.id, char]));

                    // First pass: Update existing instances' properties
                    const updatedInstances = prev.map(instance => {
                        const currentCharData = charDataMap.get(instance.id);
                        if (!currentCharData) return instance;

                        const needsUpdate =
                            instance.turns !== currentCharData.turns ||
                            instance.lair !== currentCharData.lair ||
                            instance.name !== currentCharData.name ||
                            instance.initmod !== currentCharData.initmod ||
                            instance.team !== currentCharData.team;

                        if (!needsUpdate) return instance;

                        return {
                            ...instance,
                            turns: currentCharData.turns,
                            lair: currentCharData.lair,
                            name: currentCharData.name,
                            initmod: Number(currentCharData.initmod),
                            init: Number(currentCharData.lair ? currentCharData.initmod : instance.roll + Number(currentCharData.initmod)),
                            team: currentCharData.team,
                            // Add any other properties that should sync
                        };
                    });
                    // Second pass: Adjust instance counts per character
                    const finalInstances = [];

                    // Group instances by character ID for easier processing
                    const instancesByCharId = new Map<string, CharacterInstance[]>();
                    updatedInstances.forEach(instance => {
                        const group = instancesByCharId.get(instance.id) || [];
                        group.push(instance);
                        instancesByCharId.set(instance.id, group);
                    });

                    // Process each character group
                    charData.forEach(char => {
                        const existingInstances = instancesByCharId.get(char.id) || [];
                        const currentTurns = Number(char.turns);
                        const existingCount = existingInstances.length;

                        // Case 1: Need more instances
                        if (currentTurns > existingCount) {
                            const newInstances = [...existingInstances];
                            for (let i = existingCount; i < currentTurns; i++) {
                                newInstances.push(createOneCharInstance(char));
                            }
                            finalInstances.push(...newInstances);
                        }
                        // Case 2: Need fewer instances
                        else if (currentTurns < existingCount) {
                            finalInstances.push(...existingInstances.slice(0, currentTurns));
                        }
                        // Case 3: Correct number of instances
                        else {
                            finalInstances.push(...existingInstances);
                        }
                    });
                    return finalInstances;
                });
            }
            //final resort
            setData(prevData =>
                prevData.sort(initiativeSort) // Creates NEW array
            );
            prevCharDataRef.current = charData; // Update ref for next render
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

            enableColumnActions: false,
            enableSorting: false,

            enablePagination: false,
            enableEditing: false,
            enableTableFooter: false,
            enableTopToolbar: false,

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
                        setIsSortedByInit(false);
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
        const [isSortedByInit, setIsSortedByInit] = useState(true);

        return (
            <>

                <Button variant={"outlined"}
                        onClick={() => {
                            if (!isSortedByInit) {
                                setData(prevData =>
                                    //    [...prevData] creates a new array copy  and   .sort() now operates on the copy
                                    [...prevData].sort(initiativeSort)
                                );
                                setIsSortedByInit(true);
                            } else {
                                playRandomDice();
                            }
                        }}

                >
                    {isSortedByInit ? ":)" : "Reset to Original Order"}
                </Button>
                <Button onClick={() => {
                    setData(prevData =>
                        prevData.map(char => rerollInit(char)).sort(initiativeSort) // Creates NEW array
                    );
                    playRandomDice();
                }}>
                    Reroll Turn
                </Button>
                <MaterialReactTable table={table}/>
            </>
        )
    }
;

export default InitTable;