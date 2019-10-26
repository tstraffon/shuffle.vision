import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


import axios from 'axios';
import { connect } from 'react-redux';


const styles = theme => ({
    playlistsContainer: {
        backgroundColor: theme.palette.primary,
        // marginLeft: '10%',
        fontSize: '1.25em',
    },
});



class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            displayData: [],
            sessionSettings: {},
        }
    }




    async componentDidMount() {
        try{
            // on initial load retrieve all playlists created by signed in member
            const { phrases } = this.props;  
            console.log("[phrase-list] phrases");
            // this.setState({ playlists, loading: false });
        } catch (err) {
            throw Error (err);
        }
    }
    
    render(){
        const { classes } = this.props;
        const { loading } = this.state

        if(loading){
            return(<div></div>);
        }
        
        return(
            <div >
                <Grid container spacing={0} justify="center" >
                    <Grid item xs={12}>
                        <List component="nav" aria-label="secondary mailbox folders">
                            <ListItem button>
                                <ListItemText primary="Trash" />
                            </ListItem>
                            <ListItem button>
                                <ListItemText primary="Trash" />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </div>
        );
    }  
}


// Playlist Redux Container
const mapStateToProps = state => ({
    sessionCount: state.sessionCount,
    sessionPlaylists: state.sessionPlaylists,
  });

// const mapDispatchToProps = dispatch => {
//   return {
//     AddToCart: beatId => dispatch(AddToCart(beatId))
//   };
// }

const PlaylistContainer = connect(
    mapStateToProps,
    // mapDispatchToProps,
)(Playlist);

// apply class stylings
Playlist.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(PlaylistContainer); 