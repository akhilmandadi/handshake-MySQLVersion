import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import moment from "moment"
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography'
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import _ from 'lodash';

class Experience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: "",
            title: "",
            location: "",
            year_of_starting: "",
            month_of_starting: "01",
            year_of_ending: "",
            month_of_ending: "10",
            description: "",
            experience: {},
            enableEdit: false,
            id: "",
            color: "white"
        }
        this.saveExperienceChanges = this.saveExperienceChanges.bind(this)
        this.enableEdit = this.enableEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteExperience = this.deleteExperience.bind(this)
        this.mouseInListener = this.mouseInListener.bind(this)
        this.mouseOutListener = this.mouseOutListener.bind(this)
    }

    componentDidMount() {
        this.setState({
            company: this.props.experience.company,
            title: this.props.experience.title,
            location: this.props.experience.location,
            year_of_starting: this.props.experience.year_of_starting,
            month_of_starting: this.props.experience.month_of_starting,
            year_of_ending: this.props.experience.year_of_ending,
            month_of_ending: this.props.experience.month_of_ending,
            description: this.props.experience.description,
            id: this.props.experience.id,
            experience: this.props.experience
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            company: nextProps.experience.company,
            title: nextProps.experience.title,
            location: nextProps.experience.location,
            year_of_starting: nextProps.experience.year_of_starting,
            month_of_starting: nextProps.experience.month_of_starting,
            year_of_ending: nextProps.experience.year_of_ending,
            month_of_ending: nextProps.experience.month_of_ending,
            description: nextProps.experience.description,
            id: nextProps.experience.id,
            experience: nextProps.experience
        })
    }

    saveExperienceChanges = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            company: this.state.company,
            title: this.state.title,
            location: this.state.location,
            year_of_starting: this.state.year_of_starting,
            month_of_starting: this.state.month_of_starting,
            year_of_ending: this.state.year_of_ending,
            month_of_ending: this.state.month_of_ending,
            description: this.state.description,
            id: this.state.id
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableEdit: false
                    })
                    this.props.fetchStudentDetails()
                }
            })
            .catch((error) => {
                this.setState({
                    enableEdit: true
                })
            });
    }

    deleteExperience = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile?entity=experience&id=' + this.state.id;
        axios.defaults.withCredentials = true;
        axios.delete(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableEdit: false
                    })
                    this.props.fetchStudentDetails()
                }
            })
            .catch((error) => {
                this.setState({
                    enableEdit: true
                })
            });
    }

    enableEdit = () => {
        this.setState({
            enableEdit: true
        })
    }

    cancelEdit = () => {
        this.setState({
            company: this.props.experience.company,
            title: this.props.experience.title,
            location: this.props.experience.location,
            year_of_starting: this.props.experience.year_of_starting,
            month_of_starting: this.props.experience.month_of_starting,
            year_of_ending: this.props.experience.year_of_ending,
            month_of_ending: this.props.experience.month_of_ending,
            description: this.props.experience.description,
            id: this.props.experience.id,
            experience: this.props.experience,
            enableEdit: false
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    mouseInListener = () => {
        this.setState({ color: "#3f51b5" })
    }

    mouseOutListener = () => {
        this.setState({ color: "white" })
    }

    render() {
        var starts = moment(this.state.year_of_starting + '-' + this.state.month_of_starting + '-01');
        var ends = moment(this.state.year_of_ending + '-' + this.state.month_of_ending + '-01');
        var expYears = moment.duration(ends.diff(starts))._data.years
        var expMonths = moment.duration(ends.diff(starts))._data.months + 2
        const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let educationDetails = null;
        if (!this.state.enableEdit) {
            educationDetails = (
                <div class="row" key={this.state.id} style={{ paddingLeft: "15px" }} onMouseEnter={this.mouseInListener} onMouseLeave={this.mouseOutListener}>
                    <div class="row" style={{ paddingLeft: "30px", marginBottom: "0px", cursor: "pointer" }} onClick={this.enableEdit}>
                        <div class="col-md-1" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                            <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                <h6><LaptopMacIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                            </Avatar>
                        </div>
                        <div class="col-md-8" style={{ marginLeft: "30px" }}>
                            <div class="row" style={{ paddingBottom: "5px" }}>
                                <Typography variant="h4" color="textPrimary">
                                    <h4 style={{ margin: "0px" }}> {this.state.title}</h4>
                                </Typography>
                            </div>
                            <div class="row">
                                <Typography variant="h6" color="inherit">
                                    {this.state.company}
                                </Typography>
                            </div>
                            <div class="row">
                                <Typography variant="h6" color="inherit" >
                                    {months[this.state.month_of_starting]}&nbsp;
                                            {this.state.year_of_starting} to&nbsp;
                                            {months[this.state.month_of_ending]}&nbsp;
                                            {this.state.year_of_ending}&nbsp;
                                            ({expYears === 0 ? expMonths + ' months' : expYears + ' year, ' + expMonths + ' months'})
                                </Typography>
                            </div>
                            <div class="row" >
                                <b></b><Typography style={{ display: "inline" }} variant="h6" color="inherit">
                                    {this.state.description}
                                </Typography>
                            </div>
                        </div>
                        <div class="col-md-1">
                            <EditIcon className="editicon" color={this.state.color} style={{ textAlign: "-webkit-right", cursor: "pointer", color: this.state.color }} />
                        </div>
                    </div>
                </div>
            )
        } else {
            educationDetails = (
                <div class="row" style={{ paddingLeft: "30px", marginBottom: "20px", marginTop: "0px" }}>
                    <form onSubmit={this.saveExperienceChanges}>
                        <div class="col-md-1" style={{ marginLeft: "15px", paddingRight: "0px", marginRight: "0px" }}>
                            <Avatar variant="square" style={{ width: "50px", height: "50px", backgroundColor: "white", color: "black", border: "2px solid", borderStyle: "groove" }}>
                                <h6><LaptopMacIcon style={{ fontSize: 35, color: "#2c347a" }} /></h6>
                            </Avatar>
                        </div>
                        <div class="col-md-10" style={{ marginLeft: "20px" }}>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label for="contactEmail">Job Title</label>
                                    <input required onChange={this.handleChange} value={this.state.title} type="text" class="form-control" name="title" id="title"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Employer</label>
                                    <input required onChange={this.handleChange} value={this.state.company} type="text" class="form-control" id="company" name="company"></input>
                                </div>
                            </div>
                            <div class="row" style={{ paddingRight: "40px" }}>
                                <div class="row" style={{ marginLeft: "15px" }}><label htmlFor="contactEmail">Time Period</label></div>
                                <div class="row" style={{ marginLeft: "0px" }}>
                                    <div className="col-md-6" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                        <label htmlFor="contactEmail">Start Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select required value={this.state.month_of_starting} id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_starting">
                                                <option selected value={"1"} id="1">January</option>
                                                <option value={"2"} id="2">February</option>
                                                <option value={"3"} id="3">March</option>
                                                <option value={"4"} id="4">April</option>
                                                <option value={"5"} id="5">May</option>
                                                <option value={"6"} id="6">June</option>
                                                <option value={"7"} id="7">July</option>
                                                <option value={"8"} id="8">August</option>
                                                <option value={"9"} id="9">September</option>
                                                <option value={"10"} id="10">October</option>
                                                <option value={"11"} id="11">November</option>
                                                <option value={"12"} id="12">December</option>
                                            </select>
                                            <input required style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.year_of_starting} type="number" class="form-control" id="year_of_starting" name="year_of_starting"></input>
                                        </div>
                                    </div>
                                    <div className="col-md-6" style={{ paddingLeft: "0px", marginLeft: "0px" }}>
                                        <label htmlFor="contactEmail">End Date: </label>
                                        <div class="form-inline" style={{ marginBottom: "10px" }}>
                                            <select required value={this.state.month_of_ending} id="inputState" class="form-control" style={{ width: "55%", marginRight: "5px" }} onChange={this.handleChange} name="month_of_ending">
                                                <option selected value={"1"} id="1">January</option>
                                                <option value={"2"} id="2">February</option>
                                                <option value={"3"} id="3">March</option>
                                                <option value={"4"} id="4">April</option>
                                                <option value={"5"} id="5">May</option>
                                                <option value={"6"} id="6">June</option>
                                                <option value={"7"} id="7">July</option>
                                                <option value={"8"} id="8">August</option>
                                                <option value={"9"} id="9">September</option>
                                                <option value={"10"} id="10">October</option>
                                                <option value={"11"} id="11">November</option>
                                                <option value={"12"} id="12">December</option>
                                            </select>
                                            <input required style={{ width: "35%", marginRight: "5px" }} onChange={this.handleChange} value={this.state.year_of_ending} type="number" class="form-control" id="year_of_ending" name="year_of_ending"></input>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Location</label>
                                    <input required onChange={this.handleChange} value={this.state.location} type="text" class="form-control" id="location" name="location"></input>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-11" style={{ marginBottom: "10px" }}>
                                    <label htmlFor="contactEmail">Description</label>
                                    <textarea
                                        class="form-control"
                                        id="description"
                                        rows="4"
                                        style={{ marginTop: "10px" }}
                                        onChange={this.handleChange}
                                        name="description"
                                        value={this.state.description}
                                    >
                                    </textarea>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-2" style={{ textAlign: "-webkit-left", marginTop: "10px", marginRight: "30px" }}>
                                    <button type="button" onClick={this.deleteExperience} style={{ backgroundColor: "#d6242a", color: "white" }} class="btn btn-secondary" >Delete</button>
                                </div>
                                <div class="col-md-8" style={{ textAlign: "-webkit-right", marginTop: "10px", marginRight: "30px" }}>
                                    <button type="button" onClick={this.cancelEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", color: "black" }} class="btn btn-secondary" >Cancel</button>
                                    <button type="submit" style={{ backgroundColor: "#0d7f02", marginLeft: "5px" }} class="btn btn-success">Save</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )
        }
        return (
            <div style={{}}>
                <div style={{ paddingBottom: "10px", paddingTop: "0px", marginTop: "0px", paddingLeft: "5px" }}>
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        {educationDetails}
                    </div>
                </div>
            </div >
        )
    }
}

export default Experience;