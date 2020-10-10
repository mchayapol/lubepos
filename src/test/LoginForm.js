import React, { useState, useEffect } from 'react'
// import clsx from 'clsx';

import 'firebase/auth'
import firebase from '../firebase'
import { TextField, Button, Box } from '@material-ui/core';

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://www.theone-techlead.com/">
        The One Techlead
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  );
}




const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    // backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundImage: 'url(https://source.unsplash.com/collection/3840400/cars)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  banner: {
    // position: 'absolute',
    // top: '20px',
    // left: '20px',
    width: '100%',
    opacity: '0.8',
    backgroundColor: '#343434',
    color: 'white',
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function LoginForm(props) {
  const classes = useStyles();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState();
  const [rememberMe, setRememberMe] = useState(false);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    var auth = firebase.auth();
    auth.onAuthStateChanged(user => {
      if (user) {
        props.handleSuccessSignIn(user)
        // this.setState({
        //   currentUser: user
        // })
      }
    })
  });

  function handleSubmit(e) {
    e.preventDefault()

    // console.log('Remember Me?',rememberMe);
    var auth = firebase.auth();
    let persistence = (rememberMe) ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    auth.setPersistence(persistence)
      .then(function () {
        console.log('Proceed with Sign in with email and password');
        auth
          .signInWithEmailAndPassword(email, password)
          .then(response => props.handleSuccessSignIn(response.user))
          .catch(error => {
            setMessage(error.message);
          })
      })
      .catch(function (error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        setMessage(error.message);
      });

  }

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} >
        <div className={classes.banner}>
          <p style={{ fontSize: '20px' }}>The1 AUTO POS</p>
          <p>ระบบหน้าร้านสำหรับธุรกิจรถยนต์</p>
        </div>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" checked={rememberMe} />}
              label="Remember me"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}


