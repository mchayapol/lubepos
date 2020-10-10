/*
*/
import React from 'react';

// import ReactDOM from 'react-dom';
import { TextField, Button } from '@material-ui/core';

import firebase from 'firebase/app';
require("firebase/firestore");

class ProductForm extends React.Component {
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
            var productRef = this.props.product;
            var product = productRef.data();
            this.state = {
                name: this.edit ? product.name : '',
                price: this.edit ? product.price : 0,
                brand: this.edit ? product.brand : '',
                // unit: // TODO
                amount: this.edit ? product.amount : 0,
                imageUrl: this.edit ? product.imageUrl : '',
                categoryRef: this.edit ? product.categoryRef : '0', // TODO
            };

        } else {
            this.state = {
                name: '',
                price: 0,
                brand: '',
                // unit: // TODO
                amount: 0,
                imageUrl: '',
                categoryRef: 0
            };
        }
        /*
        this.state = {
            name: this.edit ? product.name : '',
            price: this.edit ? product.price : 0,
            brand: this.edit ? product.brand : '',
            amount: this.edit ? product.amount : 0,
            imageUrl: this.edit ? product.imageUrl : '',
            categoryId: this.edit ? product.categoryId : '0',
        };
        */

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.car.plateNumber);
        console.log('this.props.product', this.props.product)
        event.preventDefault();
        var db = firebase.firestore();
        var productRef = this.create ? db.collection('products').doc() : db.collection('products').doc(this.props.product.id)
        productRef.set({
            name: this.state.name,
            price: parseFloat(this.state.price),
            //unit: // TODO
            brand: this.state.brand,
            amount: parseInt(this.state.amount),
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
/*
        let product = {
            name: this.state.name,
            price: this.state.price,
            brand: this.state.brand,
            amount: this.state.amount,
            imageUrl: this.state.imageUrl,
            // categoryId: this.state.categoryId,
        }

        // call API
        // TODO check credential https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        let method = this.create ? 'POST' : 'PUT';
        let url = 'http://localhost:8080/api/products' + (this.create ? '' : '/' + this.props.product._id);
        console.log('Fetching:', method, url);
        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .then(res => {
                console.log('Success:', JSON.stringify(res));
                if (this.create) {
                    this.props.closeThisComponent(true);
                } else {
                    this.props.closeThisComponent(res.data, true);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            })

        console.log("Saving ", JSON.stringify(product))
*/        
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

        let submitButtonLabel = this.edit ? 'Update Product Info' : 'Create';
        return (
            <form onSubmit={this.handleSubmit}>
                <legend>Product:</legend>
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
                        name="brand"
                        label="Brand"
                        value={this.state.brand}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
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

                    <TextField
                        name="amount"
                        label="Amount"
                        style={textField}
                        value={this.state.amount}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        type="number"
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

export default (ProductForm)