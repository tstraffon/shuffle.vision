import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import DeleteIcon from '@material-ui/icons/Delete';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import FormLabel from '@material-ui/core/FormLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
  },
  cardContent: {
    flexGrow: 1,
    margin: 'auto',
    paddingBottom: theme.spacing.unit,
  },
  hoverCardContent: {
    flexGrow: 1,
    margin: 'auto',
    height: '50%',
  },
  label: {
    textAlign: 'center',
    opacity: 1,
    fontSize: '2em',
  },
  hoverLabel: {
    textAlign: 'center',
    opacity: 1,
    fontSize: '2em',
    paddingTop: 0,
  },
  modal: {
    display: 'block',
    margin: 'auto',
    width: 400,
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing.unit * 16,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 2,
  },
  modalText: {
    color : '#FFF'
  },
  nested: {
    paddingTop: '0px',
    paddingBottom: '0px'
  },
  border: {
    borderColor : '#FFF !important'
  },
  actionIcon:{
    color: '#FFF',
    display: 'block',
    margin: 'auto',
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    transition: 'all .2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: theme.palette.secondary.main,
    },
  },
  modalActionButton:{
    color: '#FFF',
    display: 'block',
    margin: 'auto',
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    transition: 'all .2s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
    },
  },
  editIcon:{
    color: '#FFF',
    display: 'block',
    float: 'left',
    // width: '100%',
  },
  deleteIcon:{
    color: '#FFF',
    display: 'block',
    float: 'right',
    // width: '100%',
  }
});


class PhraseCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      editPhrase: false,
      showDeleteModal: false,
      textFieldValue: '',
      memberPlaylists: [],
      phrase: {},
    };
  }

  async componentDidMount() {
    try{
      const { phrase } = this.props;
      this.setState({loading: false, textFieldValue: phrase.phrase, phrase})

    } catch(err) {
      console.error(err);
    }
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.phrases !== this.state.phrases) {
  //     console.log('componentDidUpdate')
  //     const { phrases, currentPlaylist } = this.state;
  //     this.setState({ phrases,  currentPlaylist});
  //   }
  // }

  _handleTextFieldChange= (e) => {
    this.setState({
        textFieldValue: e.target.value
    });
}

  editPhrase = () => {
    this.setState({ editPhrase: true });
  }

  exitEditPhrase = () => {
    this.setState({ editPhrase: false });
  }

  updatePhrase = async (phrase, textFieldValue) => {
    console.log('[edit-phrase]', phrase, textFieldValue)
    await axios.get('/api/updatePhrase',{
      params: {
          phraseId: phrase.id,
          newValue: textFieldValue
       },
    }); 

    this.setState({ editPhrase: false, phrase:{ phrase: textFieldValue }})
  }

  showMoveModal = async (phrase) => {

    const { data:memberPlaylists } = await axios.get('/api/memberPlaylists', {
      params: {
          memberId: "sly",
      }
    });

    let { data:phrasePlaylists } = await axios.get('/api/phrasePlaylists', {
          params: {
              phrase: phrase.phrase,
          }
    }); 

    for(const m of memberPlaylists){
      if(phrasePlaylists.find((p) => {
        console.log('')
        return p.id === m.id
      })){
        m.checked = true;
      } else {
        m.checked= false;
      }
    }
    this.setState({ memberPlaylists, showMoveModal: true });
  }

  toggleSelectPlaylist = (memberPlaylists, playlistIndex ) => {
    const currentPlaylistState = memberPlaylists[playlistIndex].checked;
    memberPlaylists[playlistIndex].checked = !currentPlaylistState;
    this.setState({ memberPlaylists });
  };

  handleMoveModalClose = () => {
    this.setState({ showMoveModal: false });
  }

  updatePhrasePlaylists = async (phrase, memberPlaylists) => {
    try{
      let addToPlaylists = [], removeFromPlaylists = [];

      for(const m of memberPlaylists){
        if(m.checked){
          addToPlaylists.push(m.id);
        } else {
          removeFromPlaylists.push(m.id);
        }
      }

      // console.log('[update-phrase-playlist]', phrase, addToPlaylists)
      await axios.get('/api/updatePhrasePlaylists',{
        params: {
            phraseId: phrase.id,
            phrase: phrase.phrase,
            addToPlaylists,
            removeFromPlaylists,
            memberId: 'sly'
         },
      }); 


      this.props.refreshPlaylists(phrase.playlistId);
      this.setState({ showMoveModal: false });

    } catch (err){
      console.error(err);
      this.setState({ showMoveModal: false });
    }   
  }

  showDeleteModal = () => {
    this.setState({ showDeleteModal: true });
  }

  handleDeleteModalClose = () => {
    this.setState({ showDeleteModal: false });
  }
  
  deletePhrase = async (phraseId, playlistId) => {

    try{

      console.log('[delete-phrase]', phraseId, playlistId)
      await axios.get('/api/deletePhraseFromPlaylist',{
        params: {
            phraseId: phraseId,
            playlistId: playlistId
         },
      }); 
      this.props.refreshPlaylists(playlistId);
      this.setState({ showDeleteModal: false });

    } catch (err){
      console.error(err);
      this.setState({ showDeleteModal: false });

    }   
  }

  handlePlaylistClick = (playlist) => {
    console.log('[playlist-click]', playlist)
  };


  render() {
    const { classes } = this.props;
    const { loading, editPhrase, showDeleteModal, showMoveModal, textFieldValue, phrase, memberPlaylists } = this.state;

    if(loading){
      return(<div></div>);
    }

    return (
      <React.Fragment>
        <CssBaseline />
        {!editPhrase ? 
          <Card className={classes.card}color="primary" >
            <CardContent className={classes.hoverCardContent} >
              <Typography className={classes.hoverLabel}>{phrase.phrase}</Typography>
            </CardContent> 
            <Grid container spacing={0}>
              <Grid item key={`edit-${phrase.id}`} sm={4} className={classes.actionContainer}>
                <Button size="small" color="secondary" className={classes.actionIcon} onClick={() => { this.editPhrase()}}>
                  <EditIcon />
                </Button>
              </Grid>
              <Grid item key={`move-${phrase.id}`} sm={4} className={classes.actionContainer}>
                <Button size="small" color="secondary" className={classes.actionIcon} onClick={() => { this.showMoveModal(phrase)}}>
                  <ControlCameraIcon />
                </Button>
              </Grid>
              <Grid item key={`delete-${phrase.id}`} sm={4}>
                <Button size="small" color="secondary" className={classes.actionIcon} onClick={() => { this.showDeleteModal() }}>
                  <DeleteIcon />
                </Button>
              </Grid>
            </Grid>
          </Card>
        :
          <Card className={classes.card}color="primary" >
            <CardContent className={classes.hoverCardContent} >
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
            </CardContent> 
            <Grid container spacing={0}>
              <Grid item key={`edit-${phrase.id}`} sm={6} className={classes.actionContainer}>
                <Button size="large" color="secondary" className={classes.actionIcon} onClick={() => { this.updatePhrase(phrase, textFieldValue)}}>Update</Button>
              </Grid>
              <Grid item key={`delete-${phrase.id}`} sm={6}>
                <Button size="large" color="secondary" className={classes.actionIcon} onClick={() => { this.exitEditPhrase()}}>Cancel</Button>
              </Grid>
            </Grid>

          </Card>
        }
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={showMoveModal}
          onClose={() => { this.handleMoveModalClose()}}
        >
          <Card className={classes.modal}color="primary" >
            <h2 id="simple-modal-title" className={classes.modalText}>{phrase.phrase}</h2>
            <p id="simple-modal-description" className={classes.modalText}>Manage which playlists should include the selected phrase</p>
            <Grid item key={"new-phrase-playlist-select"} sm={12} className={classes.playlistSelect}>
                <FormLabel component="legend" className={classes.modalText}>Playlists</FormLabel>
                <List component="div" disablePadding>
                    {memberPlaylists.map((playlist, playlistIndex) => (
                        <ListItem button key={playlistIndex}className={classes.nested} onClick={() => { this.toggleSelectPlaylist(memberPlaylists, playlistIndex); }}>
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
            <Grid container spacing={0}>
              <Grid item key={`edit-${phrase.id}`} sm={6} className={classes.actionContainer}>
                <Button size="large" color="secondary" className={classes.actionIcon} onClick={() => { this.updatePhrasePlaylists(phrase, memberPlaylists)}}>Update</Button>
              </Grid>
              <Grid item key={`delete-${phrase.id}`} sm={6}>
                <Button size="large" color="secondary" className={classes.actionIcon} onClick={() => { this.handleMoveModalClose()}}>Cancel</Button>
              </Grid>
            </Grid>
          </Card>
        </Modal>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={showDeleteModal}
          onClose={() => { this.handleDeleteModalClose()}}
        >
          <Card className={classes.modal} color="primary" >
            <h2 id="simple-modal-title" className={classes.modalText}>{phrase.phrase}</h2>
            <p id="simple-modal-description" className={classes.modalText}>Are you sure you want to remove this phrase from the {phrase.name} playlist?</p>
            <Grid container spacing={0}>
              <Grid item key={`edit-${phrase.id}`} sm={6} className={classes.actionContainer}>
                <Button size="large" color="secondary" className={classes.actionIcon} onClick={() => { this.deletePhrase(phrase.id, phrase.playlistId)}}>Delete</Button>
              </Grid>
              <Grid item key={`delete-${phrase.id}`} sm={6}>
                <Button size="large" color="secondary" className={classes.actionIcon} onClick={() => { this.handleDeleteModalClose()}}>Cancel</Button>
              </Grid>
            </Grid>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}


PhraseCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PhraseCard);
