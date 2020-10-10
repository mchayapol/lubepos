import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
// import DirectionsIcon from '@material-ui/icons/Directions';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import ProductList from './product-list.js';
import ProductForm from './product-form.js';
import ServiceForm from './service-form.js';
import ProductDetailCard from './product-detail-card.js';
import ServiceDetailCard from './service-detail-card.js';

import firebase from 'firebase/app';
require("firebase/firestore");

class ProductHome extends React.Component {
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
            currentProduct: null,
            currentService: null,
            productList: [],
            serviceList: [],
            isEditingProduct: false,
            isCreatingProduct: false,
            isEditingService: false,
            isCreatingService: false
        };
    }


    componentDidMount() {
        this.fetchProducts();
        this.fetchServices();
    }

    fetchServices() {
        var db = firebase.firestore();
        db.collection("services").orderBy('name').get().then((snapshot) => {
            this.setState({
                serviceList: snapshot.docs,
                orgServiceList: snapshot.docs
            });
        });

        return;
    }

    fetchProducts() {
        var db = firebase.firestore();
        db.collection("products").orderBy('name').get().then((snapshot) => {
            this.setState({
                productList: snapshot.docs,
                orgProductList: snapshot.docs
            });
        });


        return;

    }

    showProductDetail(productRef) {
        console.log(productRef);
        this.setState({
            currentProduct: productRef,
            currentService: null,
            isEditingProduct: false,
            isCreatingProduct: false,
            isEditingService: false,
            isCreatingService: false
        });
    }

    showServiceDetail(serviceRef) {
        console.log('showServiceDetail', serviceRef);
        this.setState({
            currentProduct: null,
            currentService: serviceRef,
            isEditingProduct: false,
            isCreatingProduct: false,
            isEditingService: false,
            isCreatingService: false
        });
    }


    deleteProduct(productId) {
        var db = firebase.firestore();
        db.collection('products').doc(productId).delete().then(() => {
            this.fetchProducts();
            this.setState({
                open: false,
                currentProduct: null
            })
        });
    }

    deleteService(serviceId) {
        var db = firebase.firestore();
        db.collection('services').doc(serviceId).delete().then(() => {
            this.fetchServices();
            this.setState({
                open: false,
                currentService: null
            })
        });
    }


    editProduct(productRef, status, shouldUpdateProduct = false) {
        console.log('editProduct:', productRef, status, shouldUpdateProduct);
        this.setState({
            currentProduct: productRef,
            isEditingProduct: status,
            isCreatingProduct: false,
            isEditingService: false,
            isCreatingService: false

        });

        if (shouldUpdateProduct)
            this.fetchProducts();
    }

    editService(serviceRef, status, shouldUpdateService = false) {
        console.log('editService:', serviceRef, status, shouldUpdateService);
        this.setState({
            currentService: serviceRef,
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

        console.log('createService:', shouldUpdateService);
        if (shouldUpdateService)
            this.fetchServices();
    }

    onSearchKeywordChange = (event) => {
        // console.log(event);
        var value = event.target.value;
        // console.log(this.state.carList);
        var products = [];
        this.state.orgProductList.forEach((productRef, index) => {
            let product = productRef.data();
            let text = "/" + product.name + "/i";

            // console.log(value, text, text.match(new RegExp(value, "i")));
            if (text.match(new RegExp(value, "i")))
                products.push(productRef);
        });

        var services = [];
        this.state.orgServiceList.forEach((serviceRef, index) => {
            let service = serviceRef.data();
            let text = "/" + service.name + "/i";

            // console.log(value, text, text.match(new RegExp(value, "i")));
            if (text.match(new RegExp(value, "i")))
                services.push(serviceRef);
        });

        this.setState({
            productList: products,
            serviceList: services
        });
    }

    render() {

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={this.searchBoxClasses.root}>
                        <InputBase className={this.searchBoxClasses.input} placeholder="Search ทะเบียนรถ ยี่ห้อ รุ่น ชื่อลูกค้า"
                            onChange={(event) => this.onSearchKeywordChange(event)} />
                        <IconButton className={this.searchBoxClasses.iconButton} aria-label="Search">
                            <SearchIcon />
                        </IconButton>
                        {/* <Divider className={this.searchBoxClasses.divider} /> // TODO can't make it vertical */}

                        <Fab variant="extended" size="small" color="primary" aria-label="Add Product"
                            onClick={(event) => this.setState({ isCreatingProduct: true, isCreatingService: false, isEditingService: false, isEditingProduct: false, currentProduct: null, currentService: null })}>
                            <AddIcon size="small" /> Add Product
                            </Fab>
                        <Fab variant="extended" size="small" color="primary" aria-label="Add Service"
                            onClick={(event) => this.setState({ isCreatingService: true, isCreatingProduct: false, isEditingService: false, isEditingProduct: false, currentProduct: null, currentService: null })}>
                            <AddIcon size="small" /> Add Service
                            </Fab>
                    </Paper>
                </Grid>

                <Grid item xs={6}>
                    <ProductList
                        productList={this.state.productList}
                        serviceList={this.state.serviceList}
                        handleProductClick={(productRef) => this.showProductDetail(productRef)}
                        handleServiceClick={(serviceRef) => this.showServiceDetail(serviceRef)} />
                </Grid>
                <Grid item xs={6}>
                    {this.state.isEditingProduct === true ?
                        <ProductForm
                            mode='edit'
                            product={this.state.currentProduct}
                            closeThisComponent={(updatedProductRef, shouldUpdateProduct) => this.editProduct(updatedProductRef, false, shouldUpdateProduct)}
                        />
                        :
                        this.state.isCreatingProduct === true ?
                            <ProductForm
                                mode='create'
                                product={this.state.currentProduct}
                                closeThisComponent={(shouldUpdateProduct) => this.createProduct(false, shouldUpdateProduct)}
                            />
                            :
                            <ProductDetailCard
                                handleChange={() => { this.fetchProducts(); this.showProductDetail(null) }}
                                handleDeleteClick={productId => this.deleteProduct(productId)}
                                handleEditClick={(product) => { this.editProduct(product, true) }}
                                product={this.state.currentProduct}
                            />


                    }
                    {
                        this.state.isEditingService === true ?
                            <ServiceForm
                                mode='edit'
                                service={this.state.currentService}
                                closeThisComponent={(updatedServiceRef, shouldUpdateService) => this.editService(updatedServiceRef, false, shouldUpdateService)}
                            />
                            :
                            this.state.isCreatingService === true ?
                                <ServiceForm
                                    mode='create'
                                    service={this.state.currentService}
                                    closeThisComponent={(shouldUpdateService) => this.createService(false, shouldUpdateService)}
                                />
                                :
                                <ServiceDetailCard
                                    handleClick={() => { this.fetchServices(); this.showServiceDetail(null) }}
                                    handleDeleteClick={serviceId => this.deleteService(serviceId)}
                                    handleEditClick={(service) => { this.editService(service, true) }}
                                    service={this.state.currentService}
                                />
                    }
                </Grid>
            </Grid>
        );
    }
}

export default ProductHome;