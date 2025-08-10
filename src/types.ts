export type TeamColor = 'red' | 'blue' | 'green';

export interface Character {
    init: number;
    initmod: number;
    name: string;
    lair: boolean;
    team: TeamColor;
}

export type TableData = Character[];

export interface CharacterBase {
    id: string;  // Added unique identifier
    name: string;
    initmod: number;
    lair: boolean;
    team: TeamColor;
}

export interface CharacterInstance extends CharacterBase {
    init: number;  // Initiative can vary per instance
}

export type CharacterData = {
    baseData: CharacterBase[];  // Shared properties
    table1: CharacterInstance[];  // Table-specific initiatives
    table2: CharacterInstance[];
};