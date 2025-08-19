import {useEffect, useState} from 'react'
import './App.css'
import InitTable from "./InitTable.jsx";
import Dice from './Dice.jsx'
//import dice from "./Dice.jsx";
import {Howl} from 'howler';
import {Button, Collapse} from "@mui/material";
import RangelimitedInputter from "./RangelimitedInputter.jsx";
import DualInitTable from "./DualInitTable.js";
import PlayerDataConfig from "./PlayerDataConfig.js";
import { playerConfigTestData as data} from "./types";

const nextTurnSound= new Howl ({src:['./src/assets/swoosh-sound-effects.mp3']});

function App() {

    const [gameData, setGameData] = useState(data)

    const [numdice, setnumdice] = useState(2);
    const [numfaces, setnumfaces] = useState(6);


    const [openConfig, setOpenConfig] = useState(true);
    const [turnCounter, setTurnCounter] = useState(1);


    const handleNextTurn = () => {
        // 2. Increment turn counter (triggers reroll via rerolltrigger)
        setTurnCounter(prev => prev + 1);
        nextTurnSound.play();
    };

    const [turn1Trigger, setTurn1Trigger] = useState(0);
    //make turn1 increment on odd turns, and turn 2 on even
    useEffect(() => {
        if (turnCounter%2) setTurn1Trigger(!turn1Trigger);
        else setTurn2Trigger(!turn2Trigger);
    },[turnCounter])
    const [turn2Trigger, setTurn2Trigger] = useState(0);

    const [columnVersion, setColumnVersion] = useState(false);
    return (
        <>
            <header className="App-header">
                <h1> Two-turn TTRPG Initiative Autoroller </h1>
            </header>
            <nav className="App-nav">

            </nav>

            <div className="dice setter">
                <>
                    <RangelimitedInputter min={0} value={numdice} onChange={setnumdice}></RangelimitedInputter>
                    <h2> {numdice} d {numfaces} </h2>
                    <RangelimitedInputter max={1000} value={numfaces} onChange={setnumfaces}></RangelimitedInputter>
                </>

            </div>

            <div className="config">
                <Button size={"large"} variant={'outlined'} onClick={() => setOpenConfig(!openConfig)}>
                    {openConfig? 'hide' : 'open'} Character Config</Button>
                <Collapse in={openConfig}>
                    <PlayerDataConfig charData = {gameData} onChange={setGameData}></PlayerDataConfig>
                </Collapse>


            </div>
            <Button size={"large"} variant={'outlined'} onClick={() => setColumnVersion(!columnVersion)}>
                switch to {columnVersion ? 'horizontal' : 'vertical' } view</Button>
            <div className={`App-body ${columnVersion ? '' : 'row'}`}>

                <div className={`inittable thisturn ${turnCounter%2 ? 'switched' : ''}`}>
                    <h2 className={'header this turn'}> {turnCounter % 2 ? 'Upcoming':'Turn ' + turnCounter }:</h2>
                    <InitTable className="table1" charData={gameData} numdice={numdice} numfaces={numfaces}
                               rerolltrigger={turn1Trigger}> </InitTable>
                </div>
                <h2></h2>
                <Button className="button next" size={"large"} variant={"outlined"} onClick={() => {
                    //make swap table 2 and table 1? and then reroll the new table 2.
                    handleNextTurn()
                }}> <h2> NEXT TURN </h2></Button>

                <div className={`inittable nextturn ${turnCounter%2 ? 'switched' : ''}`}>
                    <h2 className={'header next turn'}>{turnCounter % 2 ? 'Turn ' + turnCounter : 'Upcoming'}</h2>
                    <InitTable className = "table2" charData={gameData} numdice={numdice} numfaces={numfaces} rerolltrigger={turn2Trigger}></InitTable>
                </div>


            </div>

            <footer className="App-footer">
                Copyright © 2025 Natalie Qiu. All Rights Reserved.
            </footer>
        </>
    )
}

export default App
