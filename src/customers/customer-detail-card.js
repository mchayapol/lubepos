import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import ShareIcon from '@material-ui/icons/Share';
// import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';

import MoreVertIcon from '@material-ui/icons/MoreVert';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import firebase from 'firebase/app';
require("firebase/firestore");

class CustomerDetailCard extends React.Component {
    prevCustomerId = '';
    classes = makeStyles(theme => ({
        card: {
            // maxWidth: 320,
            width: 320,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        avatar: {
            backgroundColor: red[500],
        },
    }))

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            // carList: []
        }

    }


    handleDeleteXXX(customerId) {
        var db = firebase.firestore();
        db.collection('customers').doc(customerId).delete().then(() => this.props.handleClick());
        return; 
    }


    render() {
        const customerId = this.props.customer.id;
        const customer = this.props.customer.data();

        // console.log('detailCard.render():',customer);
        if (customerId !== this.prevCustomerId) {
            this.prevCustomerId = customerId;
        }

        // var list = []
        var carRefList = this.props.customerCars;
        console.log('carRefList',carRefList)
        console.log(customer.name, carRefList.length, ':', carRefList)
        const list = carRefList.map((carRef) => {
        // carRefList.forEach(ref => {            
            var car = carRef.data();
            console.log('card------>car', car);
            return (
                <ListItem button key={carRef.id}
                    onClick={() => this.props.handleShowCarDetail(carRef)}>
                    <ListItemText primary={car.plateNumber + ' ' + car.brand + ' ' + car.model} />
                </ListItem>
            );
        });

        if (customer === undefined || customer === null) {
            return (
                <div>
                    Preview car details
                </div>
            );
        } else {
            return (
                <div>
                    <Card className={this.classes.card}>
                        <CardHeader
                            avatar={
                                <Avatar aria-label="Recipe" className={this.classes.avatar}>
                                    {customer.name[0]}
                                </Avatar>
                            }
                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={customer.name}
                            subheader={customer.phone}
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
                                Email: {customer.email}<br />
                                Cars:
                            </Typography>
                            <List>
                                {list}
                            </List>
                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="Edit"
                                onClick={(event) => this.props.handleEditClick()}>

                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="Delete"
                                onClick={(event) => this.setState({ open: true })}>
                                <DeleteIcon />
                            </IconButton>
                        </CardActions>
                    </Card>

                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure to delete {customer.plateNumber}?
  </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary"
                                onClick={() => {this.props.handleDeleteClick(customerId); this.setState({ open: false })}}>
                                Delete
  </Button>
                            <Button color="primary" autoFocus
                                onClick={() => this.setState({ open: false })} >
                                Cancel
  </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }
    }
}

export default CustomerDetailCard;
