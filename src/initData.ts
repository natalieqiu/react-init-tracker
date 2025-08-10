import {CharacterBase, TableData} from './types';

export const initData: TableData = [
    {
        init: 0,
        initmod: 1,
        name: 'ally',
        lair: false,
        team: 'blue',
    },
    {
        init: 0,
        initmod: 2,
        name: 'billan',
        lair: false,
        team: 'red',
    },
    {
        name: 'lair',
        initmod: 20,
        init: 20,
        lair: true,
        team: 'green',
    }
];

export const playerConfigTestData: CharacterBase[] = [
    {
        id : Date.now().toString(),
        initmod: 1,
        name: 'ally',
        lair: false,
        team: 'blue',
    },
    {
        id : Date.now().toString(),
        initmod: 2,
        name: 'billan',
        lair: false,
        team: 'red',
    },
    {
        id : Date.now().toString(),
        initmod: 20,
        name: 'lair',
        init: 20,
        lair: true,
        team: 'green',
    }
];