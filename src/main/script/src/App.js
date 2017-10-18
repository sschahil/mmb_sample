import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import client from './client.js'

var follow = require('./follow');

const root = '/api';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {gurdwaras: [], attributes: [], pageSize: 2, links: {}};
    this.updatePageSize = this.updatePageSize.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNavigate = this.onNavigate.bind(this);
  }

  loadFromServer(pageSize) {
    follow(client, root, [
      {rel: 'gurdwaras', params: {size: pageSize}}]
    ).then(gurdwaraCollection => {
      return client({
        method: 'GET',
        path: gurdwaraCollection.entity._links.profile.href,
        headers: {'Accept': 'application/schema+json'}
      }).then(schema => {
        this.schema = schema.entity;
        return gurdwaraCollection;
      });
    }).then(gurdwaraCollection => {
      this.setState({
        gurdwaras: gurdwaraCollection.entity._embedded.gurdwaras,
        attributes: Object.keys(this.schema.properties),
        pageSize: pageSize,
        links: gurdwaraCollection.entity._links
      });
    });
  }

  onCreate(newGurdwara) {
    follow(client, root, ['gurdwaras']).then(gurdwaraCollection => {
      return client({
        method: 'POST',
        path: gurdwaraCollection.entity._links.self.href,
        entity: newGurdwara,
        headers: {'Content-Type': 'application/json'}
      })
    }).then(response => {
      return follow(client, root, [
        {rel: 'gurdwaras', params: {'size': this.state.pageSize}}]);
    }).then(response => {
      if(typeof response.entity._links.last !== "undefined") {
        this.onNavigate(response.entity._links.last.href);
      } else {
        this.onNavigate(response.entity._links.self.href);
      }
    });
  }

/*
  onUpdate(gurdwara, updateGurdwara) {
    client({
      method: 'PUT',
      path: gurdwara.entity._links.self.href,
      entity: updateGurdwara,
      headers: {
        'Content-Type': 'application/json',
        'If-Match': gurdwara.headers.Etag
      }
    }).done(response => {
      this.loadFromServer(this.state.pageSize);
    }, response => {
      if (response.status.code === 412) {
        alert('DENIED: Unable to update' + gurdwara.entity._links.self.href + '. Your copy is stale.');
      }
    });
  }
*/

  onDelete(gurdwara) {
    client({method: 'DELETE', path: gurdwara._links.self.href}).then(response => {
      this.loadFromServer(this.state.pageSize);
    });
  }

  onNavigate(navUri) {
    client({
      method: 'GET',
      path: navUri
    }).done(gurdwaraCollection => {
      this.setState({
        gurdwaras: gurdwaraCollection.entity._embedded.gurdwaras,
        attributes: this.state.attributes,
        pageSize: this.state.pageSize,
        links: gurdwaraCollection.entity._links
      });
    });
  }

  updatePageSize(pageSize) {
    if(pageSize !== this.state.pageSize) {
      this.loadFromServer(pageSize);
    }
  }

  componentDidMount() {
    this.loadFromServer(this.state.pageSize);
  }

  render() {
    return (
      <div>
        <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
        <GurdwaraList gurdwaras={this.state.gurdwaras}
                                 links={this.state.links}
                                 pageSize={this.state.pageSize}
                                 attributes={this.state.attributes}
                                 onNavigate={this.onNavigate}
                                 onDelete={this.onDelete}
                                 updatePageSize={this.updatePageSize}/>
      </div>
    );
  }
} // end:: App

class CreateDialog extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var newGurdwara = {};
    this.props.attributes.forEach(attribute => {
      newGurdwara[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onCreate(newGurdwara);

    //clear out the dialog's inputs
    this.props.attributes.forEach(attribute => {
      ReactDOM.findDOMNode(this.refs[attribute]).value = '';
    });

    //Navigate away from the dialog to hide it
    window.location = "#";
  }

  render() {
    var inputs = this.props.attributes.map(attribute =>
      <p key={attribute}>
        <input type="text" placeholder={attribute} ref={attribute} className="field" />
      </p>
    );
    return (
      <div>
        <a href="#createGurdwara">Create</a>

        <div id="createGurdwara" className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>

            <h2>Add Gurdwara</h2>

            <form>
              {inputs}
              <button onClick={this.handleSubmit}>Add</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}; // end::create-dialog

/*
class UpdateDialog extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    var updatedGurdwara = {};
    this.props.attributes.forEach(attribute => {
      updatedGurdwara[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
    });
    this.props.onUpdate(this.props.gurdwara, updatedGurdwara);
    window.location = "#";
  }

  rend() {
    var inputs = this.props.attributes.map(attribute => 
      <p key={this.props.gurdwara.entity[attribute]}>
        <input type="text" placeholder={attribute}
          defaultValue={this.props.gurdwara.entity[attribute]}
          ref={attribute} className="field" />
      </p>
    );
    var dialogId = "updateGurdwara-" + this.props.gurdwara.entity._links.self.href;

    return(
      <div key={this.props.gurdwara.entity._links.self.href}>
        <a href={"#" + dialogId}>Update</a>
        <div id={dialogId} className="modalDialog">
          <div>
            <a href="#" title="Close" className="close">X</a>
            <h2>Update Gurdwara</h2>
            <form>
              {inputs}
              <button onClick={this.handleSubmit}>Update</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}; // end:: UpdateDialog*/

class GurdwaraList extends Component {
  
  constructor(props) {
    super(props);
    this.handleNavFirst = this.handleNavFirst.bind(this);
    this.handleNavPrev = this.handleNavPrev.bind(this);
    this.handleNavNext = this.handleNavNext.bind(this);
    this.handleNavLast = this.handleNavLast.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  // tag::handle-page-size-updates
  handleInput(e) {
    e.preventDefault();
    var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
    if(/^[0-9]+$/.test(pageSize)) {
      this.props.updatePageSize(pageSize);
    } else {
      ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
    }
  } // end::handle-page-size-updates

  // tag:: handle-nav
  handleNavFirst(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.first.href);
  }
  handleNavPrev(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.prev.href);
  }
  handleNavNext(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.next.href);
  }
  handleNavLast(e) {
    e.preventDefault();
    this.props.onNavigate(this.props.links.last.href);
  }// end:: handle-nav

  // tag:: gurdwara-list-render
  render() {
    var gurdwaras = this.props.gurdwaras.map(gurdwara => 
      <Gurdwara key={gurdwara._links.self.href} gurdwara={gurdwara} onDelete={this.props.onDelete}/>
    );

    var navLinks = [];
    if("first" in this.props.links) {
      navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
    }
    if("prev" in this.props.links) {
      navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
    }
    if("next" in this.props.links) {
      navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
    }
    if("last" in this.props.links) {
      navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
    }

    return (
      <div>
        <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zipcode</th>
              <th>Country Code</th>
              <th></th>
            </tr>
            {gurdwaras}
          </tbody>
        </table>
        <div>
          {navLinks}
        </div>
      </div>
    )
  } // end:: gurdwara-list-render
}; // end:: GurdwaraList

class Gurdwara extends Component {

  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.onDelete(this.props.gurdwara);
  }

  render() {
    return(
      <tr>
        <td>{this.props.gurdwara.name}</td>
        <td>{this.props.gurdwara.address}</td>
        <td>{this.props.gurdwara.city}</td>
        <td>{this.props.gurdwara.state}</td>
        <td>{this.props.gurdwara.zipcode}</td>
        <td>{this.props.gurdwara.country_code}</td>
        <td>
          <button onClick={this.handleDelete}>Delete</button>
        </td>
      </tr>
    )
  }
}

export default App;
