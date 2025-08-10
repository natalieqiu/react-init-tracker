import React from "react";
import { useNumber } from "./NumberContext";

function NumberDisplay() {
    const { num } = useNumber();

    return (
        <div>
            <h3>Current Number Value:</h3>
            <p>{num}</p>
        </div>
    );
}