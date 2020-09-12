import React from 'react';
import './App.css';
import Modal from './components/Modal';
import MainScreen from './components/MainScreen';
import Main from './components/Main';
import { Route, Redirect } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';

/*
I did manage to get all of the features however:

Instead of creating seperate components for Modal A/B and Modal C, 
I used one Modal which renders different content depending on the Modal selected. 
Upon further reflection, it seems you expected me to use Redux to pass the state via a store between Modals.

I completely misinterpreted what you meant by 'think about it as part of something bigger' -- thought
you meant bigger opportunity, but obviously you meant a bigger app/scale. Very foolish of me!

I didn't consider how this app would work on scale, so that was definitely a shortcoming on my implementation.

 For example I may have structured the files or classes differently, or seperated the folders. I would also
 add a config file for the token...

Unfortunately due to personal time restraints within the 36 hours,
I do not have enough time to restructure this app within your expectations. 
And implement Redux. I would also have implemented better routing.

I am more than happy to re-do it and re-structure the app, if you think we may be a good match and happy 
to give me another 24 hours to work on it.

I also used Lodash library to implement a quick debounce function 
- for the search function and the infinity scroll - instead of writing one myself.

Thank you for the opportunity.
*/

function App() {
  return (

    <BrowserRouter>
    <div className="App">
      <Route exact path ='/' exact component={Main}/>
    </div>
    </BrowserRouter>
  );
}

export default App;
