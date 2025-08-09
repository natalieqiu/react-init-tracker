import React, {useState} from "react";

function RangelimitedInputter(props) { //default step
    const { min=1, max = 20, step = 1 } = props;
    const [num, setNum] = useState(min);

    function increment() {
        setNum( Math.min(num+step, max));
    }
    function decrement() {
        setNum( Math.max(num-step, min));
    }

    return (
        <>
            <button onClick={decrement}> - </button>
             <span>{num}</span>
            <button onClick={increment}>+</button>
        </>
    )
}

export default RangelimitedInputter;