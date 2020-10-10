import React from 'react';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import LinearProgress from '@material-ui/core/LinearProgress';

import Grid from '@material-ui/core/Grid';


// import ReactDOM from 'react-dom';
import { TextField, Button } from '@material-ui/core';
import firebase from 'firebase/app';
require("firebase/firestore");
require("firebase/storage");


class CarForm extends React.Component {

    brands = [];
    owners = [];
    brandMap = {};
    isLoading = true;
    error = null;
    mode = this.props.mode; // create | edit
    edit = (this.mode === 'edit');
    create = (this.mode === 'create');

    

    constructor(props) {
        super(props);
        // console.log('CarForm:',this.props.car);

        this.colors = require('../colors.json').colors;
        this.brands = require('../car_brand_model.json').brands;
        this.brands.forEach((item, index) => {
            // console.log("Option >>> ", item.name);
            this.brandMap[item.name] = item;
        });

        this.images = [];

        var brandOptions = this.brands.map(brand => {
            // console.log('brandOptions', brand.name);
            return (
                <option key={brand.name} value={brand.name} >
                    {brand.name}
                </option>
            )
        });

        var car = null;
        if (this.edit) {
            var carRef = this.props.car;
            car = carRef.data();
        }

        let brand = car !== null ? car.brand : this.brands[0].name;


        // console.log(this.brands);
        let model = car !== null ? car.model : this.brandMap[brand].models[0];

        let modelOptions = this.brandMap[brand].models.map(model => {
            // console.log(">>>", model);
            return (
                <option value={model} key={model}>
                    {model}
                </option>
            );
        });



        this.state = {
            plateNumber: this.edit ? car.plateNumber : '',
            brand: brand,
            brandOptions: brandOptions,
            model: model,
            modelOptions: modelOptions,

            year: this.edit ? car.year : (new Date()).getFullYear(),
            color: this.edit ? ((car.color === '' || car.color === undefined) ? 'WHITE' : car.color) : 'WHITE',
            ownerId: this.edit ? car.ownerRef.id : '0',
            ownerName: '',
            ownerListOptions: [],
            imageFiles: [], // TODO will implement this later

            imageFilename: "",
            isUploading: false,
            progress: 0,
            imageUrl: this.edit ? car.imageUrl : ''

        };

        if (this.edit) {
            console.log('Editing:', this.state.brand, this.state.model);
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

    handleProgress = progress => this.setState({ progress });

    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
        this.error = error;
    };

    handleUploadSuccess = filename => {
        this.setState({ imageFilename: filename, progress: 100, isUploading: false });
        firebase
            .storage()
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then(url => {
                console.log('downloadUrl:', url);
                this.setState({ imageUrl: url });
            });
    };

    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.car.plateNumber);
        console.log('this.props.car', this.props.car);
        event.preventDefault();
        var db = firebase.firestore();
        var theCar = this.create ? db.collection('cars').doc() : db.collection('cars').doc(this.props.car.id)
        theCar.set({
            plateNumber: this.state.plateNumber,
            year: this.state.year,
            color: this.state.color,
            brand: this.state.brand,
            model: this.state.model,
            ownerRef: this.state.ownerId === 0 ? null : db.collection('customers').doc(this.state.ownerId),
            imageUrl: this.state.imageUrl
        }).then(() => {
            this.props.closeThisComponent(true);
        });
    }

    componentDidMount() {
        this.fetchBrands();
        this.fetchOwners();
    }

    fetchBrands() {
        // './car_brand_model.json'
    }

    fetchOwners() {
        var db = firebase.firestore();
        db.collection("customers").get().then((snapshot) => {
            this.owners = [{ id: 0, name: '-- Undisclosed --' }];
            snapshot.forEach(doc => {
                this.owners.push({
                    id: doc.id,
                    name: doc.get('name')
                });
            });


            this.isLoading = false;

            var ownerListOptions = this.owners.map(owner => {
                console.log('owners:', owner);
                return (
                    <option key={owner.id} value={owner.id} >
                        {owner.name}
                    </option>
                )
            });


            this.setState({
                ownerListOptions: ownerListOptions
            });
        });
    }

    updateModelList() {
        console.log('this.state.brand', this.state.brand);
        let model = this.brandMap[this.state.brand].models[0];

        let modelOptions = this.brandMap[this.state.brand].models.map(model => {
            console.log(">>>", model);
            return (
                <option value={model} key={model}>
                    {model}
                </option>
            );
        });
        this.setState({
            modelOptions: modelOptions,
            model: model
        });
    }

    onChange(e) {
        console.log([e.target.name], e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }

    handleOwnerChange(event) {
        this.setState({
            ownerId: event.target.value
        });
    }

    handleBrandChange(event) {
        this.setState({
            brand: event.target.value
        }, this.updateModelList);
    }

    handleModelChange(event) {
        this.setState({

            model: event.target.value

        });

    }

    closeThisComponent = (mode) => {
        // delete temp image

        if (mode === false && this.edit) {
            firebase.storage().refFromURL(this.state.imageUrl).delete()
                // firebase.storage().child("images/" + this.state.imageFilename).delete()
                .then(function () {
                    console.debug('Delete temp image')
                }).catch(function (error) {
                    console.error(error)
                });
        }

        this.props.closeThisComponent(mode);
    }

    render() {

        const textField = {
            marginLeft: 10,
            marginRight: 10,
            width: 180,
        };

        let submitButtonLabel = this.edit ? 'Update Car Info' : 'Create';
        return (
            <>


                <form onSubmit={this.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <legend>General:</legend>
                            <fieldset>
                                <TextField
                                    name="plateNumber"
                                    label="Plate Number"
                                    value={this.state.plateNumber}
                                    onChange={(event) => this.onChange(event)}
                                    margin="normal"
                                    required
                                    style={textField}
                                />

                                <TextField
                                    name="year"
                                    label="Year"
                                    value={this.state.year}
                                    onChange={(event) => this.onChange(event)}
                                    margin="normal"
                                    type="number"
                                    style={textField}
                                />
                                <TextField
                                    name="color"
                                    select
                                    label="Color"
                                    style={textField}
                                    value={this.state.color}
                                    onChange={(event) => this.onChange(event)}
                                    SelectProps={{
                                        native: true,
                                    }}

                                    margin="normal"
                                >

                                    {this.colors.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </TextField>

                                <TextField
                                    name="ownerId"
                                    select
                                    label="Owner"
                                    style={textField}
                                    value={this.state.ownerId}
                                    onChange={(event) => this.handleOwnerChange(event)}
                                    SelectProps={{
                                        native: true,
                                    }}

                                    margin="normal"
                                >
                                    {this.state.ownerListOptions}
                                </TextField>

                            </fieldset>
                            <fieldset>
                                <legend>Brand / Model: {this.state.brand} {this.state.model}</legend>

                                <TextField
                                    name="brand"
                                    select
                                    label="Brand"
                                    style={textField}
                                    value={this.state.brand}
                                    onChange={(event) => this.handleBrandChange(event)}
                                    SelectProps={{
                                        native: true,
                                    }}

                                    margin="normal"
                                >
                                    {this.state.brandOptions}
                                </TextField>

                                <TextField
                                    name="model"
                                    select
                                    label="Model"
                                    style={textField}
                                    value={this.state.model}

                                    onChange={(event) => this.handleModelChange(event)}

                                    SelectProps={{
                                        native: true,
                                    }}

                                    margin="normal"
                                    className="width: 200px"
                                >
                                    {this.state.modelOptions}
                                </TextField>


                            </fieldset>

                        </Grid>
                        <Grid item xs={4}>
                            {this.edit &&
                                <CustomUploadButton
                                    accept="image/*"
                                    name="imageFilename"
                                    randomizeFilename
                                    // filename={file => this.state.username + file.name.split('.')[1]; }
                                    storageRef={firebase.storage().ref("images")}
                                    onUploadStart={this.handleUploadStart}
                                    onUploadError={this.handleUploadError}
                                    onUploadSuccess={this.handleUploadSuccess}
                                    onProgress={this.handleProgress}
                                // style={{ backgroundColor: 'steelblue', color: 'white', padding: 5, borderRadius: 1 }}
                                // style={{ width: '100px', height: '100px' }}
                                >

                                    {!this.state.imageUrl && <img src="/static/img_placeholder.jpg" width="100%" alt=""/>}
                                    {this.state.imageUrl && <img src={this.state.imageUrl} width="100%" alt="" style={{borderStyle: 'dotted' }}/>}
                                </CustomUploadButton>
                            }
                            {this.state.isUploading && <LinearProgress color="secondary" variant="determinate" value={this.state.progress} />
                            }

                        </Grid>
                    </Grid>




                    {/* <Upload /> */}
                    {/* <input type="submit" value="Create" className="okbtn" /> */}
                    <Button variant="contained" color="primary" type="submit">
                        {submitButtonLabel}
                    </Button>

                    <Button variant="contained" color="secondary"
                        // onClick={() => { document.location.href = "/car/home" }}>
                        onClick={(event) => this.closeThisComponent(false)}>
                        Cancel
                </Button>
                </form>
            </>
        );
    }
}

export default (CarForm)