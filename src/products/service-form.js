/*
*/
import React from 'react';

// import ReactDOM from 'react-dom';
import { TextField, Button } from '@material-ui/core';

import firebase from 'firebase/app';
require("firebase/firestore");

class ServiceForm extends React.Component {
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


        if (this.edit) {
            var serviceRef = this.props.service;
            console.log('serviceRef',serviceRef)
            var service = serviceRef.data();
            this.state = {
                name: this.edit ? service.name : '',
                price: this.edit ? service.price : 0,
                imageUrl: this.edit ? service.imageUrl : '',
                categoryRef: this.edit ? service.categoryRef : '0', // TODO
            };

        } else {
            this.state = {
                name: '',
                price: 0,
                imageUrl: '',
                categoryRef: 0
            };
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.car.plateNumber);
        event.preventDefault();
        var db = firebase.firestore();
        var serviceRef = this.create ? db.collection('services').doc() : db.collection('services').doc(this.props.service.id)
        serviceRef.set({
            name: this.state.name,
            price: this.state.price,
            imageUrl: this.state.imageUrl,
        }).then((snap) => {
            if (this.create) {
                this.props.closeThisComponent(true);
            } else {
                console.log('snap', snap)
                this.props.closeThisComponent(snap, true);
            }
        });
        return;


    }


    onChange(e) {
        console.log([e.target.name], e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {

        const textField = {
            marginLeft: 10,
            marginRight: 10,
            width: 180,
        };

        let submitButtonLabel = this.edit ? 'Update service Info' : 'Create';
        return (
            <form onSubmit={this.handleSubmit}>
                <legend>Service:</legend>
                <fieldset>
                    <TextField
                        name="name"
                        label="Name"
                        value={this.state.name}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        required
                        style={textField}
                    />


                    <TextField
                        name="price"
                        label="Price"
                        value={this.state.price}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        type="number"
                        style={textField}
                        required
                    />



                </fieldset>
                <Button variant="contained" color="primary" type="submit">
                    {submitButtonLabel}
                </Button>
                {/* TODO going back to the page isn't cool! */}
                <Button variant="contained" color="secondary"
                    // onClick={() => { document.location.href = "/car/home" }}>
                    onClick={(event) => this.props.closeThisComponent(false)}>
                    Cancel
                </Button>
            </form>
        );
    }
}

export default (ServiceForm)