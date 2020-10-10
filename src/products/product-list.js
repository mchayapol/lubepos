/*
This includes both product and service.
*/
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import { ExpandLess, ExpandMore, StarBorder, ArrowRight } from '@material-ui/icons';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SendIcon from '@material-ui/icons/Send';
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import StarBorder from '@material-ui/icons/StarBorder';




class ProductList extends React.Component {

  classes = makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(2),
    },
  }));

  constructor(props) {
    super(props);

    // Check completeness of the function calls
    if (!this.props.handleProductClick) {
      throw new Error("ProductList.handleProductClick handler is required.");
    }

    if (!this.props.handleServiceClick) {
      throw new Error("ProductList.handleServiceClick handler is required.");
    }

    this.state = {
      openProduct: true,
      openService: true,
    };


    // TODO make default handler? Otherwise both click and db-click will be triggered.
    this._handleProductDoubleClick = (this.props.handleProductDoubleClick) ?
      this.props.handleProductDoubleClick :
      this.props.handleProductClick;

    this._handleServiceDoubleClick = (this.props.handleServiceDoubleClick) ?
      this.props.handleServiceDoubleClick :
      this.props.handleServiceClick;

  }

  render() {
    const productItems = this.props.productList.map(productRef => {
      let product = productRef.data();
      return (
        <ListItem button
          key={productRef.id}
          className={this.classes.nested}
          onDoubleClick={(e) => this._handleProductDoubleClick(productRef)}
          onClick={(e) => this.props.handleProductClick(productRef)}>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText primary={product.name} />
        </ListItem>
      );
    });

    const serviceItems = this.props.serviceList.map(serviceRef => {
      let service = serviceRef.data();
      return (
        <ListItem button
          key={serviceRef.id}
          className={this.classes.nested}
          onDoubleClick={(e) => this._handleServiceDoubleClick(serviceRef)}
          onClick={() => this.props.handleServiceClick(serviceRef)}>
          <ListItemIcon>
            <ArrowRight />
          </ListItemIcon>
          <ListItemText primary={service.name} />
        </ListItem>
      );
    });

    return (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={this.classes.root}
      >
        <ListItem button onClick={() => this.setState({ openProduct: !this.state.openProduct })}>
          {/* <ListItemIcon>
            <SendIcon />
          </ListItemIcon> */}
          <ListItemText primary="Product" />
          {this.state.openProduct ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.openProduct} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense={true}>
            {productItems}
          </List>
        </Collapse>



        <ListItem button onClick={() => this.setState({ openService: !this.state.openService })}>
          {/* <ListItemIcon>
            <InboxIcon />
          </ListItemIcon> */}
          <ListItemText primary="Services" />
          {this.state.openService ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.openService} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense={true}>
            {serviceItems}
          </List>
        </Collapse>
      </List>
    );
  }
}

export default ProductList;
