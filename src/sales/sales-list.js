/*
UNUSED???
*/
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import { Fab } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { Container } from '@material-ui/core';




class SalesList extends React.Component {

  classes = makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));

  constructor(props) {
    super(props);
    this.state = {
      // openProduct: false,
      // openService: true,
    };

  }

  render() {
    console.log('this.props.items',typeof this.props.items);
    console.log('this.props.items',this.props.items);
    const salesItems = this.props.items.map(itemRef => {
      console.log('itemRef',typeof itemRef,itemRef);
      let item = itemRef.data();
      return (
        <ListItem button
          key={itemRef.id}
          className={this.classes.nested} onClick={() => this.props.handleProductClick(item)}>
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      );
    });


    return (
      <Container>
        <Fab variant="extended" size="small" color="primary" aria-label="New Item"
          onClick={(event) => { }}>
          <AddIcon size="small" /> New Item
        </Fab>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={this.classes.root}
        >
{salesItems}
          {/* <ListItem button 
          onClick={() => this.setState({ openProduct: !this.state.openProduct })}
          
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Product" />
            {this.state.openProduct ? <ExpandLess /> : <ExpandMore />}
          </ListItem> */}
          <Collapse in={this.state.openProduct} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {salesItems}
            </List>
          </Collapse>

        </List>
      </Container>
    );
  }
}

export default SalesList;
