import React, { Component } from 'react';
import './Modal.css'
import Modal from './Modal.js';
import MainScreen from './MainScreen';

//  This class handles the Main Screen with buttons vs the Modals
class Main extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalOpen: false,
            location: null
        };
      }

      openModalHandler = (location) => {
          this.setState({ modalOpen: true, location: location });
      }

      closeModalHandler = () => {
        this.setState({ modalOpen: false });
    }

    render()  {
        let ModalComp;
                if (this.state.modalOpen) {
                    // this.props.history.push('/contactDisplay');
                    window.history.replaceState(null, "New Page Title", "/ContactDetails")
                    ModalComp = <Modal location={this.state.location} history={this.props.history} closeModal={this.closeModalHandler} classes="modal-main" modalClosed="false" show="true"></Modal>
                } else {
                    window.history.replaceState(null, "New Page Title", "/")
                    ModalComp =  <MainScreen launchModal={this.openModalHandler}></MainScreen>
                }
        return (
            <div>
 
            {ModalComp}

            </div>
        );
        }
    }
export default Main; 

