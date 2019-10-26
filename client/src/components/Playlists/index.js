import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PlaylistList from './PlaylistList';
import PhraseCardGrid from '../Home/PhraseCardGrid';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';
import { connect } from 'react-redux';


const styles = theme => ({
    playlistHeader: {
        color: '#FFF',
        fontSize: '2em',
        textAlign: 'center'
    },
    playlistListContainer: {
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
            phrasesByPlaylist: [],
            selectedPlaylistPhrases: [],
            member: 'sly',
            currentPlaylist: ''
        }
    }

    selectPlaylist = (playlist) => {
        const { phrasesByPlaylist } = this.state;
        const selectedPlaylist = phrasesByPlaylist.find((x) => { return x.playlistId === playlist.id; })
        const selectedPlaylistPhrases = selectedPlaylist.phrases;
        this.setState({ currentPlaylist: playlist, selectedPlaylistPhrases });
    }


    async componentDidMount() {
        try{
            // on initial load retrieve all playlists created by signed in member
            let { data:allPhrases } = await axios.get('/api/memberPlaylistAndPhrases', {
                params: {
                    memberId: "sly",
                }
            });  

            // create an array of just playlist Ids and add each playlist to the store
            let playlists = [], phrasesByPlaylist = [];
            for(const p of allPhrases){
                const playlistObj = playlists.find((x) => { return x.id === p.playlistId; })

                if(!playlistObj){
                    const playlist = {
                        id: p.playlistId,
                        name: p.name
                    }
                    playlists.push(playlist);
                }

                const phraseByPlaylistObj = phrasesByPlaylist.find((x) => { return x.playlistId === p.playlistId; })

                if(!phraseByPlaylistObj) {
                    const newphraseByPlaylistObj = {
                        playlistId: p.playlistId,
                        phrases: [{
                            id: p.phraseId,
                            phrase: p.phrase
                        }]
                    }
                    phrasesByPlaylist.push(newphraseByPlaylistObj)
                } else {
                    const newPhraseObj = {
                        id: p.phraseId,
                        phrase: p.phrase
                    }
                    phraseByPlaylistObj.phrases.push(newPhraseObj)
                }
            }

            console.log("[playlist] playlists", playlists);
            console.log("[playlist] phrasesByPlaylist", phrasesByPlaylist);

            const currentPlaylist = playlists[0]
            const selectedPlaylist = phrasesByPlaylist.find((x) => { return x.playlistId === currentPlaylist.id; })
            const selectedPlaylistPhrases = selectedPlaylist.phrases;

            this.setState({ playlists, loading: false, currentPlaylist, selectedPlaylistPhrases, phrasesByPlaylist });
        } catch (err) {
            throw Error (err);
        }
    }
    
    render(){
        const { classes } = this.props;
        const { loading, playlists, selectedPlaylistPhrases, currentPlaylist } = this.state

        if(loading){
            return(<div></div>);
        }
        
        return(
            <div >
                <Grid container spacing={0} justify="center">
                    <Grid item xs={4} className={classes.playlistListContainer}>
                        <h1 className={classes.playlistHeader}>Playlists</h1>
                        <PlaylistList playlists={playlists} selectPlaylist={this.selectPlaylist} />
                    </Grid>
                    <Grid item xs={8}>
                        <h1 className={classes.playlistHeader}>{currentPlaylist.name}</h1>
                        <PhraseCardGrid data={selectedPlaylistPhrases} />
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