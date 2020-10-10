import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';


import MoreVertIcon from '@material-ui/icons/MoreVert';
// import { OperationCanceledException } from 'typescript';


require("firebase/firestore");
/*
 Expected property
 props.car
*/
class CarDetailCard extends React.Component {

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

    editable = true;
    prevCarId = '';

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            owner: null
        }

        this.editable = (this.props.editable === undefined) ? true : this.props.editable;

        if (!this.props.car) {
            throw new Error("CarDetailCard.props.car is required.");
        }
    }

    componentDidMount() {
        // Fetch the latest car info to edit
        this.fetchOwner(this.props.car.ownerRef);
    }

    handleDelete = (event, carId) => {
        var self = this;
        function cbThen() {
            self.setState({ open: false });
        }

        function cbCatch(error) {
            self.setState({ open: false });
        }

        this.props.handleDelete(event, carId, cbThen, cbCatch);

    }

    fetchOwner(ownerRef) {
        console.log('fetchOwner', ownerRef);
        let undisclosedOwner = {
            name: '-- Undisclosed --',
            phone: '',
            email: ''
        };

        if (ownerRef === undefined || ownerRef === 0) {
            this.setState({
                owner: undisclosedOwner
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
                    owner: undisclosedOwner
                });
            } else {
                this.setState({
                    owner: {
                        name: snap.data().name,
                        phone: snap.data().phone,
                        email: snap.data().email
                    }
                });
            }
        });






    }



    render() {
        const carRef = this.props.car;
        console.log('CarDetail: carRef', carRef);
        const car = carRef.data();

        console.log('CarDetail: car', car);
        if (carRef.id !== this.prevCarId) {
            // TODO how to run getCarList() once prop change?
            this.prevCarId = carRef.id;
            this.fetchOwner(car.ownerRef);
        }

        if (car === undefined || car === null) {
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
                                    {car.brand[0]}
                                </Avatar>
                            }
                            action={
                                <IconButton>
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={car.plateNumber + ' ' + car.brand + ' ' + car.model}
                            subheader={this.state.owner === null || !this.editable ? '' : this.state.owner.name}
                        />
                        {car.imageUrl &&
                            <CardMedia
                                component="img"
                                height='200px'
                                className={this.classes.media}
                                src={car.imageUrl}
                                title={car.plateNumber + ' ' + car.brand + ' ' + car.model}
                            />
                        }
                        <CardContent>
                            {!this.editable ? '' :
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {/* Owner: Chayapol Moemeng<br /> */}
                                    Year: {car.year === null ? '-' : car.year}<br />
                                    Owner: {this.state.owner === null ? '-' : this.state.owner.name}<br />
                                    Phone: {this.state.owner === null ? '-' : this.state.owner.phone}<br />
                                    Email: {this.state.owner === null ? '-' : this.state.owner.email}<br />
                                </Typography>
                            }
                        </CardContent>
                        <CardActions disableSpacing>
                            <Fab variant="extended" size="small" color="secondary" aria-label="Add"
                                onClick={(event) => this.props.handleServiceThisCar(carRef)}>
                                <AddIcon size="small" /> Service This Car
                        </Fab>

                            {!this.editable ? '' :
                                <div>
                                    <IconButton aria-label="Edit"
                                        onClick={(event) => this.props.handleEditClick()}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton aria-label="Delete"
                                        onClick={(event) => this.props.handleDeleteClick(carRef)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            }
                        </CardActions>
                    </Card>


                </div>
            );
        }
    }
}

export default CarDetailCard;
