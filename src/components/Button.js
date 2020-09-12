import React from 'react';

import './Button.css';

const button = (props) => (
    <button
        type="button"
        disabled={props.disabled}
        className={"btn " + [[props.btnType]].join(' ')}
        onClick={props.clicked}
        style={{color: props.fontColor, backgroundColor: props.backgroundColor, borderColor: props.borderColor}}
        >{props.children}
        </button>
);

export default button;