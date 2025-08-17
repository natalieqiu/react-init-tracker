import {useState} from 'react'
import './App.css'
import InitTable from "./InitTable.jsx";
import Dice from './Dice.jsx'
//import dice from "./Dice.jsx";
import {Howl} from 'howler';
import {Button} from "@mui/material";
import RangelimitedInputter from "./RangelimitedInputter.jsx";
import DualInitTable from "./DualInitTable.js";
import PlayerDataConfig from "./PlayerDataConfig.js";
import { playerConfigTestData as data} from "./types";

const click = new Howl({
    src://['./src/assets/deltarune-explosion.mp3']
        ['./src/assets/mouse-click.mp3'],
    // './assets/mouse-click.mp3'], // Provide multiple formats for browser compatibility
});


function App() {
    const [count, setCount] = useState(0)

    const [gameData, setGameData] = useState(data)

    const [numdice, setnumdice] = useState(2);
    const [numfaces, setnumfaces] = useState(6);

    const [table1, setTable1] = useState(data)
    const [table2, setTable2] = useState(data)

    const handleButtonClick = () => {
        setCount(count + 1);
        click.play(); // Play sound when button is clicked
    }
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

            <div className="dice duce number setter">
                <>
                    <RangelimitedInputter value={numdice} onChange={setnumdice}></RangelimitedInputter>
                    <h2> {numdice} d {numfaces} </h2>
                    <RangelimitedInputter max={1000} value={numfaces} onChange={setnumfaces}></RangelimitedInputter>
                </>

            </div>

            <div className="config">
                <h2>config</h2>
                {gameData.toString()}
                <PlayerDataConfig charData = {gameData} onChange={setGameData}></PlayerDataConfig>
            </div>

            <div className="App-body">
                <h2>this turn </h2>
                <InitTable name="bob" charData={gameData} numdice={numdice} numfaces={numfaces}></InitTable> //update when gameData is updated.

                    <h2> next turn</h2>
            </div>

            <footer className="App-footer">
                feet
            </footer>
        </>
    )
}

export default App
