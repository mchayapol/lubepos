import React from 'react';
import { TextField, Button } from '@material-ui/core';

import firebase from 'firebase/app';
require("firebase/firestore");

export default class CustomerForm extends React.Component {
    isLoading = true;
    error = null;
    mode = this.props.mode; // create | edit
    edit = (this.mode === 'edit');
    create = (this.mode === 'create');


    constructor(props) {
        super(props);
        console.debug('CustomerForm:', this.props.customer);
        if (this.props.customer !== null) {
            var customer = this.props.customer.data();
            this.state = {
                // brandId: "",
                name: customer.name,
                phone: customer.phone,
                email: customer.email
            };
        } else {
            this.state = {
                name: '', phone: '', email: ''
            };
        }



        // this.handleFileUploadChange = this.handleFileUploadChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.car.plateNumber);
        event.preventDefault();
        var db = firebase.firestore();
        var theCustomer = this.create ? db.collection('customers').doc() : db.collection('customers').doc(this.props.customer.id)
        theCustomer.set({
            name: this.state.name,
            phone: this.state.phone,
            email: this.state.email,
        }).then(() => {
            this.props.closeThisComponent(true);
        });
    }

    onChange(e) {
        console.debug([e.target.name], e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }


    render() {

        const textField = {
            marginLeft: 10,
            marginRight: 10,
            width: 180,
        };

        let submitButtonLabel = this.edit ? 'Update Customer Info' : 'Create';
        return (
            <form onSubmit={this.handleSubmit}>
                <legend>General:</legend>
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
                        name="phone"
                        label="Phone"
                        value={this.state.phone}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        type="phone"
                        style={textField}
                    />

                    <TextField
                        name="email"
                        label="Email"
                        style={textField}
                        value={this.state.email}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        type="email"
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

