import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PlaylistMenu from './PlaylistMenu';
import PlaylistPhraseCardGrid from './PlaylistPhraseCardGrid';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';
import { connect } from 'react-redux';


const styles = theme => ({
    playlistHeader: {
        color: '#FFF',
        fontSize: '2em',
        textAlign: 'center',
        fontFamily: 'Montserrat'
    },
    playlistMenuContainer: {
        width: '100%',
        height: '100%',
        // float: 'right',
        // margin: theme.spacing.unit * 2,
    },
});



class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            playlists: [],
            phrases: [],
            phrasesByPlaylist: [],
            selectedPlaylistPhrases: [],
            member: 'sly',
            currentPlaylist: false
        }
    }

    selectPlaylist = (playlist) => {
        this.getPlaylistPhrases(playlist.id)
    }

    refreshPlaylists = async (currentPlaylistId) =>{
        console.log('[playlists] refreshing playlists...')
        this.getPlaylistPhrases(currentPlaylistId)
    }

    getPlaylistPhrases = async (playlistId) =>{
        console.log('[getPlaylistPhrases] getting playlist phrases...', playlistId)
        try{
            // on initial load retrieve all playlists created by signed in member
            let { data:phrases } = await axios.get('/api/memberPlaylistPhrases', {
                params: {
                    memberId: "sly",
                    playlistId
                }
            });  

            const currentPlaylist = playlistId == 0 || !playlistId ? phrases[0].playlistId : playlistId;

            this.setState({ loading: false, phrases, currentPlaylist })
        } catch (err) {
            throw Error (err);
        }
    }


    async componentDidMount() {
        this.getPlaylistPhrases(0);
    }
    
    render(){
        const { classes } = this.props;
        const { loading, playlists, phrases } = this.state

        if(loading){
            return(<div></div>);
        }            
        
        return(
            <div >
                <Grid container spacing={0} justify="center">
                    <Grid item xs={4} className={classes.playlistMenuContainer}>
                        <h1 className={classes.playlistHeader}>Playlists</h1>
                        <PlaylistMenu selectPlaylist={this.selectPlaylist} />
                    </Grid>
                    <Grid item xs={8}>
                        <h1 className={classes.playlistHeader}>{phrases[0].name}</h1>
                        <PlaylistPhraseCardGrid phrases={phrases} memberPlaylists={playlists} refreshPlaylists={this.refreshPlaylists}/>
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