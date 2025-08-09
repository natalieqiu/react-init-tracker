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
                header
            </header>
            <nav className="App-nav">
                nav
            </nav>
            <div className="App-body">

                <RangelimitedInputter min={1} max = {10}> </RangelimitedInputter>

                <Button variant={"outlined"}  size={"large"}>
                    {Dice}
                </Button>
                <Button variant={"outlined"}  size={"large"}
                        onClick={handleButtonClick}>
                    {count}
                </Button>
                <InitTable name="bob"></InitTable>
                <div></div>
                <InitTable name="joe"></InitTable>
            </div>


            <footer className="App-footer">
                feet
            </footer>
        </>
    )
}

export default App
