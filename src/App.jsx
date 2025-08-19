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

const click = new Howl({
    src://['./src/assets/deltarune-explosion.mp3']
        ['./src/assets/mouse-click.mp3'],
    // './assets/mouse-click.mp3'], // Provide multiple formats for browser compatibility
});
const nextTurnSound= new Howl ({src:['./src/assets/swoosh-sound-effects.mp3']});

function App() {
    const [count, setCount] = useState(0)

    const [gameData, setGameData] = useState(data)

    const [numdice, setnumdice] = useState(2);
    const [numfaces, setnumfaces] = useState(6);

    const handleButtonClick = () => {
        setCount(count + 1);
        click.play(); // Play sound when button is clicked
    }

    const [openConfig, setOpenConfig] = useState(true);
    const [turnCounter, setTurnCounter] = useState(0);


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

    return (
        <>
            <header className="App-header">
                <h1> Two-turn TTRPG Initiative Autoroller </h1>
            </header>
            <nav className="App-nav">
                nav
                <Button variant={"outlined"} size={"large"}
                        onClick={handleButtonClick}>
                    {count}
                </Button>
            </nav>

            <div className="dice setter">
                <>
                    <RangelimitedInputter min={0} value={numdice} onChange={setnumdice}></RangelimitedInputter>
                    <h2> {numdice} d {numfaces} </h2>
                    <RangelimitedInputter max={1000} value={numfaces} onChange={setnumfaces}></RangelimitedInputter>
                </>

            </div>

            <div className="config">
                <Button size={"large"} variant={"text"} onClick={() => setOpenConfig(!openConfig)}>{openConfig? 'hide' : 'open'} Character Config</Button>
                <Collapse in={openConfig}>
                    <PlayerDataConfig charData = {gameData} onChange={setGameData}></PlayerDataConfig>
                </Collapse>

            </div>

            <div className="App-body">
                <h2 className={'header this turn'}> Turn {turnCounter}:</h2>
                <div className={`inittable thisturn ${turnCounter%2 ? 'switched' : ''}`}>

                    <InitTable className="table1" charData={gameData} numdice={numdice} numfaces={numfaces}
                               rerolltrigger={turn1Trigger}> </InitTable>
                </div>
                <h2></h2>
                <Button className="button next" size={"large"} variant={"outlined"} onClick={() => {
                    //make swap table 2 and table 1? and then reroll the new table 2.
                    handleNextTurn()
                }}> <h2> NEXT TURN </h2></Button>
                <h2 className={'header next turn'}>Upcoming Turn:</h2>
                <div className={`inittable nextturn ${turnCounter%2 ? 'switched' : ''}`}>

                    <InitTable className = "table2" charData={gameData} numdice={numdice} numfaces={numfaces} rerolltrigger={turn2Trigger}></InitTable>
                </div>


            </div>

            <footer className="App-footer">
                feet
            </footer>
        </>
    )
}

export default App
