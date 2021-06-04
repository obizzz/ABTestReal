import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {store} from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import './DateTable.css';
import Histogram from "../Histogram/Histogram";

function formatDate(date) {
    let d = new Date(date);
    let dd = d.getDate();
    if (dd < 10) dd = '0' + dd;
    let mm = d.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    let yy = d.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;
    return dd + '.' + mm + '.' + yy;
}

function showNotification(type, message) {
    store.addNotification({
        title: "Notification",
        message: message,
        type: type,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", " animate__fadeOut"],
        dismiss: {
            duration: 5000,
            pauseOnHover: true,
            onScreen: true
        }
    });
}

class DateTable extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                records: [],
                userId: '',
                dateRegistration: '',
                dateLastActivity: '',
                isCalculated: false,
                calculatedData: []
            };


        this.handleChange = this.handleChange.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.saveRecords = this.saveRecords.bind(this);
        this.deleteRecords = this.deleteRecords.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    handleChange() {
        if (isNaN(Number(this.state.userId))) {
            showNotification("danger", "UserID must be an integer");
            return;
        }

        if (this.state.userId < 0) {
            showNotification("danger", "UserID must be greater than or equal to 0");
            return;
        }

        let records = this.state.records;
        let isUserAdded = false;
        records.map(
            (record) => {
                if (this.state.userId === record.userId) {
                    showNotification("danger", "A user with this ID has already been added to the list");
                    isUserAdded = true;
                }
            }
        )

        if (!isUserAdded) {
            if (this.state.userId.length === 0 || this.state.dateRegistration === '' || this.state.dateLastActivity === '') {
                showNotification("danger", "Fill all dates in the form");
            } else {
                let dateRegistration = this.state.dateRegistration;
                let dateLastActivity = this.state.dateLastActivity;
                if (dateLastActivity < dateRegistration) {
                    showNotification("danger", "Registration Date must be earlier than Last Activity Date");
                } else {
                    const record = {
                        userId: Number(this.state.userId),
                        //dateRegistration: formatDate(new Date(this.state.dateRegistration)),
                        //dateLastActivity: formatDate(new Date(this.state.dateLastActivity)),
                        dateRegistration: this.state.dateRegistration,
                        dateLastActivity: this.state.dateLastActivity,
                        dateRegistrationFormatted: formatDate(dateRegistration),
                        dateLastActivityFormatted: formatDate(dateLastActivity),
                        selected: false
                    };

                    let newRecords = this.state.records;
                    newRecords.push(record);

                    this.setState({records: newRecords});

                    this.setState({userId: ''});
                    this.setState({dateRegistration: ''});
                    this.setState({dateLastActivity: ''});
                }
            }
        }
    }

    handleAllRowSelect = (isSelected) => {
        let records = this.state.records;
        records.map(
            (record) => {
                record.selected = isSelected;
                return record;
            }
        );

        this.setState({records: records})
    }

    handleRowSelect(row, isSelected, e) {
        row.selected = isSelected
    }

    onSubmit(event) {
        event.preventDefault();
        this.handleChange();
    }

    onChangeInput(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    loadRecords() {
        let request = new XMLHttpRequest();
        request.open("get", "/api/record", true);
        request.onload = function () {
            let data = JSON.parse(request.responseText).map(
                (record) => {
                    //record.dateRegistration = formatDate(new Date(record.dateRegistration.split('T')[0]));
                    //record.dateLastActivity = formatDate(new Date(record.dateLastActivity.split('T')[0]));
                    record.dateRegistration = record.dateRegistration.split('T')[0];
                    record.dateLastActivity = record.dateLastActivity.split('T')[0];
                    record.dateRegistrationFormatted = formatDate(record.dateRegistration);
                    record.dateLastActivityFormatted = formatDate(record.dateLastActivity);
                    record.selected = false;
                    return record;
                }
            );
            this.setState({records: data});
        }.bind(this);
        request.send();
    }

    saveRecords() {
        const data = JSON.stringify(this.state.records);
        let request = new XMLHttpRequest();
        request.open("post", "/api/record", true);
        request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        request.send(data);
        console.log(data);
        showNotification("success", "Saved!")
    }

    deleteRecords() {
        let records = this.state.records.filter(
            (record) => {
                return !record.selected
            })
        this.setState({records: records});
        showNotification("default", "Deleted")
    }

    calculate() {
        let request = new XMLHttpRequest();
        request.open("get", "/api/rollingretention", true);
        request.onload = function () {
            let date = new Date();
            date.setDate(date.getDate() + 1);
            let counter = 0;
            let data = JSON.parse(request.responseText).map(
                (value) => {
                    date.setDate(date.getDate() - 1);
                    let d = new Date(date);
                    counter++;
                    return {x: counter, y: value * 100};
                }
            );
            this.setState({calculatedData: data});
            this.setState({isCalculated: true});
        }.bind(this);
        request.send();
        showNotification("info", "Calculated")
    }

    componentDidMount() {
        this.loadRecords();
    }

    render() {
        const selectRowProp = {
            mode: 'checkbox',
            clickToSelect: true,
            onSelect: this.handleRowSelect,
            onSelectAll: this.handleAllRowSelect
        };

        return (
            <div className="DateTable pt-5">
                <div className="TableContent pb-3">
                    <div className="card">
                        <div class="card-header">
                            Records
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <input type="submit" className="mr-2 btn btn-danger" value="Delete selected"
                                       onClick={this.deleteRecords}/>
                                <input type="submit" style={{float: "right"}} className="btn btn-dark" value="Calculate"
                                       onClick={this.calculate}/>
                                <input type="submit" style={{float: "right"}} className="mr-2 btn btn-success"
                                       value="Save" onClick={this.saveRecords}/>
                            </div>
                            <BootstrapTable data={this.state.records.sort(record => record.userId)}
                                 selectRow={selectRowProp} pagination>
                                <TableHeaderColumn isKey dataField="userId" width="20%">
                                    UserID
                                </TableHeaderColumn>
                                <TableHeaderColumn dataField="dateRegistrationFormatted" width="30%">
                                    Date Registration
                                </TableHeaderColumn>
                                <TableHeaderColumn dataField="dateLastActivityFormatted" width="30%">
                                    Date Last Activity
                                </TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
                <div className="TableManagement ml-3 pb-3">
                    <div className="card">
                        <div class="card-header">
                            Add new record
                        </div>
                        <div class="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="form-group">
                                    <label>UserID:</label>
                                    <input type="text" class="form-control" name="userId" placeholder="1, 2, 3..."
                                           value={this.state.userId} onChange={this.onChangeInput}/>
                                </div>
                                <div className="form-group">
                                    <label>Date Registration:</label>
                                    <input type="date" class="form-control" name="dateRegistration"
                                           value={this.state.dateRegistration} onChange={this.onChangeInput}/>
                                </div>
                                <div className="form-group">
                                    <label>Date Last Activity</label>
                                    <input type="date" class="form-control" name="dateLastActivity"
                                           value={this.state.dateLastActivity} onChange={this.onChangeInput}/>
                                </div>
                                <input type="submit" class="btn btn-primary" value="Add"/>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="Histogram pb-3">
                    <div className="card">
                        <div className="card-header">
                            Histogram
                        </div>
                        <div className="card-body" style={{margin: "0 auto"}}>
                            <Histogram isCalculated={this.state.isCalculated} data={this.state.calculatedData}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DateTable;
