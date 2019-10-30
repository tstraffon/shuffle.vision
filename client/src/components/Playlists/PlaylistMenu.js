import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';


const styles = theme => ({
    playlistsContainer: {
        backgroundColor: theme.palette.primary,
        fontSize: '1.25em',
        width: '100%'
    },
});



class PlaylistList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            displayData: [],
            sessionSettings: {},
        }
    }


    handlePlaylistClick = (playlist) => {
        this.props.selectPlaylist(playlist);
    }

    async componentDidMount() {
        try{
            // on initial load retrieve all playlists created by signed in member
            let { playlists } = this.props;  
            console.log("[playlist-list] playlists", playlists);
            this.setState({ playlists, loading: false });
        } catch (err) {
            throw Error (err);
        }
    }
    
    render(){
        const { classes } = this.props;
        const { loading, playlists } = this.state

        if(loading){
            return(<div></div>);
        }
        
        return(
            <div >
                <Grid container spacing={2} justify="center"  className={classes.playlistsContainer}>
                    <List component="nav" aria-label="secondary mailbox folders">
                        {playlists.map(p => (
                            <ListItem button>
                                <ListItemText 
                                    primary={p.name} 
                                    onClick={() => this.handlePlaylistClick(p)}
                                />
                            </ListItem>
                        ))}
                    </List>
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

const PlaylistListContainer = connect(
    mapStateToProps,
    // mapDispatchToProps,
)(PlaylistList);

// apply class stylings
PlaylistList.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(PlaylistListContainer); 