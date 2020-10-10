import React from 'react';
import clsx from 'clsx';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
    // Container, Collapse, List, ListItem, ListItemIcon, ListItemText,
    TextField, FormControlLabel, Checkbox
} from '@material-ui/core';
import { ArrowDownward, ArrowUpward, Delete
    // ExpandLess, ExpandMore, StarBorder 
} from '@material-ui/icons';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Button from '@material-ui/core/Button';
// import InputBase from '@material-ui/core/InputBase';
// import IconButton from '@material-ui/core/IconButton';
// import SearchIcon from '@material-ui/icons/Search';
// import DirectionsIcon from '@material-ui/icons/Directions';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import ProductList from '../products/product-list.js'
// import SalesList from './sales-list.js'

import firebase from 'firebase/app';
require("firebase/firestore");

class SalesHome extends React.Component {



    undisclosedCustomer = {
        name: '-- Undisclosed --',
        phone: '',
        email: ''
    };

    constructor(props) {
        super(props);

        // if (!this.props.car) {
        //     throw new Error("Sales.props.car is required.");
        // }

        this.state = {
            // salesList: [],
            // currentProduct: null,
            // currentService: null,
            productList: [],
            serviceList: [],
            totalPrice: 0,
            vat: 0,
            car: this.props.car ? this.props.car : null,
            customer: this.undisclosedCustomer
            // isEditingProduct: false,
            // isCreatingProduct: false,
            // isEditingService: false,
            // isCreatingService: false
        };

        this.salesList = [];
        this.handleItemDoubleClick = this.handleItemDoubleClick.bind(this);
    }


    componentDidMount() {
        this.fetchProducts();
        this.fetchServices();
        if (this.props.car)
            this.fetchCustomer(this.props.car.data().ownerRef);
    }

    fetchCustomer(ownerRef) {
        console.log('fetchCustomer', ownerRef);


        if (ownerRef === undefined || ownerRef === 0) {
            this.setState({
                customer: this.undisclosedCustomer
            });
            return;
        }

        console.log('-----');
        ownerRef.get().then((snap) => {
            console.log('snap', snap);

            // :: Orphan car ::
            // This could happen when a owner (customer) of this car is deleted.
            // car.ownerRef still has value of deleted customer.id
            // TODO should we delete the car.ownerRef for this car?
            if (!snap.exists) {
                // let removeCurrentUserId = docRef.update({
                //     currentUserId: firebase.firestore.FieldValue.delete()
                // });

                this.setState({
                    customer: this.undisclosedCustomer
                });
            } else {
                this.setState({
                    customer: {
                        name: snap.data().name,
                        phone: snap.data().phone,
                        email: snap.data().email
                    }
                });
            }
        });
    }

    fetchServices() {
        var db = firebase.firestore();
        db.collection("services").orderBy('name').get().then((snapshot) => {
            this.setState({
                serviceList: snapshot.docs
            });
        });

        return;
    }

    fetchProducts() {
        var db = firebase.firestore();
        db.collection("products").orderBy('name').get().then((snapshot) => {
            this.setState({
                productList: snapshot.docs
            });
        });


        return;

    }

    updateTotalPrice() {
        let totalPrice = 0;
        this.salesList.forEach((item, index) => {
            totalPrice += item.amount * item.price;
        });
        this.setState({
            totalPrice: totalPrice,
            vat: totalPrice / 107 * 7
        });
    }

    handleItemChange(e, item) {
        console.log(e.target.name, e.target.value);
        item[e.target.name] = e.target.value;
        console.log(item);
        this.updateTotalPrice();
    }


    handleDoVAT(e) {
        this.setState({
            doVAT: e.target.checked
        });
    };

    handleSave = (e) => {
        console.log('this.props.shop',this.props.shop)
        let salesRecord = {
            car: this.state.car,
            customer: this.state.customer,
            items: this.salesList,
            totalPrice: this.state.totalPrice,
            vat: this.state.vat,
            shopRef: db.collection('users').doc(this.props.shop.id)
            
        };

        // Save to firebase
        var db = firebase.firestore();
        var salesRef = db.collection('sales').doc();
        salesRef.set(salesRecord).then(() => {
            // this.props.closeThisComponent(true);
            console.log("Saved",salesRef.id);
        });

    }

    handleDeleteItem = (itemRef) => {
        // console.log('Delete',itemRef);
        for(let i=0; i<this.salesList.length; i++) {
            let item = this.salesList[i];
            if (item.id === itemRef.id) {
                this.salesList.splice(i,1);
                break;
            }
        }
        this.updateTotalPrice();        
    }

    findItem(itemRef) {
        for(let i=0; i<this.salesList.length; i++) {
            let item = this.salesList[i];
            if (item.id === itemRef.id) {
                return i;
            }
        }
        return -1;
    }

    handleMoveDown = (itemRef) => {
        let i = this.findItem(itemRef);
        let a = this.salesList[i];
        this.salesList[i] = this.salesList[i+1];
        this.salesList[i+1] = a;
        this.forceUpdate();
    }

    handleMoveUp = (itemRef) => {
        let i = this.findItem(itemRef);
        let a = this.salesList[i];
        this.salesList[i] = this.salesList[i-1];
        this.salesList[i-1] = a;
        this.forceUpdate();
    }

    handleItemDoubleClick(newItemRef) {
        // Move product to sales list
        // console.log('handleProductDoubleClick-----------');
        // console.log('\tproduct',product);

        // Only push when it's new to the list
        // We have to use Array because the sequence matter, althought map is quicker to check.
        for (let i = 0; i < this.salesList.length; i++) {
            let item = this.salesList[i];
            // console.log(product.id, item.id,product.id === item.id)
            if (newItemRef.id === item.id) {
                return;
            }
        }

        // can't push the entire Firebase object, we need to work on it later.
        var data = newItemRef.data();
        var item = {
            id: newItemRef.id,
            brand: data.brand,
            name: data.name,
            price: data.price,
            amount: 1,

        };
        this.salesList.push(item);
        this.updateTotalPrice();
        // console.log('\tsalesList', this.salesList);
        // this.forceUpdate()
        // return;

    }
    /*
        showProductDetail(product) {
            console.log(product);
            this.setState({
                currentProduct: product,
                currentService: null,
                isEditingProduct: false,
                isCreatingProduct: false,
                isEditingService: false,
                isCreatingService: false
            });
        }
    
        showServiceDetail(service) {
            this.setState({
                currentProduct: null,
                currentService: service,
                isEditingProduct: false,
                isCreatingProduct: false,
                isEditingService: false,
                isCreatingService: false
            });
        }
    
        editProduct(product, status, shouldUpdateProduct = false) {
            console.log('editProduct:', product, status, shouldUpdateProduct);
            this.setState({
                currentProduct: product,
                isEditingProduct: status,
                isCreatingProduct: false,
                isEditingService: false,
                isCreatingService: false
    
            });
    
            if (shouldUpdateProduct)
                this.fetchProducts();
        }
    
        editService(service, status, shouldUpdateService = false) {
            console.log('editProduct:', service, status, shouldUpdateService);
            this.setState({
                currentService: service,
                isEditingService: status,
                isCreatingService: false,
                isEditingProduct: false,
                isCreatingProduct: false,
            });
    
            if (shouldUpdateService)
                this.fetchServices();
        }
    
        createProduct(status, shouldUpdateProduct) {
            this.setState({
                isCreatingProduct: status
            });
    
            console.log('createProduct:', shouldUpdateProduct);
            if (shouldUpdateProduct)
                this.fetchProducts();
        }
    
        createService(status, shouldUpdateService) {
            this.setState({
                isCreatingService: status
            });
    
            console.log('createProduct:', shouldUpdateService);
            if (shouldUpdateService)
                this.fetchServices();
        }
    */
    render() {
        const classes = makeStyles(theme => ({
            root: {
                width: '100%',
                maxWidth: 360,
                backgroundColor: theme.palette.background.paper,
            },
            nested: {
                paddingLeft: theme.spacing(4),
            },
            table: {
                minWidth: 700,
            },
            button: {
                margin: theme.spacing(1),
            },
            leftIcon: {
                marginRight: theme.spacing(1),
            },
            rightIcon: {
                marginLeft: theme.spacing(1),
            },
            iconSmall: {
                fontSize: 20,
            },
        }));

        
        const StyledTableCell = withStyles(theme => ({
            head: {
                backgroundColor: theme.palette.common.black,
                color: theme.palette.common.white,
            },
            body: {
                fontSize: 14,
            },
        }))(TableCell);

        const StyledTableRow = withStyles(theme => ({
            root: {
                '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.background.default,
                },
            },
        }))(TableRow);

        var row = 0;
        const salesItems = this.salesList.map(itemRef => {
            // console.log('itemRef', typeof itemRef, itemRef);
            // let item = itemRef.data();
            // item.amount = 1;
            row++;
            return (
                <StyledTableRow key={itemRef.id}
                    onChange={(e) => this.handleItemChange(e, itemRef)}
                >
                    <StyledTableCell style={{width: '140px'}}>
                        <IconButton size="small" aria-label="delete" size="small" onClick={(e) => this.handleDeleteItem(itemRef)}>
                            <Delete fontSize="inherit"/>
                        </IconButton>

                        { row !== 1 &&
                        <IconButton size="small" aria-label="Up" size="small" onClick={(e) => this.handleMoveUp(itemRef)}>
                            <ArrowUpward fontSize="inherit"/>
                        </IconButton>
                        }
                        { row !== this.salesList.length &&
                        <IconButton size="small" aria-label="Down" size="small" onClick={(e) => this.handleMoveDown(itemRef)}>
                            <ArrowDownward fontSize="inherit"/>
                        </IconButton>
                        }
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                        {itemRef.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                        <TextField
                            name="price"
                            defaultValue={itemRef.price}
                            // onChange={(e) => this.handleItemChange(e, item)}
                            // value={item.price}
                            inputProps={{
                                style: { width: 80, textAlign: "right", paddingRight: 10 }
                            }}
                            type="number" />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                        <TextField
                            name="amount"
                            defaultValue={itemRef.amount}
                            // value={item.amount}
                            inputProps={{
                                style: { width: 80, textAlign: "right" }
                            }}

                            type="number" />
                    </StyledTableCell>
                </StyledTableRow>

            );
        });

        var carRef = this.state.car;
        var car = carRef !== null ? carRef.data() : null;
        var customer = this.state.customer;

        console.log('Sales car:', car);
        console.log('Sales customer:', customer);

        return (
            <Grid container spacing={3}>

                {/* <Grid item xs={12}>
                    <Fab variant="extended" size="small" color="primary" aria-label="New Sales"
                        onClick={(event) => { }}>
                        <AddIcon size="small" /> New Sales
                    </Fab>                    
                </Grid> */}
                <Grid item xs={4}>
                    <ProductList
                        productList={this.state.productList}
                        serviceList={this.state.serviceList}
                        handleProductClick={(productRef) => { /* does nothing */ }}
                        handleServiceClick={(serviceRef) => { /* does nothing */ }}
                        handleProductDoubleClickx={(productRef) => this.handleItemDoubleClick(productRef)}
                        handleProductDoubleClick={this.handleItemDoubleClick}
                        handleServiceDoubleClick={(serviceRef) => this.handleItemDoubleClick(serviceRef)}
                    />
                </Grid>
                <Grid item xs={8}>
                    {/* <Fab variant="extended" size="small" color="primary" aria-label="Car"
                        onClick={(event) => { }}>
                        <AddIcon size="small" /> Car
                    </Fab> */}
                    {car &&
                        <p>
                            ชื่อลูกค้า: {customer.name}<br />
                            ทะเบียนรถ: {car.plateNumber}<br />
                            ยี่ห้อ/รุ่น: {car.brand} {car.model}
                        </p>
                    }
                    <br />
                    <FormControlLabel
                        control={
                            <Checkbox
                                defaultValue={this.state.doVAT}
                                onChange={e => this.handleDoVAT(e)}

                                color="primary"
                            />
                        }
                        label="แยก VAT"
                    />

                    <Button variant="contained" size="small" className={classes.button} onClick={this.handleSave}>
                        <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
                        บันทึก
      </Button>

                    <Button variant="contained" size="small" color="primary" className={classes.button}>
                        <PrintIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
                        บันทึก และ พิมพ์
      </Button>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>&nbsp;</StyledTableCell>
                                <StyledTableCell>รายการ</StyledTableCell>
                                <StyledTableCell align="center">ราคาต่อหน่วย</StyledTableCell>
                                <StyledTableCell align="center">จำนวน</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesItems}

                            {this.state.doVAT &&
                                <StyledTableRow key={-100}>

                                    <StyledTableCell colSpan="2">&nbsp;</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        VAT
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        {this.state.vat.toFixed(2)}
                                    </StyledTableCell>
                                </StyledTableRow>
                            }

                            <StyledTableRow key={-200}>
                                <StyledTableCell colSpan="2">&nbsp;</StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    ราคาทั้งหมด (รวม VAT)
                                    </StyledTableCell>
                                <StyledTableCell align="right">
                                    {this.state.totalPrice.toFixed(2)}
                                </StyledTableCell>
                            </StyledTableRow>


                        </TableBody>
                    </Table>

                </Grid>
            </Grid >
        );
    }
}

export default SalesHome;