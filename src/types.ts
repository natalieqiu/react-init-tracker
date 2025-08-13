export type TeamColor = 'red' | 'blue' | 'green';
///generated data schema
export interface CharacterBase {
    id: string| number;  // Added unique identifier
    name: string;
    initmod: number;
    lair: boolean;
    team: TeamColor;
    turns: number; //number or undef
}

export interface CharacterInstance extends CharacterBase {
    instanceId: number;
    init?: number;  // Initiative can vary per instance
}

export type CharacterData = {
    baseData: CharacterBase;  // Shared properties
    thisTurnInstances: CharacterInstance[];  // Table-specific initiatives
    nextTurnInstances: CharacterInstance[];
};

////data

export const playerConfigTestData: CharacterBase[] = [
    {
        id : 1,
        initmod: 1,
        init: 99,
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
        turns: 1,
    }
];

