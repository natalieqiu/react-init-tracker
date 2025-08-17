import {Component, useState} from "react";
import RangelimitedInputter from "./RangelimitedInputter.jsx";
import {Button} from "@mui/material";

function Dice(props) {
    const {numdice = 1, numfaces = 20 } = props;
    const [internalnumdice, setInternalnumdice] = useState(numdice);
    const [internalnumfaces, setInternalnumfaces] = useState(numfaces);


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
        for (let i = 0; i < internalnumdice; i++) {
            re += randomint(1, internalnumfaces + 1);
        }
        return re;
    }

    function rollDice() {
        const re = 0;
        for (let i = 0; i < internalnumdice; i++) {
            re += Math.floor(Math.random() * (internalnumfaces)) + 1;
        }
        return re;
    }
    const roll1Dice = () =>
        [...Array(internalnumdice)].reduce(sum => sum + Math.floor(Math.random() * internalnumfaces) + 1, 0);

    const handleRoll = () => {
        const rollResult = roll1Dice();
        setResult(rollResult);
    };
    const [result, setResult] = useState(null);

    return (
        <>
            <RangelimitedInputter value={internalnumdice} onChange={setInternalnumdice}></RangelimitedInputter>
            {internalnumdice} d {internalnumfaces}
            <RangelimitedInputter max={1000} value={internalnumfaces} onChange={setInternalnumfaces}></RangelimitedInputter>

            <Button onClick={handleRoll}> Roll! </Button>
            {result !== null && (<p>You rolled: {result}</p>)}
        </>

    )
}
export default Dice