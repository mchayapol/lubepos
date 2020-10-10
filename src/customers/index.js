import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import WorkIcon from '@material-ui/icons/Work';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';


import CustomerDetailCard from './customer-detail-card.js';
import CarDetailCard from '../cars/car-detail-card.js';
import CustomerForm from './customer-form';

import SalesHome from '../sales/index.js';

import firebase from 'firebase/app';
require("firebase/firestore");

class CustomerList extends React.Component {

    render() {

        const items = this.props.items;
        // console.log('items:', typeof items, items);
        if (items === undefined || items === null) {
            return (
                <div>No customers</div>
            )
        } else {
            const customerList = items.map(ref => {
                let customer = ref.data();
                return (
                    <ListItem button key={ref.id}
                        onClick={() => this.props.handleClick(ref)}>
                        <ListItemAvatar>
                            <Avatar>
                                <WorkIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={customer.name} secondary={customer.phone} />

                    </ListItem>
                );
            });

            return (
                <List >
                    {customerList}
                </List >
            );
        }
    }
}

class CustomerHome extends React.Component {
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
            error: null,
            customerList: [],
            orgCustomerList: [],
            //items: items,
            // currentCar: items[0]
            currentCustomer: null,
            currentCar: null
        };
    }

    componentDidMount() {
        this.fetchCustomers();
    }

    onSearchKeywordChange = (event) => {
        // console.log(event);
        var value = event.target.value;
        // console.log(this.state.carList);
        var items = [];
        this.state.orgCustomerList.forEach((customerRef, index) => {
            let customer = customerRef.data();
            // console.log('Customer',customer);
            let text = "/" + customer.name + customer.phone + customer.email + "/i";

            // console.log(value, text, text.match(new RegExp(value, "i")));
            if (text.match(new RegExp(value, "i")))
                items.push(customerRef);
        });

        this.setState({
            customerList: items
        });
    }

    // list = [];
    showCustomerDetail(customer) {
        console.log('showCustomerDetail', customer);
        // Load his cars
        var list = [];
        var db = firebase.firestore();
        var carDb = db.collection('cars');
        var queryRef = carDb.where('ownerRef', '==', firebase.firestore().collection('customers').doc(customer.id));
        // let i = 0;
        queryRef.get().then((snapshot) => {
            snapshot.forEach((ref) => {
                console.log('home->car', ref.data());
                // i++;
                list.push(ref);
                // this.list.push({
                //     id: ref.id,
                //     car: ref.data
                // });
            });

            // this.list.length = i;
            console.log('home-->list', list);
            this.setState({
                currentCustomer: customer,
                currentCustomerCarList: list,
                currentCar: null,
            });
        });

    }

    showCarDetail(car) {
        // TODO show car detail card
        console.log('show car detail card', car);
        this.setState({ currentCar: car });
    }

    fetchCustomers() {
        var db = firebase.firestore();
        db.collection("customers").orderBy('name').get().then((snapshot) => {
            // console.log(snapshot.docs)
            this.setState({
                customerList: snapshot.docs,
                orgCustomerList: snapshot.docs,
                isLoading: false,
            })
        });
    }

    createCustomer(status, shouldUpdateCustomer) {
        this.setState({
            isCreating: status
        });

        console.log('createCustomer:', shouldUpdateCustomer);
        if (shouldUpdateCustomer)
            this.fetchCustomers();
    }

    editCustomer(status, shouldUpdateCustomer) {
        console.log('Edit Customer');
        this.setState({
            isEditing: status
        });

        if (shouldUpdateCustomer)
            this.fetchCustomers();
    }

    deleteCustomer(customerId) {
        var db = firebase.firestore();
        db.collection('customers').doc(customerId).delete().then(() => {
            this.fetchCustomers();
            this.setState({
                open: false,
                currentCustomer: null
            })
        });
        // TODO xxx move to the next available list
    }


    serviceThisCar(car) {
        console.log('TODO service this car -- JUMP TO SERIVCE TAB', car);
        this.setState({
            isServicing: true
        });
    }

    render() {
        if (this.state.isServicing) {
            return (
                <SalesHome
                    car={this.state.currentCar}
                />
            );

        } else if (this.state.isCreating) {
            return (
                <CustomerForm
                    customer={null}
                    mode='create'
                    closeThisComponent={(shouldUpdateCustomer) => this.createCustomer(false, shouldUpdateCustomer)}

                />

            );

        } else if (this.state.isEditing) {
            return (
                <CustomerForm
                    customer={this.state.currentCustomer}
                    mode='edit'
                    closeThisComponent={(shouldUpdateCustomer) => this.editCustomer(false, shouldUpdateCustomer)}
                />

            );

        } else {
            return (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={this.searchBoxClasses.root}>
                        <Fab variant="extended" size="small" color="primary" aria-label="Add"
                                onClick={(event) => this.setState({ isCreating: true })}>
                                <AddIcon size="small" /> Add Customer
                            </Fab>                            
                            {/* <IconButton className={this.searchBoxClasses.iconButton} aria-label="Add Customer"
                                onClick={(event) => this.setState({ isCreating: true })}>
                                <AddIcon />
                            </IconButton> */}
                            <IconButton className={this.searchBoxClasses.iconButton} aria-label="Search">
                                <SearchIcon />
                            </IconButton>

                            <InputBase className={this.searchBoxClasses.input} placeholder="Search ชื่อลูกค้า เบอร์โทร อีเมล"
                                onChange={(event) => this.onSearchKeywordChange(event)} />

                            {/* <Divider className={this.searchBoxClasses.divider} /> */}

                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                        <CustomerList
                            items={this.state.customerList}
                            handleClick={(customer) => this.showCustomerDetail(customer)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {this.state.currentCustomer === null ? '' :
                            <CustomerDetailCard
                                customer={this.state.currentCustomer}
                                customerCars={this.state.currentCustomerCarList}
                                customerCarsx={this.list}
                                handleClick={() => { this.fetchCustomers(); this.showCustomerDetail(null) }}
                                handleShowCarDetail={(car) => { this.showCarDetail(car) }}
                                handleEditClick={(shouldUpdateCustomer) => { this.editCustomer(true, shouldUpdateCustomer) }}
                                handleDeleteClick={(customerId) => this.deleteCustomer(customerId)}
                            />
                        }
                        {this.state.currentCar === null ? '' :
                            <CarDetailCard
                                car={this.state.currentCar}

                                handleChange={() => { this.fetchCars(); this.showCarDetail(null) }}
                                handleEditChange={() => { this.editCar(true) }}
                                handleServiceThisCar={() => this.serviceThisCar(this.state.currentCar)}
                                editable={false}
                            />
                        }
                    </Grid>
                </Grid>
            );
        }
    }
}

export default (CustomerHome)
