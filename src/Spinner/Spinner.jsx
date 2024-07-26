// src/Spinner/Spinner.jsx
import React from 'react';
import { GridLoader } from 'react-spinners';


const Spiner = () => {
    return (
        <div className="spinner flex">
            <GridLoader color="#25634c" />
            <span>Loading...</span>
        </div>
    );
}

export default Spiner;
