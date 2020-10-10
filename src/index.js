import React from 'react';

import ReactDOM from 'react-dom';
// import './index.css';
import HomePageV1 from './home1.js';
import LoginForm from './test/LoginForm.js';
import SignUpForm from './signup/index.js'
// import TestTable from './test/TestTable.js';
import { Grid } from '@material-ui/core';


import firebase from 'firebase/app'
// const firebaseConfig = require('./config.js');

class App extends React.Component {
    DEBUG_MODE = false;

    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            isLoggedIn: false,    // DEBUG
            isSigningUp: false,      // DEBUG
        };
        var thisComponent = this;
        var auth = firebase.auth();
        /*
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function () {
                // READ https://firebase.google.com/docs/auth/web/auth-state-persistence
                // auth
                //     .signInWithEmailAndPassword("mchayapol@gmail.com", "w,jvpkd8")
                //     .then(response => this.handleSuccessSignIn(response.user))
                //     .catch(error => {
                //         thisComponent.setState({
                //             message: error.message
                //         })
                //     })

            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
            });

        if (this.DEBUG_MODE) {
            var auth = firebase.auth();
            auth
                .signInWithEmailAndPassword("mchayapol@gmail.com", "w,jvpkd8")
                .then(response => this.handleSuccessSignIn(response.user))
                .catch(error => {
                    this.setState({
                        message: error.message
                    })
                })
        }

*/

        // bind 'this' with this App component, otherwise this.setState will not work
        this.handleSignOut = this.handleSignOut.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleCancelSignUp = this.handleCancelSignUp.bind(this);
        this.closeSignUpForm = this.closeSignUpForm.bind(this);


    }

    handleSignUp() {
        this.setState({
            isSigningUp: true
        });
    }

    handleCancelSignUp() {
        this.setState({
            isSigningUp: false
        });
    }

    closeSignUpForm() {
        this.setState({
            isSigningUp: false
        });
    }

    handleSignOut() {
        // e.preventDefault();
        var auth = firebase.auth();
        auth.signOut().then(response => {
            this.setState({
                currentUser: null,
                isLoggedIn: false
            })
        })
        console.log('handleSignout', this.state.isLoggedIn, this.state.currentUser);

    }


    handleSuccessSignIn(user) {
        var thisComponent = this;
        var db = firebase.firestore();
        var userDetails = db.collection('users').where("email", "==", user.email);
        userDetails.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                thisComponent.setState({
                    currentUser: user,
                    shop: doc,
                    isLoggedIn: true
                });
                console.log('shop:', doc.data());
                console.log('user:', user);
            });
        });

    }

    render() {
        // TEST
        // return (<TestTable />)

        if (this.state.isSigningUp) {
            return (
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <img src="/static/theone-logo.jpg" alt="" />
                    </Grid>
                    <Grid item xs={10} sm container>

                    </Grid>
                </Grid>
            )
        }
        if (this.state.isLoggedIn) {
            return (
                <>
                    <HomePageV1
                        shop={this.state.shop}
                        handleSignout={(e) => this.handleSignOut(e)}
                    />
                </>
            );
        } else {
            return (
                <>
                            <LoginForm
                                handleSuccessSignIn={(user) => this.handleSuccessSignIn(user)}
                                handleSignOut={this.handleSignOut}
                                handleSignUp={this.handleSignUp}
                            />

                </>
            );
        }
    }
}
// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
