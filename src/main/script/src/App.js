import React, { Component } from 'react';
import './App.css';
import client from './client.js'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {gurdwaras: []};
  }

  componentDidMount() {
    client({method: 'GET', path: '/api/gurdwaras'})
      .then(response => {
        this.setState({gurdwaras: response.entity._embedded.gurdwaras});
      }); 
  }

  render() {
    return (
      <GurdwaraList gurdwaras={this.state.gurdwaras}/>
    );
  }
}

class GurdwaraList extends Component {
  render() {
    var gurdwaras = this.props.gurdwaras.map(gurdwara => 
      <Gurdwara key={gurdwara._links.self.href} gurdwara={gurdwara}/>
    );
    return (
      <table>
        <tbody> 
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zipcode</th>
            <th>Country Code</th>
          </tr>
          {gurdwaras}
        </tbody>
      </table>
    );
  }
}

class Gurdwara extends Component {
  render() {
    return(
      <tr>
        <td>{this.props.gurdwara.name}</td>
        <td>{this.props.gurdwara.address}</td>
        <td>{this.props.gurdwara.city}</td>
        <td>{this.props.gurdwara.state}</td>
        <td>{this.props.gurdwara.zipcode}</td>
        <td>{this.props.gurdwara.country_code}</td>
      </tr>
    );
  }
}

export default App;
