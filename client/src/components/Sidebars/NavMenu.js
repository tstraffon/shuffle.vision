import React, {Component} from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Reorder from '@material-ui/icons/PlaylistPlay';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormLabel from '@material-ui/core/FormLabel';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { Link } from 'react-router-dom';
import axios from 'axios';




const styles = theme => ({
    fab: {
        float: 'left',
        margin: theme.spacing.unit,
      },
    menuContainer: {
        width: '100%',
        height: '100%',
        // float: 'right',
        // margin: theme.spacing.unit * 2,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit * 2,
    },
    fabContainer: {
        width: '25%',
        float:'right',
        marginTop: theme.spacing.unit * 2,
    },
    paper: {
        width: '90%',
        float: 'right',
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.primary.main,
    },
    nested: {
        paddingTop: '0px',
        paddingBottom: '0px'
    },
    border: {
        borderColor : '#FFF !important'
    },
    textField: {    
        width: '90%',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        // borderColor: "#FFF !important",
        // multilineColor:"#FFF",
        // input:"#FFF",
        // floatingLabelFocusStyle: "#FFF",
    },
    playlistSelect: {    
        padding: theme.spacing.unit * 2,
    },
    button:{
        color: '#FFF',
        width: '50%',
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




class NavMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showMenu: false,
      addPhrase: false,
      textFieldValue: "",
      filterOpen: false,
      selectedPlaylistId:"",
      selectedPlaylistLabel:"",
      memberPlaylists:[]
    };
  }

    _handleTextFieldChange= (e) => {
        this.setState({
            textFieldValue: e.target.value
        });
    }

    _handlePlaylistChange = e => {
        const selectedPlaylist = this.state.memberPlaylists.find((x) => { return x.id === e.target.value; });
        const id = selectedPlaylist.id
        this.setState({ selectedPlaylist: id });
    };

    toggleMenuTrue = () => {     
        this.setState({ showMenu: true });
    };

    toggleMenuFalse = () => {     
        this.setState({ showMenu: false });
    };

    toggleAddPhraseTrue = () => {
        this.setState({addPhrase: true});
    } 

    toggleAddPhraseFalse = () => {
        this.setState({addPhrase: false, textFieldValue:""});
    } 

    addPhrase = async () => {
        
        const { textFieldValue, memberPlaylists } = this.state;
        let playlistIds = [];

        for(const p of memberPlaylists){
            if(p.checked){
                playlistIds.push(p.id);
            }
        }

        await axios.get('/api/addPhrases',{
            params: {
                phrase: textFieldValue,
                memberId: "sly",
                playlistIds,
            },
        }); 
        
        this.setState({addPhrase: false, textFieldValue:""});
    }  

    toggleSelectPlaylist = (memberPlaylists, playlistIndex ) => {

        const currentPlaylistState = memberPlaylists[playlistIndex].checked;
        memberPlaylists[playlistIndex].checked = !currentPlaylistState;
        this.setState({ memberPlaylists });

    };



    async componentDidMount() {

        let {data:memberPlaylists} = await axios.get('/api/memberPlaylists',{
            params: {
                memberId: "sly",
            },
        }); 

        for(let p of memberPlaylists){
            p.checked = false
        }

        this.setState({loading: false, memberPlaylists})
    }

  render() {

    const { classes, } = this.props;
    const { loading, addPhrase, textFieldValue, memberPlaylists } = this.state;

    if(loading){
      return(<div></div>);
    }

    return (  
        <div className={classes.menuContainer} onMouseEnter={this.toggleMenuTrue} onMouseLeave={this.toggleMenuFalse}>
            <CssBaseline />
                <div>
                    <Slide direction="left" in={addPhrase} mountOnEnter unmountOnExit>
                        <Paper className={classes.paper}>
                            <Grid container spacing={0}>
                                <Grid item key={"new-phrase-text-field"} sm={12}>
                                    <TextField
                                        id="outlined-uncontrolled"
                                        // label="new phrase"
                                        value={textFieldValue} 
                                        onChange={this._handleTextFieldChange}                    
                                        className={classes.textField}
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{
                                            classes: {
                                                notchedOutline: classes.border,
                                            },
                                        }}
                                    /> 
                                </Grid>
                                <Grid item key={"new-phrase-playlist-select"} sm={12} className={classes.playlistSelect}>
                                    <FormLabel component="legend" style ={{ color: "#FFF" }}>Playlists</FormLabel>
                                    <List component="div" disablePadding>
                                        {memberPlaylists.map((playlist, playlistIndex) => (
                                            <ListItem button className={classes.nested} onClick={() => { this.toggleSelectPlaylist(memberPlaylists, playlistIndex); }}>
                                                <Checkbox
                                                    checked={playlist.checked}
                                                    value={playlist.id}
                                                    style ={{ color: "#FFF" }}
                                                />                  
                                                <ListItemText inset primary={playlist.name} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                                {/* <Grid item key={"new-phrase-submit-button"} sm={6}> */}
                                    <Button size="large" color="secondary" className={classes.button} onClick={this.addPhrase}>
                                        Submit
                                    </Button>
                                {/* </Grid>
                                <Grid item key={"new-phrase-cancel-button"} sm={6}> */}
                                    <Button size="large" color="secondary" className={classes.button} onClick={this.toggleAddPhraseFalse}>
                                        Cancel
                                    </Button>
                                {/* </Grid> */}
                            </Grid>
                        </Paper>
                    </Slide>
                <div className={classes.fabContainer}>
                    {!addPhrase ? <Fab color="primary" aria-label="add-phrase" className={classes.fab} onClick={this.toggleAddPhraseTrue}>
                        <AddIcon />
                    </Fab> : null }
                    <Fab color="primary" aria-label="home" className={classes.fab} button component={Link} to="/">
                        <ShuffleIcon />
                    </Fab>
                    <Fab color="primary" aria-label="playlist" className={classes.fab} button component={Link} to="/playlists">
                        <Reorder />
                    </Fab>
                    {/* <Fab color="primary" aria-label="photos" className={classes.fab} button component={Link} to="/images">
                        <Filter />
                    </Fab> */}
                    {/* <Fab color="primary" aria-label="profile" className={classes.fab} button component={Link} to="/account">
                        <AccountCircle />
                    </Fab> */}
                </div>
            </div>
        </div>
    );
  }
}


NavMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavMenu);

