import {Component} from "react";

function Dice(props) {


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
            re += randomint(1, dicefaces + 1);
        }
        return re;
    }
}
export default Dice