import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component';

import './custom.css'
import DateTable from "./components/DateTable/DateTable";

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <div className="app-container">
            <ReactNotification />
            <DateTable />
        </div>
    );
  }
}
