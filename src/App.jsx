import {useState} from 'react'
import './App.css'
import InitTable from "./InitTable.jsx";
import Dice from './Dice.jsx'
//import dice from "./Dice.jsx";
import {Howl} from 'howler';
import {Button} from "@mui/material";
import RangelimitedInputter from "./RangelimitedInputter.jsx";

const click = new Howl({
    src://['./src/assets/deltarune-explosion.mp3']
        ['./src/assets/mouse-click.mp3'],
    // './assets/mouse-click.mp3'], // Provide multiple formats for browser compatibility
});


function App() {
    const [count, setCount] = useState(0)

    const handleButtonClick = () => {
        setCount(count + 1);
        click.play(); // Play sound when button is clicked
    }
    return (
        <>
            <header className="App-header">
                <h1> Webbedsite </h1>
            </header>
            <nav className="App-nav">
                nav
            </nav>
            <div className="dice selector">

                <h2>
                    <RangelimitedInputter name={"numdice"} min={1} max = {10}> </RangelimitedInputter>
                    d
                    <RangelimitedInputter name={'dicefaces'} min={1} max = {99}> </RangelimitedInputter>
                </h2>

            </div>
            <div className="App-body">
                <Button variant={"outlined"}  size={"large"}
                        onClick={handleButtonClick}>
                    {count}
                </Button>
                <InitTable name="bob"></InitTable>
                <div>

                </div>
                <InitTable name="joe"></InitTable>
            </div>


            <footer className="App-footer">
                feet
            </footer>
        </>
    )
}

export default App
