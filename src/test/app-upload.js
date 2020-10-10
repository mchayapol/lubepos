import React, { Component } from 'react'

import {DropzoneDialog} from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';
 


class TestUpload extends React.Component {
  // firebase = require('firebase');
  firebaseui = require('firebaseui');

  constructor(props) {
        super(props);
        this.state = {
            open: false,
            files: []
        };

        // Sign In
        ui.start('#firebaseui-auth-container', {
          signInOptions: [
            {
              provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
              signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
            }
          ],
          // Other config options...
        });

        // Is there an email link sign-in?
        if (ui.isPendingRedirect()) {
          ui.start('#firebaseui-auth-container', uiConfig);
        }
        
        // This can also be done via:
        if ((firebase.auth().isSignInWithEmailLink(window.location.href)) {
          ui.start('#firebaseui-auth-container', uiConfig);
        }
    }
 
    handleClose() {
        this.setState({
            open: false
        });
    }
 
    handleSave(files) {
        //Saving files to state for further use and closing Modal.
        this.setState({
            files: files, 
            open: false
        });
    }
 
    handleOpen() {
        this.setState({
            open: true,
        });
    }
 
    render() {
        return (
            <div>
                <Button onClick={this.handleOpen.bind(this)}>
                  Add Image
                </Button>
                <DropzoneDialog
                    open={this.state.open}
                    onSave={this.handleSave.bind(this)}
                    acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                    showPreviews={true}
                    maxFileSize={5000000}
                    onClose={this.handleClose.bind(this)}
                />
            </div>
        );
    }
}

export default TestUpload;