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
        id : 1,
        initmod: 1,
        name: 'ally',
        lair: false,
        team: 'blue',
        turns: 1,
    },
    {
        id : 2,
        initmod: 2,
        name: 'billan',
        lair: false,
        team: 'red',
        turns: 2,
    },
    {
        id : 3,
        initmod: 20,
        name: 'lair',
        lair: true,
        team: 'green',
    }
];