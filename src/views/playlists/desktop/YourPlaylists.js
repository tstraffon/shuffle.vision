import React, { useEffect, useState } from 'react';
import '../../../App.css';
import YourPlaylistDetails from './YourPlaylistDetails.js';
import { createPlaylistConnector, getPlaylistsConnector } from '../../../util/apiConnectors.js';

import { 
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Typography 
} from '@material-ui/core';

import Reorder from '@material-ui/icons/PlaylistPlay';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import theme from '../../../theme';

const playlistCard = { height: '150px', width: '150px', borderRadius:'50%',alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF',  display: 'flex', justifyContent: 'center'  }
const cardContainer = {justifyContent: 'center', display: 'grid'}

const YourPlaylists = (props) => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist ] = React.useState(false);
  const [createPlaylistFormData, setCreatePlaylistFormData] = useState('');

  useEffect( () => {
    async function getPlaylists (){
      try {
        console.log('props', props);
        if(props.selectedPlaylist){
          setSelectedPlaylist(props.selectedPlaylist);
          setLoadingPlaylists(false);
        }
        setUserPlaylists(props.userPlaylists);
        setLoadingPlaylists(false);
      } catch(error) {
        console.error('[playlist] getPlaylists error', { error });
        setLoadingPlaylists(false);
      }
    }
    getPlaylists();
  }, []);


  const createPlaylist = async () => {
    try {
      if (!createPlaylistFormData) return;
      setLoadingCreatePlaylist(true);
      const createPlaylistInput ={ id: '', title: createPlaylistFormData, public: true, followers: [] }
      const { newPlaylist, newUserPlaylists} = await createPlaylistConnector(createPlaylistInput, userPlaylists);
      setUserPlaylists(newUserPlaylists);
      setCreatePlaylistFormData('');
      setShowCreatePlaylist(!showCreatePlaylist);
      setSelectedPlaylist(newPlaylist);
      setLoadingCreatePlaylist(false);
    } catch (error) {
      setLoadingPlaylists(false);
      console.error('[playlist] createPlaylist error', { error });
    }
  }

  const toggleSelectedPlaylist = async (newPlaylist) => {
    if(!selectedPlaylist || newPlaylist.id !== selectedPlaylist.id){
      setSelectedPlaylist(newPlaylist);
    }
  }

  const resetStateOnPlaylistDelete = (playlistId) => {
    setSelectedPlaylist(false);
    setLoadingPlaylists(true);
    const newUserPlaylistsArray = userPlaylists.filter(p => p.id !== playlistId);
    setUserPlaylists(newUserPlaylistsArray);
    setLoadingPlaylists(false);
  }


  return (
    <React.Fragment>
      { loadingPlaylists ?
        <Grid item xs={12} style={{paddingBottom:'8px', height:'75vh'}}> 
          <div className="loading-container"> 
            <CircularProgress />
          </div>
        </Grid>
      :
        <React.Fragment>
          {selectedPlaylist ?
            <React.Fragment>
              <Grid item xs={12} style={{paddingBottom:'8px'}}> 
                <IconButton onClick={() =>  setSelectedPlaylist(false)} style={{float: 'left', paddingLeft:'32px', borderRadius:'5%'}}>
                  <ChevronLeftIcon />
                  <Typography style={{float: 'left', paddingLeft:'8px'}}>Your Playlists</Typography> 
                </IconButton>
              </Grid>    
              <Grid item xs={12} style={{ paddingTop:'0px', paddingLeft:'32px'}}>
                <Divider />
              </Grid>   
              <YourPlaylistDetails selectedPlaylist={selectedPlaylist} resetStateOnPlaylistDelete={resetStateOnPlaylistDelete}/>
            </React.Fragment>
          :
            <React.Fragment>
              <Grid item xs={12} style={{marginBottom:'16px'}} >
                <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                <Typography variant='h4' style={{float: 'left', }}>Your Playlists</Typography>
              </Grid>  
              <Grid container spacing={4} >
                <Grid item xs={4} style={{paddingLeft:'32px', paddingRight:'32px'}} >
                  <FormControl component="fieldset" style={{width:'100%'}}>
                    <FormLabel component="legend" style={{paddingBottom: '8px', display:'flex', float:'left'}}>Create New Playlist</FormLabel>
                    <TextField
                      id="create-item-text-field"
                      variant="outlined"
                      onChange={e => setCreatePlaylistFormData(e.target.value)}
                      value={createPlaylistFormData}
                      style={{marginBottom:'16px'}}
                    />
                  </FormControl>
                  <Grid container spacing={4} >
                    <Grid item xs={6}>
                      <Button 
                        onClick={() => setCreatePlaylistFormData('')}
                        variant="outlined"
                        style={{width:'100%'}}
                      >Clear</Button>
                    </Grid>
                    <Grid item xs={6} >
                      { loadingCreatePlaylist ? 
                        <div className="loading-container">
                          <CircularProgress />
                        </div>
                      :
                        <Button 
                          onClick={() => createPlaylist()}
                          variant="contained"
                          color='primary'
                          style={{width:'100%',}}
                        >Submit</Button>
                      }
                    </Grid>
                  </Grid>
                </Grid>
                { userPlaylists.map(p => (
                  <Grid item key={p.id} xs={12} md={2} style={cardContainer}>
                    <Card onClick={() => toggleSelectedPlaylist(p)} style={{ ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
                      <CardContent  >
                        <Typography>{p.title}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </React.Fragment>
          }          
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default YourPlaylists; 