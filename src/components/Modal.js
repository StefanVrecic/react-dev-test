import React, { Component } from 'react';
import './Modal.css'

import Backdrop from './Backdrop';
import Button from './Button';
import Checkbox from './Checkbox';
import axios from "axios";
import Search from './Search';
import _ from 'lodash';


class Modal extends Component {

    constructor(props){
        super(props);
        this.listItemClickedHandler = this.listItemClickedHandler.bind(this);
        this.state = {
// eg: https://api.dev.pastorsline.com/api/contacts.json?companyId=171&query&page&countryId=
            token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzEiLCJleHAiOjE2MDM3ODM0Mzd9.3ievseHtX0t3roGh7nBuNsiaQeSjfiHWyyx_5GlOLXk",
            searchQuery: "",
            queryURL: "https://api.dev.pastorsline.com/api/contacts.json?companyId=171&",
            querySearch: "",
            page: 1, // page param in query
            renderDetails: [], // details for each individual from query
            defaultChecked: false, // sets even only on/off
            debugMode: false, // shows alerts
            idList: [], // list of ids from individual from query
            is_c_open: false, // check if Modal C is open
            c_contactDetails: "", // details to show in Modal C when item clicked
            loadingMoreResults: "Loading Results...", // shows status when scrolling
            location: props.location // shows which country/world etc
        };
    }

    componentDidMount(){
         this.getDetails();
    }
   
    // should fix forceCountryId, not enough time to think about it yet.
    getDetails(searching, forceCountryId) {
        let countryId = this.getCountryId(this.state.location);

        if (forceCountryId) { countryId = forceCountryId; }
        
        let querySearch = this.state.querySearch;
        let page = this.state.page;
        let queryURL = this.state.queryURL + "query" + (querySearch != "" ? "=" : "") + querySearch;
        queryURL = queryURL + "&page" + (page != "" ? "=" : "") + page;
        queryURL = queryURL + "&countryId=" + countryId;
        
        this.debug(queryURL);

      const instance = axios.create({
        headers: {'Authorization': "Bearer " + this.state.token}
      });
      instance.get(queryURL, {
    }).then(response => {
        let storage = (JSON.parse(JSON.stringify(response.data.contacts)));
        console.log(storage);
        let responseKeys = Object.entries(storage);
        let i = 0;
        // let details = "<ul>"
        let details = [];
        let idList = [];
        for (const k of responseKeys) {
            let fName = "", lName ="", email = "", phoneNumber = "";

            let id = "id: " + responseKeys[i][1].id + " / ";
            idList.push(responseKeys[i][1].id);

            if (responseKeys[i][1].first_name != null && responseKeys[i][1].first_name != "") {
                fName = "First name: " + responseKeys[i][1].first_name + " / ";
            } 
            if (responseKeys[i][1].last_name  != null && responseKeys[i][1].last_name  != "") {
                lName = "Last  name: " + responseKeys[i][1].last_name + " / ";
            } 
            if (responseKeys[i][1].email != null && responseKeys[i][1].email != "") {
                email = "Email: " + responseKeys[i][1].email + " / ";
            } 
            if (responseKeys[i][1].phone_number != null && responseKeys[i][1].phone_number != "") {
                phoneNumber = "Phone number: " + responseKeys[i][1].phone_number + " / ";
            } 

            let contactDetails = id + fName + lName + email + phoneNumber;

            details.push(contactDetails);
            i++;
        }
        let getDetailsConcatTemp = [];
        let getIdListTemp = [];
        if (!searching){ 
            getDetailsConcatTemp = [...this.state.renderDetails];
            getIdListTemp = [...this.state.idList];
        } 
        getDetailsConcatTemp.push(...details);

        getIdListTemp.push(...idList);
        // debug(getIdListTemp); debug(getDetailsConcatTemp);

        this.setState({renderDetails: getDetailsConcatTemp, idList: getIdListTemp});
        this.setState({loadingMoreResults: "Loaded!"});
    })
    .catch(error => {
        alert(error);
        console.log(error);
    });
    }

    // converts country from name to id for query
      getCountryId = (location) =>  {
        let id = "";
        switch(location){
            case "USA":
                id = 226;
                break;
            default:
                id = 176;
        }
        return id;
    }

    // launch Modal with specific data -- render will check for if is_c_open
       listItemClickedHandler(e) {
         this.setState({is_c_open: true, c_contactDetails: e});
      }

      // Modal buttons for USA/world
    buttonClickedHandler = (location) => {
        this.debug(location + this.getCountryId(location));
        this.setState({renderDetails:[], idList:[] }); // this clears the results from the previous Modal
        this.setState({page: 0}); // resets the page for API query
        this.setState({location: location, is_c_open: false}); // sets location for title

        const countryId = this.getCountryId(location);

        this.getDetails(false, countryId); // sends query for new country/world when switching modals via btn
    }

    closeModalHandler = () => {
        this.props.closeModal();
    }

    handleChangeCheckHandler = () => {
        this.setState({defaultChecked: !this.state.defaultChecked})
    }
    
    // turns debugging alerts on/off
    handleDebug = () => {
        this.setState({debugMode: !this.state.debugMode});
    }

    debug = (msg) => {
        if (this.state.debugMode) {
            alert(msg);
        }
    }

    handleSearch = (search) => {
        // debug(search);
        this.setState({renderDetails:[], idList:[] }); // this clears the old results? Done twice...
        this.setState({page: 0});
        this.setState({querySearch: search});
        this.getDetails(true);
    }

      handleScroll = () =>  {
          // if (scrollTop > (scrollHeight - (offsetHeight * 1.5)))
        // check if user has scrolled past the last item
        const last = document.querySelector('.list-container');
        const lastItem =  last.scrollHeight; // last item = 643
        const scrollTop = last.scrollTop;
        const offSet = last.offsetHeight;
        const threshold = (lastItem - (offSet * 1.4));

        const currentPage = this.state.page;
        const newPage = currentPage + 1;
        
        // load new results
        if (scrollTop > threshold) {
            
            this.setState({loadingMoreResults:"Loading Results... (1000ms debounce)"});
            this.initDebounceLoad(newPage)
        }

      }
      
      // load new results, but don't do this repeatedly more than 1 request / 1000ms
      initDebounceLoad = _.debounce((newPage) => {
        this.setState({ page:newPage });
        this.getDetails();
  }, 1000)

    render()  {
       let renderDetails = this.state.renderDetails; 
       let idList = this.state.idList;
       let is_c_open = this.state.is_c_open;
       let location = this.state.location;

       let renderContainer = [];
    
       if (renderDetails == null) { 
           renderDetails = <h2>Just a moment please...</h2>;
           renderContainer.push(renderDetails);
        } else {
            let i = 0;
       renderDetails.forEach(item => {
           if (this.state.defaultChecked && idList[i] % 2 != 0) { // checks for even ids if only even checked
               i++;
           } else {
            // list item to add to array
           let tmp = <li onClick ={() => {this.listItemClickedHandler(item)}}>{item}</li>;

           renderContainer.push(tmp);
           i++;
           }


       });

       // uses same style Modal, but different content
       if (is_c_open) {
        renderContainer = <li>{this.state.c_contactDetails}</li>;
        location = "INDIVIDUAL DETAIL (MODAL C)";   
    }

    }
    // REFACTORING IDEAS: seperate Buttons in div into seperate component, checkboxes too
        return (
        <div>
        <Backdrop show={true} clicked={this.props.modalClosed} />
            <div className="Modal" >
                <h2>{this.state.loadingMoreResults}</h2>
                 <h2 className="modal-location">{location}</h2>
              <p>{this.props.children}</p>
              <div className="modalInputs">
              <div>
                <Button fontColor="white" backgroundColor="#46139f" clicked={() => this.buttonClickedHandler("WORLD")}>All Contacts</Button>
                <Button fontColor="white" backgroundColor="#ff7f50" clicked={() => this.buttonClickedHandler("USA")}>US Contacts</Button>
                <Button borderColor="#46139f" clicked={this.closeModalHandler}>Close</Button>
              </div>
              <div className="modalInputs__checkbox">
                <Checkbox handleChangeCheck={this.handleChangeCheckHandler} defaultChecked={this.state.defaultChecked}>Only Even</Checkbox>
                <Checkbox className="debug" handleChangeCheck={this.handleDebug} defaultChecked={this.state.debugMode}>Debug (alerts on)</Checkbox>
              </div>
              <Search handleSearch={this.handleSearch}></Search>
              </div>

            <p></p>
            {/* this is where the list of contacts is rendered! */}
            <div className="list-container" onScroll={this.handleScroll}>{renderContainer}</div>
            </div>
            </div>
        );
        }
    }
export default Modal; 