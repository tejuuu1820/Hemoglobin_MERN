import React from 'react';

function Button({ name, icon, onClick, bg, bPad, color, bRad, type }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 font-inherit transition-all duration-300 outline-none border-none ${bPad} ${bRad} ${bg} ${color}`}
            type={type}
        >
            {icon}
            {name}
        </button>
    );
}

export default Button;
