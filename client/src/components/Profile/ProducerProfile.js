import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';


const styles = theme => ({

  actionButton: {
    margin: 'auto',
    display: 'block'
  },
  beatListPanel: {
    width: '100%',
    marginBottom: '16px',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 4}px 0`,
  },
  cardContent: {
    flexGrow: 1,
    paddingBottom: '16px',
  },
  profilePic: {
    height: 100,
    width: 100,
    display: 'block',
    margin: 'auto',
    borderRadius: '50%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    backgroundColor: theme.palette.main,
    // [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
    //   width: 1200,
    //   marginLeft: 'auto',
    //   marginRight: 'auto',
    // },
  },
  producerContainer: {
    height: '80%',
  },
  // imageContainer: {
  //   height: '2em',
  // },
  viewProfileButton:{
    width: '75%',
    margin: 'auto',
    paddingTop: 2,
    paddingBottom: 2,
    border: '2px',
    transition: 'all .2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
     },
  },
});

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

class ProducerProfile extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showDetails: false,
    };
  }



  render(){
    console.log("[producer-profile] props", this.props);
    const stateProps = this.props.store.getState();
    console.log("[producer-profile] stateProps", stateProps);
    const { classes } = this.props;
    const beats = [{
      id: 14,
      name:	'Roulette',	
      dateAdded: '2017-06-22',
      bpm: 75,
      length:	'2:40',
    },
    {
      id: 27,
      name:	'EZ Goin',	
      dateAdded: '2017-07-25',
      bpm: 120,
      length:	'2:16',
    },
    {
      id: 42,
      name:	'Laura',	
      dateAdded: '2017-06-22',
      bpm: 118,
      length:	'1:32',
    }]


    return (
      <React.Fragment>     
          <div className={classNames(classes.layout, classes.cardGrid)}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent} >
                        <Grid container spacing={16} className={classes.imageContainer}>
                            <Grid item sm={4}>
                                <CardMedia
                                    component="img"
                                    className={classes.profilePic}
                                    alt="Profile Pic"
                                    src={require('../../images/profilePic.jpg')}
                                    title="Image title"
                                />
                                </Grid>
                            <Grid item sm={7} className={classes.producerContainer} style={{margin:'auto', display:'block'}}>
                                <Typography gutterBottom variant="h3" >
                                PRODUCER PROFILE PAGE
                                </Typography>
                                <Typography gutterBottom variant="h4" fontSize="1em">
                                Genres and Tags
                                </Typography>
                            </Grid>
                        </Grid>
                        <CardActions >
                            <Button size="large" color="secondary" className={classes.viewProfileButton} >
                                View Profile
                            </Button>
                        </CardActions>
                    </CardContent>
                </Card>
          </div>
      </React.Fragment>
    ); 
  }
}

ProducerProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProducerProfile);
