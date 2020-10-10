import React from 'react';

import CarForm from './car-form.js';
import CarDetailCard from './car-detail-card.js';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
// import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import firebase from 'firebase/app';
import SalesHome from '../sales/index.js';

require("firebase/firestore");

class CarList extends React.Component {

    render() {
        const items = this.props.items;

        // console.log('items:', typeof items, items);
        if (items === undefined || items === null) {
            return (
                <div>No cars</div>
            )
        } else {
            const carList = items.map(carRef => {
                // console.log('carRef', carRef);
                let car = carRef.data()

                let carText = car.plateNumber + ' : ' + car.brand + ' ' + car.model;
                return (
                    <ListItem button key={carRef.id}
                        onClick={() => this.props.handleClick(carRef)}>
                        <ListItemAvatar>
                            <Avatar>
                                <WorkIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={carText} secondary={car.year} />

                    </ListItem>
                );
            });

            return (
                <List style={{ overflow: 'auto', maxHeight: '100vh' }}>
                    {carList}
                </List >
            );
        }
    }
}


class CarHome extends React.Component {
    searchBoxClasses = makeStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: 800
        },
        input: {
            marginLeft: 8,
            flex: 1
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            width: 1,
            height: 28,
            margin: 4,
        },
    });

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isEditing: false,
            isCreating: false,
            isServicing: false,
            showDeleteDialog: false,
            error: null,
            carList: [],
            orgCarList: [],
            //items: items,
            // currentCar: items[0]
            currentCar: null
        };
    }

    componentDidMount() {
        this.fetchCars();
    }

    fetchCars() {
        var db = firebase.firestore();
        db.collection("cars").get().then((snapshot) => {
            console.log(snapshot.docs)
            this.setState({
                carList: snapshot.docs,
                orgCarList: snapshot.docs,
                isLoading: false,
            })
        });


        return;
    }

    showCarDetail(carRef) {
        this.setState({
            currentCar: carRef
        });

        console.debug('showCarDetail: ', carRef)

    }

    confirmDeleteCar = (carRef) => {
        this.setState({
            showDeleteDialog: true,
        })
        this.carRefToDelete = carRef
    }

    deleteCar = () => {
        console.debug("DELETE CAR", this.carRefToDelete.id)

        console.debug(typeof this.carRefToDelete)
        console.debug(this.carRefToDelete)
        this.carRefToDelete.ref.delete()
            .then(() => {
                this.setState({
                    showDeleteDialog: false,
                    currentCar: null
                });
                this.fetchCars();
            })
            .catch(error => {
                console.error(error);   // TODO report error
                this.setState({ showDeleteDialog: false });
            });

    }

    editCar(status, shouldUpdateCar = false) {
        this.setState({
            isEditing: status
        });

        console.log('editCar:', shouldUpdateCar);
        if (shouldUpdateCar)
            this.fetchCars();
    }

    createCar(status, shouldUpdateCar) {
        this.setState({
            isCreating: status
        });

        console.log('createCar:', shouldUpdateCar);
        if (shouldUpdateCar)
            this.fetchCars();
    }

    onSearchKeywordChange(event) {
        // console.log(event);
        var pattern = event.target.value;
        // console.log(this.state.carList);
        var items = [];
        this.state.orgCarList.forEach((carRef) => {

            var car = carRef.data();
            var text = car.plateNumber + car.brand + car.model;
            text = text.replace(/ /g, '');
            // console.log('SEARCH', pattern, text, new RegExp(pattern, "i"), text.match(new RegExp(pattern, "i")));
            if (text.match(new RegExp(pattern, "i")) !== null)
                items.push(carRef);
            console.log('items', items);

        });

        this.setState({
            carList: items
        });
    }

    serviceThisCar(car) {
        // console.log('TODO service this car -- JUMP TO SERIVCE TAB', car);
        this.setState({
            isServicing: true
        });
    }

    render() {
        // const isLoading = this.state.isLoading;
        // const items = this.state.carList;
        // const error = this.state.error;
        if (this.state.isServicing) {
            return (
                <SalesHome
                    shop={this.props.shop}
                    car={this.state.currentCar}
                />
            );

        } else if (this.state.isEditing) {
            return (
                <CarForm
                    car={this.state.currentCar}
                    mode='edit'
                    closeThisComponent={(shouldUpdateCar) => this.editCar(false, shouldUpdateCar)}
                />
            );
        } else if (this.state.isCreating) {
            return (
                <CarForm
                    car={this.state.currentCar}
                    mode='create'
                    closeThisComponent={(shouldUpdateCar) => this.createCar(false, shouldUpdateCar)}
                />
            );
        } else {
            return (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={this.searchBoxClasses.root}>
                                <IconButton className={this.searchBoxClasses.iconButton} aria-label="Add Car"
                                    onClick={(event) => this.setState({ isCreating: true })}>
                                    <AddIcon />
                                </IconButton>
                                <InputBase className={this.searchBoxClasses.input} placeholder="Search ทะเบียนรถ ยี่ห้อ รุ่น ชื่อลูกค้า"
                                    onChange={(event) => this.onSearchKeywordChange(event)} />
                                <IconButton className={this.searchBoxClasses.iconButton} aria-label="Search">
                                    <SearchIcon />
                                </IconButton>
                                {/* <Divider className={this.searchBoxClasses.divider} /> // TODO can't make it vertical */}
                                <IconButton color="primary" className={this.searchBoxClasses.iconButton} aria-label="Directions">
                                    <DirectionsIcon />
                                </IconButton>

                                <Fab variant="extended" size="small" color="primary" aria-label="Add"
                                    onClick={(event) => this.setState({ isCreating: true })}>
                                    <AddIcon size="small" /> Add Car
                        </Fab>
                            </Paper>
                        </Grid>

                        <Grid item xs={6}>
                            <CarList
                                items={this.state.carList}
                                handleClick={(carRef) => this.showCarDetail(carRef)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {this.state.currentCar === null ? '' :
                                <CarDetailCard
                                    car={this.state.currentCar}
                                    handleServiceThisCar={() => this.serviceThisCar(this.state.currentCar)}
                                    handleChange={() => { this.fetchCars(); this.showCarDetail(null) }}
                                    handleEditClick={() => { this.editCar(true) }}
                                    handleDeleteClick={(carRef) => this.confirmDeleteCar(carRef)}
                                />
                            }
                        </Grid>
                    </Grid>
                    <Dialog
                        open={this.state.showDeleteDialog}
                        onClose={() => this.setState({ showDeleteDialog: false })}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure to delete {this.state.carPlateNumberToDelete}?
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary"
                                onClick={(event) => this.deleteCar()}
                            >
                                Delete
</Button>
                            <Button color="primary" autoFocus
                                onClick={() => this.setState({ open: false })} >
                                Cancel
</Button>
                        </DialogActions>
                    </Dialog>
                </>
            );
        }
    }
}

export default (CarHome)
