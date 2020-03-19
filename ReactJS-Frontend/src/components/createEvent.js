import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Redirect } from 'react-router';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Icon from '@material-ui/core/Icon';

class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.enableCreate = this.props.enableCreate;
        this.state = {
            name: "",
            location: "",
            description: "",
            date: "",
            time: "",
            eligibility: "",
            postEventError: false
        }
        this.handleCreateJobClose = this.handleCreateJobClose.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.locationChangeHandler = this.locationChangeHandler.bind(this);
        this.timeChangeHandler = this.timeChangeHandler.bind(this);
        this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
        this.eligibilityChangeHandler = this.eligibilityChangeHandler.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);

        this.addEvent = this.addEvent.bind(this);
        this.validateDetails = this.validateDetails.bind(this);
    }

    addEvent = (event) => {
        event.preventDefault();
        let url = process.env.REACT_APP_BACKEND_URL + 'company/' + sessionStorage.getItem("id") + '/events';
        var data = {
            "name": this.state.name,
            "date": this.state.date,
            "location": this.state.location,
            "time": this.state.time,
            "description": this.state.description,
            "eligibility": this.state.eligibility
        }
        axios.post(url, data)
            .then(response => {
                if (response.status === 200) {
                    this.handleCreateJobClose()
                    this.props.updateJobs()
                } else {
                    this.setState({
                        postEventError: true,
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    postEventError: true,
                })
            });
    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        })
    }
    locationChangeHandler = (event) => {
        this.setState({
            location: event.target.value
        })
    }
    timeChangeHandler = (event) => {
        this.setState({
            time: event.target.value
        })
    }
    descriptionChangeHandler = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    eligibilityChangeHandler = (event) => {
        this.setState({
            eligibility: event.target.value
        })
    }
    dateChangeHandler = (event) => {
        this.setState({
            date: event.target.value
        })
    }
    validateDetails = (event) => {
        if (this.state.name !== "" && this.state.location !== "" && this.state.time !== "" && this.state.description !== "" && this.state.eligibility !== "" && this.state.date !== "") return false
        else return true
    }

    handleCreateJobClose = () => {
        this.props.toggleCreate();
    }
    render() {
        return (
            <div>
                <Dialog fullWidth="120" open={this.enableCreate} onClose={this.handleCreateJobClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create New Event</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                required
                                onChange={this.nameChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="description"
                                label="Description"
                                type="description"
                                fullWidth
                                multiline
                                rows="3"
                                variant="outlined"
                                placeholder="Description"
                                required
                                onChange={this.descriptionChangeHandler}
                            />
                            <TextField
                                id="date"
                                label="Date"
                                type="date"
                                defaultValue={new Date().toISOString().slice(0, 10)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={this.dateChangeHandler}
                            />
                            <TextField
                                id="time"
                                label="Time"
                                type="time"
                                defaultValue="10:10"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    step: 1800,
                                }}
                                onChange={this.timeChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="location"
                                label="Location"
                                type="location"
                                fullWidth
                                variant="outlined"
                                required
                                onChange={this.locationChangeHandler}
                            />
                            <TextField
                                margin="dense"
                                id="eligibility"
                                label="Eligibility"
                                type="eligibility"
                                fullWidth
                                variant="outlined"
                                required
                                onChange={this.eligibilityChangeHandler}
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCreateJobClose} color="primary">
                            Close
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<Icon>send</Icon>}
                            onClick={this.addEvent}
                            disabled={this.validateDetails()}
                        >
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default CreateEvent;