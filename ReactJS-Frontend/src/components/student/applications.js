import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import '../../App.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import moment from 'moment';
import TablePagination from '@material-ui/core/TablePagination';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import TextField from '@material-ui/core/TextField';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import StudentNavBar from "./studentNavBar"

class StudentApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applications: [],
            page: 0,
            rowsPerPage: 25,
            applicationsFilter: [],
            Applied: false,
            Pending: false,
            Reviewed: false,
            Declined: false
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.searchApplications = this.searchApplications.bind(this)
        this.filterApplicationSearch = this.filterApplicationSearch.bind(this)
        this.searchApplicationsByStatus = this.searchApplicationsByStatus.bind(this)
        this.filterApplicationSearchByStatus = this.filterApplicationSearchByStatus.bind(this)
        this.handleFilterChange = this.handleFilterChange.bind(this)
    }
    componentDidMount() {
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + "/applications";
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        applications: response.data,
                        applicationsFilter: response.data
                    })
                } else {
                    this.setState({
                        applications: [],
                        applicationsFilter: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    applications: [],
                    applicationsFilter: []
                })
            });
    }
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        })
    };

    handleChangeRowsPerPage = event => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0
        })
    };

    searchApplications = (event) => {
        this.setState({
            applications: this.filterApplicationSearch(this.state.applicationsFilter, event.target.value)
        })
    }

    filterApplicationSearch = (applications, searchStr) => {
        searchStr = searchStr.toLowerCase();
        return applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (student[attribute]) return student[attribute].toLowerCase().indexOf(searchStr) !== -1;
            });
        });
    }

    searchApplicationsByStatus = async () => {
        let newData = await this.filterApplicationSearchByStatus(this.state.applicationsFilter)
        this.setState({
            applications: newData
        })
    }

    filterApplicationSearchByStatus = async (applications) => {
        if (this.state.Applied === false && this.state.Pending === false && this.state.Reviewed === false && this.state.Declined === false) {
            return applications
        }
        const isApplied = this.state.Applied;
        const isPending = this.state.Pending;
        const isReviewed = this.state.Reviewed;
        const isDeclined = this.state.Declined;
        const appliedApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isApplied === true) return student[attribute].toLowerCase().indexOf("applied") !== -1;
            });
        });
        const pendingApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isPending === true) return student[attribute].toLowerCase().indexOf("pending") !== -1;
            });
        });
        const reviewApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isReviewed === true) return student[attribute].toLowerCase().indexOf("reviewed") !== -1;
            });
        });
        const declinedApps = applications.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute === "status" && isDeclined === true) return student[attribute].toLowerCase().indexOf("declined") !== -1;
            });
        });
        return [...appliedApps, ...pendingApps, ...declinedApps, ...reviewApps]
    }

    handleFilterChange = (value) => {
        if (value === 'Applied') this.setState({ Applied: !this.state.Applied, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Pending') this.setState({ Pending: !this.state.Pending, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Reviewed') this.setState({ Reviewed: !this.state.Reviewed, }, () => { this.searchApplicationsByStatus() })
        if (value === 'Declined') this.setState({ Declined: !this.state.Declined, }, () => { this.searchApplicationsByStatus() })
    }

    render() {
        let errorBanner = null;
        if (this.state.applications.length === 0) {
            errorBanner = (
                <Card style={{ padding: "0px", margin: "7px" }}>
                    <CardContent style={{ padding: "5px" }}>
                        <b>No Applications Found</b>
                    </CardContent >
                </Card >
            )
        }
        return (
            <div><StudentNavBar tab="jobs" /><br />
                <div className="container" style={{ width: "90%", height: "100%" }}>
                    <Grid container spacing={3}>
                        <div style={{ alignContent: "center", width: "20%", marginRight: "20px", paddingBottom: "10px" }}>
                            <Card style={{ height: "100%" }}>
                                <CardContent>
                                    <b>Search Applications</b><br />
                                    <TextField
                                        id="outlined-basic"
                                        label="Search by Keyword"
                                        variant="outlined"
                                        onChange={this.searchApplications}
                                        style={{ width: "100%", marginTop: "4px" }}
                                    /><br /><br />
                                    <Divider />
                                    <div style={{ marginTop: "10px" }}><b>Application Status</b></div>
                                    <FormControl component="fieldset" >
                                        <FormGroup >
                                            <FormControlLabel
                                                control={<Checkbox checked={this.state.Applied} onChange={() => this.handleFilterChange("Applied")} value="Applied" />}
                                                label="Applied"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={this.state.Pending} onChange={() => this.handleFilterChange("Pending")} value="Pending" />}
                                                label="Pending"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={this.state.Reviewed} onChange={() => this.handleFilterChange("Reviewed")} value="Reviewed" color="primary" />}
                                                label="Reviewed"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={this.state.Declined} onChange={() => this.handleFilterChange("Declined")} value="Declined" color="primary" />}
                                                label="Declined"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </CardContent>
                            </Card >
                        </div>
                        <div style={{ width: "75%" }}>
                            {this.state.applications.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(application => {
                                return (
                                    <span style={{ alignContent: "right", padding: "0px" }} key={application.id}>
                                        <Card style={{ padding: "0px", marginBottom: "7px" }}>
                                            <div style={{ width: "15%", float: "left", height: "100%", alignItems: "center", overflow: "hidden" }}>
                                                <Avatar variant="square" style={{ width: "80px", height: "80px", margin: "10px", backgroundColor: "orange" }}>
                                                    <b style={{ fontSize: "80" }}>{application.name}</b>
                                                </Avatar>
                                            </div>
                                            <div style={{ width: "85%", height: "100%", overflowX: "float" }}>
                                                <CardContent style={{ paddingBottom: "5px" }}>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        <b>{application.title.toUpperCase()}</b>
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                        {application.name}
                                                    </Typography>
                                                    <Typography color="textSecondary" style={{ verticalAlign: "center" }}>
                                                        <InfoIcon /> Status: {application.status}
                                                    </Typography>
                                                    <Typography color="textSecondary">
                                                        <CheckIcon />Applied {moment(application.applied_on).format("MMMM Do")} - Applications close {moment(application.deadline).format("MMMM Do")}
                                                    </Typography>
                                                </CardContent></div>
                                        </Card>
                                    </span>
                                );
                            })}
                            <div style={{ textAlign: "center" }}><br />{errorBanner}</div>
                            <TablePagination
                                rowsPerPageOptions={[25, 50]}
                                component="div"
                                count={this.state.applications.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </div>
                    </Grid>
                </div ></div>
        )
    }
}

export default StudentApplications;