// import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import CarHome from './cars/index.js';
import SalesHome from './sales/index.js';
import CustomerHome from './customers/index.js';
import ProductHome from './products/index.js';


function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },

}));

function HomePageV1(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0); // default for testing

  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  // function handleChange(event) {
  //   setAuth(event.target.checked);
  // }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  var shop = props.shop.data();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <div><b>{shop.businessName}</b></div>
          <Tabs value={value} onChange={handleChange}>
          <Tab label="Sales" />
            <Tab label="Cars" />
            <Tab label="Customers" />
            <Tab label="Products/Services" />
            {/* <Tab label="Services" /> */}
            <Tab label="Settings" />
          </Tabs>
          <div>

            <IconButton
              aria-label="Account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"              
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem >{shop.ownerName}</MenuItem>
              {/* TODO Divider */}
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={(e) => props.handleSignout(e)}>Sign Out</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      {value === 0 && <TabContainer><SalesHome shop={props.shop}/></TabContainer>}      
      {value === 1 && <TabContainer><CarHome /></TabContainer>}
      {value === 2 && <TabContainer><CustomerHome /></TabContainer>}
      {value === 3 && <TabContainer><ProductHome /></TabContainer>}
      {value === 4 && <TabContainer>Settings</TabContainer>}
    </div>
  );
}

export default HomePageV1;
