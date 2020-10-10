import React from 'react'
import { TextField, Button } from '@material-ui/core';

import firebase from 'firebase/app';
require("firebase/firestore");

class SignUpForm extends React.Component {
    provinces = [
        { label: 'Bangkok', value: 1 },
        { label: 'Chonburi', value: 2 },
    ];

    categories = [
        { label: 'ซ่อมรถยนต์', value: 1 },
        { label: 'คาร์แคร์', value: 2 },
    ];

    constructor(props) {
        super(props);

        this.state = {
            businessName: 'WashEver',
            services: 'ล้างรถ เปลี่ยนถ่ายน้ำมันเครื่อง',
            address: 'ซ เรวดี',
            province: 2,
            phone: '0969151453',
            category: 2,
            email: 'm.angsawee@gmail.com',
            password: 'mchayapol',
            confirmPassword: 'mchayapol',
            ownerName: 'อังศวีร์ เหมาะเหม็ง',
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.password !== this.state.confirmPassword) {
            alert('Password confirmation must be the same');
            return false;
        }

        var state = this.state;
        var props = this.props;
        firebase.auth()
            .createUserWithEmailAndPassword(state.email, state.password)
            .then(function(res){
                var db = firebase.firestore();
                var newShop = db.collection('users').doc();
                newShop.set({
                    businessName: state.businessName,
                    services: state.services,
                    address: state.address,
                    province: state.province,
                    phone: state.phone,
                    category: state.category,
                    email: state.email,
                    ownerName: state.ownerName,
                }).then(()=>{
                    props.closeThisComponent();
                });
            }) 
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/weak-password') {
                  alert('The password is too weak.');
                } else {
                  alert(errorMessage);
                }
                console.log(error);
            });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const textField = {
            marginLeft: 10,
            marginRight: 10,
            width: '80%',
        };

        return (
            <form onSubmit={this.handleSubmit}>
                <legend>ลงทะเบียนร้านใหม่:</legend>
                <fieldset>
                    <TextField
                        name="businessName"
                        label="Business Name"
                        value={this.state.businessName}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        required
                        style={textField}
                    />

                    <TextField
                        name="services"
                        label="บริการ"
                        value={this.state.services}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        required
                        style={textField}
                    />

                    <TextField
                        name="address"
                        label="Address"
                        value={this.state.address}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        style={textField}
                    />

                    <TextField
                        name="provice"
                        select
                        label="Province"
                        style={textField}
                        value={this.state.province}
                        onChange={(event) => this.onChange(event)}
                        SelectProps={{
                            native: true,
                        }}

                        margin="normal"
                    >

                        {this.provinces.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>

                    <TextField
                        name="phone"
                        label="Phone"
                        style={textField}
                        value={this.state.phone}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                        type="phone"
                    />

                    <TextField
                        name="category"
                        select
                        label="Category"
                        style={textField}
                        value={this.state.category}
                        onChange={(event) => this.onChange(event)}
                        SelectProps={{
                            native: true,
                        }}

                        margin="normal"
                    >

                        {this.categories.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>

                    <TextField
                        name="ownerName"
                        label="Owner Name"
                        style={textField}
                        value={this.state.ownerName}
                        onChange={(event) => this.onChange(event)}
                        margin="normal"
                    />



                    <TextField
                        name="email"
                        label="E-mail"
                        style={textField}
                        value={this.state.email}
                        onChange={(event) => this.onChange(event)}
                        type="email"
                    />

                    <TextField
                        name="password"
                        label="Password"
                        style={textField}
                        value={this.state.password}
                        onChange={(event) => this.onChange(event)}
                        type="password"
                    />

                    <TextField
                        name="confirmPassword"
                        label="Confirm Password"
                        style={textField}
                        value={this.state.confirmPassword}
                        onChange={(event) => this.onChange(event)}
                        type="password"
                    />
                </fieldset>


                {/* <Upload /> */}
                {/* <input type="submit" value="Create" className="okbtn" /> */}
                <Button variant="contained" color="primary" type="submit">
                    Create Shop
                </Button>

                <Button variant="contained" color="secondary"
                    // onClick={() => { document.location.href = "/car/home" }}>
                    onClick={this.props.handleCancelSignUp}>
                    Cancel
                </Button>
            </form>
        )
    }
}

export default SignUpForm