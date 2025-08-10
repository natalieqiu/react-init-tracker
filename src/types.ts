export type TeamColor = 'red' | 'blue' | 'green';

export interface Character {
    init: number;
    initmod: number;
    name: string;
    lair: boolean;
    team: TeamColor;
}

export type TableData = Character[];