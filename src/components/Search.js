import React, { Component } from 'react';
import _ from 'lodash';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'test'};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // creates a small delay when typing before firing off the request
  // debounce exaggerated to 1000ms for demo purposes -- I would use a lower number in production, e.g., ~250-300
  search = _.debounce((e) => {
    this.props.handleSearch(e);
  }, 1000)

  
  handleChange(event) {
    this.setState({value: event.target.value});
    this.search(event.target.value);
  }
  
  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSearch(this.state.value);
  }

  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Filter contact:{" "}
          <input  type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Search;