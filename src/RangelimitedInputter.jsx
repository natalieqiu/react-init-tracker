import React, {useState} from "react";

function RangelimitedInputter(props) { //default step
    const { min=1, max = 20, step = 1 } = props;
    const [num, setNum] = useState(min);
    const [inputVal, setInputVal] = useState(num.toString() );

    const updateValue = (newValue) => {
        const clampedValue = Math.max(min, Math.min(newValue, max));
        setNum(clampedValue);
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
    }

    function increment() {
        updateValue( Math.min(num+step, max));
    }
    function decrement() {
        updateValue( Math.max(num-step, min));
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