import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import TablePagination from '@material-ui/core/TablePagination';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Avatar from '@material-ui/core/Avatar';

class Students extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            page: 0,
            rowsPerPage: 25,
            studentsFilter: []
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.searchStudents = this.searchStudents.bind(this)
        this.filterStudentSearch = this.filterStudentSearch.bind(this)
    }
    componentDidMount() {
        let url = process.env.REACT_APP_BACKEND_URL + 'student/profiles';
        axios.defaults.withCredentials = true;
        axios.get(url)
            .then(response => {
                if (response.status === 200) {
                    response.data.map(student => {
                        if (student.image !== null) {
                            var imageStr = this.arrayBufferToBase64(student.image.data);
                            student.image = 'data:image/jpeg;base64,' + imageStr
                        }
                    })
                    this.setState({
                        students: response.data,
                        studentsFilter: response.data
                    })
                } else {
                    this.setState({
                        students: [],
                        studentsFilter: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    students: [],
                    studentsFilter: []
                })
            });
    }
    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };
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

    searchStudents = (event) => {
        this.setState({
            students: this.filterStudentSearch(this.state.studentsFilter, event.target.value)
        })
    }

    filterStudentSearch = (students, searchStr) => {
        searchStr = searchStr.toLowerCase();
        return students.filter(function (student) {
            return Object.keys(student).some(function (attribute) {
                if (attribute !== "education" && attribute !== "experience") {
                    if (student[attribute]) return student[attribute].toLowerCase().indexOf(searchStr) !== -1;
                }
            });
        });
    }

    render() {
        const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return (
            <div style={{ marginTop: "20px" }}>
                <div className="container" style={{ width: "85%", align: "center" }}>
                    <div style={{ alignContent: "center", marginBottom: "10px" }}><Paper component="form" style={{ padding: "2px 4px", display: "flex", alignItems: "center", width: "100%", alignContent: "center", border: "1px solid", borderRadius: "10px", backgroundColor: "" }}>
                        <InputBase
                            fullWidth
                            autofocus
                            margin="normal"
                            variant="outlined"
                            id="input-with-icon-adornment"
                            placeholder="Search Students by Name, School, Skills etc... "
                            inputProps={{ 'aria-label': 'search google maps' }}
                            label="Student Search"
                            style={{ width: "100%", height: "40px", paddingLeft: "20px", fontSize: "13px" }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon style={{ fontSize: "23px" }} />
                                </InputAdornment>
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={this.searchStudents}
                        />
                        <Divider orientation="vertical" />
                    </Paper></div>
                    {this.state.students.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(student => {
                        return (
                            <span style={{ alignContent: "right", padding: "0px" }} key={student.id}>
                                <Card style={{ padding: "0px", marginBottom: "7px", paddingBottom: "7px" }}>
                                    <div class="row" style={{ width: "100%", paddingLeft: "10px" }}>
                                        <div class="col-md-1" style={{ textAlign: "-webkit-center", float: "left", alignItems: "center", paddingRight: "0px", marginRight: "10px" }}>
                                            {student.image === null ? (
                                                <Avatar variant="circle" style={{ paddingRight: "0px", width: "50px", height: "50px", margin: "10px", backgroundColor: "brown" }}>
                                                    <b style={{ fontSize: "80" }}>{student.name.substring(0, 1)}</b>
                                                </Avatar>
                                            ) : (
                                                    <Avatar variant="circle" src={student.image} style={{ paddingRight: "0px", width: "50px", height: "50px", margin: "10px", border: "0.5px solid" }} />
                                                )}
                                        </div>
                                        <div class="col-md-9" style={{ textAlign: "-webkit-left", paddingTop: "10px", marginLeft: "0px" }}>
                                            <Typography gutterBottom variant="h5" style={{ marginBottom: "0px" }}>
                                                <Link to={'/students/' + student.id} style={{ color: "black" }}><b>{student.name.toUpperCase()}</b></Link>
                                            </Typography>
                                            <Typography variant="h6">
                                                {student.college}
                                            </Typography>
                                            <div className="row" >
                                                <div className="col-md-6">
                                                    <Typography variant="h6" style={{ verticalAlign: "center", marginBottom: "9px" }} style={{ fontWeight: "500" }}>
                                                        {student.education.length === 0 ? "" : student.education[0].degree + ", " + months[student.education[0].month_of_passing] + " '" +
                                                            (student.education[0].year_of_passing.toString()).substring(2, 4)}
                                                    </Typography>
                                                </div>
                                                <div className="col-md-6">
                                                    <Typography variant="h6" style={{ verticalAlign: "center", marginBottom: "9px" }} style={{ fontWeight: "500" }}>
                                                        {student.education.length === 0 ? "" : student.education[0].major}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <Typography variant="h6" style={{ verticalAlign: "center" }} style={{ fontWeight: "500" }}>
                                                {student.experience.length > 0 ? (
                                                    student.experience.map(experience => {
                                                        return (
                                                            <p style={{ marginBottom: "0px" }}><span class="glyphicon glyphicon-briefcase"></span> {experience.title} at {experience.company}</p>
                                                        )
                                                    })
                                                ) : (
                                                        <b />
                                                    )}
                                            </Typography>
                                            <Typography variant="h6">
                                                <AssignmentTurnedInIcon />Skills: {student.skills ? student.skills : " NA"}
                                            </Typography>
                                        </div>
                                    </div>
                                </Card>
                            </span>
                        );
                    })}
                    <TablePagination
                        rowsPerPageOptions={[25, 50]}
                        component="div"
                        count={this.state.students.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />

                </div>
            </div>
        )
    }
}

export default Students;