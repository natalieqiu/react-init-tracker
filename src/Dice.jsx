import {Component, useState} from "react";
import RangelimitedInputter from "./RangelimitedInputter.jsx";
import {Button} from "@mui/material";

function Dice() {
    //const {numdice = 2, numfaces = 6} = props;
    const [numdice, setNumDice] = useState(1);
    const [numfaces, setNumFaces] = useState(20);


    /**
     *
     * @param isLair boolean
     * @param initmod number
     * @return {*}
     */
    function rollInit(isLair, initmod) {
        //if lair = true, init = initmod
        if (isLair) return initmod;
        //else, roll {numdice}
        let re = initmod;
        for (let i = 0; i < numdice; i++) {
            re += randomint(1, numfaces + 1);
        }
        return re;
    }

    function rollDice() {
        const re = 0;
        for (let i = 0; i < numdice; i++) {
            re += Math.floor(Math.random() * (numfaces)) + 1;
        }
        return re;
    }
    const roll1Dice = () =>
        [...Array(numdice)].reduce(sum => sum + Math.floor(Math.random() * numfaces) + 1, 0);

    const handleRoll = () => {
        const rollResult = roll1Dice();
        setResult(rollResult);
    };
    const [result, setResult] = useState(null);

    return (
        <>
            <RangelimitedInputter value={numdice} onChange={setNumDice}></RangelimitedInputter>
            {numdice} d {numfaces}
            <RangelimitedInputter max={1000} value={numfaces} onChange={setNumFaces}></RangelimitedInputter>

            <Button onClick={handleRoll}> Roll! </Button>
            {result !== null && (<p>You rolled: {result}</p>)}
        </>

    )
}
export default Dice