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

class ServiceDetailCard extends React.Component {

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


/*
    handleDelete(event, serviceId) {
        // TODO check authorisation!
        console.log('handleDelete:',serviceId)
        fetch('http://localhost:8080/api/services/' + serviceId, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(res => {
                console.log('Success Delete:', JSON.stringify(res));
                this.props.handleChange();
            })
            .catch(error => {
                console.error('Error:', error);
            });
            this.setState({ open: false });
    }
*/
    render() {
        const serviceRef = this.props.service;
        
        // console.debug('ServiceDetailCard render:',serviceRef);
        if (serviceRef === undefined || serviceRef === null) {
            return (
                <div>
                    
                </div>
            );
        } else {
            console.log('serviceRef',serviceRef)
            const service = serviceRef.data();
            return (
                <div>
                    <Card className={this.classes.card}>
                        <CardHeader

                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={service.name}
                            subheader=""
                        />
                        {service.imageUrl === undefined || service.imageUrl === null || service.imageUrl === ''?'':
                        <CardMedia
                            component="img"
                            height='200px'
                            className={this.classes.media}
                            image={service.imageUrl}
                        />
                        }

                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p">
Price: {service.price}<br/>
                            </Typography>

                        </CardContent>
                        <CardActions disableSpacing>
                            <IconButton aria-label="Edit"
                                onClick={(event) => this.props.handleEditClick(serviceRef)}>

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
                                Are you sure to delete {service.name}?
  </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary"
                                onClick={() => {this.props.handleDeleteClick(serviceRef.id); this.setState({ open: false });}}>
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

export default ServiceDetailCard;
