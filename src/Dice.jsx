import {Component} from "react";

let numdice = 1, dicefaces = 20;


function updateNumber(num) {
    numdice = num;
}
function updateDiceFaces(num) {
    dicefaces = num;
}

/**
 *
 * @param isLair boolean
 * @param initmod number
 * @return {*}
 */
function rollInit( isLair, initmod ){
    //if lair = true, init = initmod
    if (isLair) return initmod;
    //else, roll {numdice}
    let re = initmod;
    for (let i = 0; i < numdice; i++) {
        re+= randomint(1, dicefaces + 1);
    }
    return re;
}

export default class Dice extends Component {}