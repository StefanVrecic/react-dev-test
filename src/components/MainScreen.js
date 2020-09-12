import React, { Component } from 'react';
import Button from './Button';
import './MainScreen.css'

class MainScreen extends Component {

    launchModalHandler = (location) => {
        this.props.launchModal(location);
    }

    render()  {
                
        return (
        <div className="mainscreen">
            <Button backgroundColor="#46139f" clicked={() => this.launchModalHandler("WORLD")}>Button A (All Contacts)</Button>
            <Button backgroundColor="#ff7f50" clicked={() => this.launchModalHandler("USA")}>Button B (US Contacts)</Button>
        </div>
        );
        }
    }
export default MainScreen; 