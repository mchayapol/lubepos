import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


import MoreVertIcon from '@material-ui/icons/MoreVert';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ProductDetailCard extends React.Component {

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
        }
    }





    render() {
        const productRef = this.props.product;
        
        if (productRef === undefined || productRef === null || !productRef) {
            return (
                <div>
                    
                </div>
            );
        } else {
            console.log('ProductDetailCard render:',productRef);
            const product = productRef.data();
            return (
                <div>
                    <Card className={this.classes.card}>
                        <CardHeader

                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={product.name}
                            subheader={product.brand}
                        />
                        {product.imageUrl === undefined || product.imageUrl === null || product.imageUrl === ''?'':
                        <CardMedia
                            component="img"
                            height='200px'
                            className={this.classes.media}
                            image={product.imageUrl}
                        />
                        }

                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
Price: {product.price}<br/>
In Stock: {product.amount}
                            </Typography>

                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="Edit"
                                onClick={(event) => this.props.handleEditClick(productRef)}>

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
                                Are you sure to delete {product.name}?
  </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary"
                                onClick={() => {this.props.handleDeleteClick(productRef.id); this.setState({ open: false })}}>
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

export default ProductDetailCard;
