import React from 'react';

import './Checkbox.css';

const checkbox = (props) => (
    <label className="checkbox">
        <span>{props.children}</span>
    <input
    
    id="ckb2"
    type="checkbox"
    defaultChecked={props.defaultChecked} 
    onChange={props.handleChangeCheck}
    name="sign-up"
    />
    </label>
);

export default checkbox;