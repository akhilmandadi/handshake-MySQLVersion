import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import _ from "lodash";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

class ProfileCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            student: {},
            education: [],
            enableProfileSave: false,
            img: "",
            imageUploadModal: false,
            file: null
        }
        this.profileSaveHandler = this.profileSaveHandler.bind(this)
        this.enableProfileEdit = this.enableProfileEdit.bind(this)
        this.nameChangeHandler = this.nameChangeHandler.bind(this)
        this.enableApplyModal = this.enableApplyModal.bind(this)
        this.closeImageModal = this.closeImageModal.bind(this)
        this.uploadProfilePicture = this.uploadProfilePicture.bind(this)
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            name: nextProps.student.name,
            student: nextProps.student,
            education: nextProps.student.education,
            img: nextProps.student.image
        })
    }

    profileSaveHandler = (event) => {
        event.preventDefault();
        let url = 'http://localhost:8080/student/' + sessionStorage.getItem("id") + '/profile';
        axios.defaults.withCredentials = true;
        axios.put(url, {
            name: this.state.name
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        enableProfileSave: false
                    })
                } else {
                    this.setState({
                        enableProfileSave: true
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    enableProfileSave: true
                })
            });
    }

    enableProfileEdit = () => {
        this.setState({
            enableProfileSave: !this.state.enableProfileSave
        })
    }

    nameChangeHandler = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    closeImageModal = () => {
        this.setState({
            imageUploadModal: false
        })
    }

    enableApplyModal = () => {
        this.setState({
            imageUploadModal: !this.state.imageUploadModal
        })
    }

    onChange(e) {
        this.setState({ file: e.target.files[0] });
    }

    uploadProfilePicture = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', this.state.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post("http://localhost:8080/students/" + sessionStorage.getItem("id") + "/image", formData, config)
            .then((response) => {
                this.props.fetchStudentDetails();
                this.setState({
                    imageUploadModal: false,
                    file:null
                })
            }).catch((error) => {
            });
    }

    render() {
        let profileInfo = null;
        let name = "";
        if (this.state.name !== "") {
            name = this.state.name.split(" ")
            if (name.length > 1) name = name[0].substr(0, 1) + name[1].substr(0, 1)
            else name = name[0].substr(0, 1)
        }
        if (!this.state.enableProfileSave) {
            profileInfo = (
                <CardContent style={{ textAlign: "-webkit-right", paddingTop: "10px" }} >
                    <EditIcon className="editicon" color="primary" onClick={this.enableProfileEdit} style={{ textAlign: "-webkit-right", cursor: "pointer" }} />
                    <div style={{ textAlign: "-webkit-center" }}>
                        {this.state.student.image === null ? (
                            <Avatar className="changePhoto" title="Upload Profile Picture" onClick={this.enableApplyModal} variant="circle" style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                <h1>{name}</h1>
                            </Avatar>
                        ) : (
                                <Avatar className="changePhoto" title="Change Profile Picture" onClick={this.enableApplyModal} variant="circle" src={this.state.student.image} style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
                            )}
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h3>{this.state.name}</h3>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h4 style={{ display: "inline", paddingBottom: "90px" }}>
                            {this.props.student.college}
                        </h4>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h5 style={{}}>
                            {this.state.education.length > 0 ? this.state.education[0]["degree"] + ", " + this.state.education[0]["major"] : "-"}
                        </h5>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <h5 style={{}}>
                            {this.state.education.length > 0 ? this.state.education[0]["degree"] + " - GPA: " + this.state.education[0]["cgpa"] : "-"}
                        </h5>
                    </div>
                </CardContent>
            )
        } else {
            profileInfo = (
                <CardContent >
                    <div class="row" style={{ width: "100%", marginLeft: "0px" }}>
                        <form onSubmit={this.profileSaveHandler}>
                            <div style={{ textAlign: "-webkit-center" }}>
                                {this.state.student.image === null ? (
                                    <Avatar className="changePhoto" title="Upload Profile Picture" onClick={this.enableApplyModal} variant="circle" style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", backgroundColor: "brown" }}>
                                        <h1>{name}</h1>
                                    </Avatar>
                                ) : (
                                        <Avatar className="changePhoto" title="Change Profile Picture" onClick={this.enableApplyModal} variant="circle" src={this.state.student.image} style={{ cursor: "pointer", width: "110px", height: "110px", margin: "15px", border: "0.5px solid" }} />
                                    )}
                            </div>
                            <div class="col-md-12" style={{ marginBottom: "10px" }}>
                                <label for="name">Name</label>
                                <input required onChange={this.nameChangeHandler} value={this.state.name} type="text" class="form-control" id="name" aria-describedby="name" placeholder=""></input>
                            </div>
                            <div className="row" style={{ marginLeft: "0px", marginRight: "0px" }}>
                                <div class="col-md-6" style={{ textAlign: "-webkit-center", marginTop: "10px", paddingRight: "3px" }}>
                                    <button type="button" onClick={this.enableProfileEdit} style={{ backgroundColor: "rgba(0,0,0,.06)", width: "100%", color: "black" }} class="btn btn-secondary" >Cancel</button>
                                </div>
                                <div class="col-md-6" style={{ textAlign: "-webkit-center", marginTop: "10px", paddingLeft: "3px" }}>
                                    <button type="submit" style={{ backgroundColor: "#0d7f02", width: "100%" }} class="btn btn-success" >Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </CardContent>
            )
        }
        return (
            <div>
                <Card style={{ marginBottom: "15px", paddingBottom: "0px", paddingTop: "0px", marginTop: "0px" }}>
                    <Dialog style={{ minWidth: "400px" }} open={this.state.imageUploadModal} onClose={this.closeImageModal} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title"><h4>Edit Profile Picture</h4></DialogTitle>
                        <form onSubmit={this.uploadProfilePicture}>
                            <DialogContent>
                                <h5>Attach your Photo</h5>
                                <div class="form-group">
                                    <input type="file" class="form-control-file" name="image"
                                        id="exampleFormControlFile1" onChange={this.onChange} />
                                </div>

                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.closeImageModal} color="secondary">
                                    Cancel
                        </Button>
                                <button type="submit" class="btn btn-success" onClick={this.uploadProfilePicture}>Save</button>
                            </DialogActions>
                        </form>
                    </Dialog>
                    {profileInfo}
                </Card>
            </div >
        )
    }
}


export default ProfileCard;