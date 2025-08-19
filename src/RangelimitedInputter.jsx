import React, {useState, useEffect } from "react";
import {Howl} from "howler";
//import { useNumber } from "./NumberContext"; // Import the hook

const click = new Howl({
    src://['./src/assets/deltarune-explosion.mp3']
        ['./src/assets/mouse-click.mp3'],
    // './assets/mouse-click.mp3'], // Provide multiple formats for browser compatibility
});

function RangelimitedInputter(props) { //default step
    const { min=1, max = 20, step = 1, value = min, onChange } = props;
    const [num, setNum] = useState(value);
    const [inputVal, setInputVal] = useState(num.toString() );

    // Sync internal state when external value changes
    useEffect(() => {
        setInputVal(value.toString());
    }, [value]);


    const updateValue = (newValue) => {
        const clampedValue = Math.max(min, Math.min(newValue, max));
        onChange(clampedValue); // Notify parent of changes
        setNum(clampedValue); //keep this here?
        setInputVal(clampedValue.toString());
    };

    function handleInputChange(e) {
        const value = e.target.value;
        if (value === '' || /^-?\d*$/.test(value)) {
            setInputVal(value);
        }
    }
    function handleInputBlur() {
        let parsedValue = parseInt(inputVal, 10);

        if (isNaN(parsedValue)) {
            parsedValue = num; // Reset to prev number if input is not a number
        } else if (parsedValue < min) {
            parsedValue = min;
        } else if (parsedValue > max) {
            parsedValue = max;
        }

        setNum(parsedValue);
        setInputVal(parsedValue.toString());
        updateValue(parsedValue);

    }

    function increment() {
        updateValue( Math.min(num+step, max));
        click.play()
    }
    function decrement() {
        updateValue( Math.max(num-step, min));
        click.play()
    }

    return (
        <>
            <button onClick={decrement}> - </button>
            <input
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                inputMode="numeric" // Shows numeric keyboard on mobile
                style={{width: '50px' , textAlign: 'center'}}

            />
            <button onClick={increment}>+</button>
        </>
    )
}

export default RangelimitedInputter;