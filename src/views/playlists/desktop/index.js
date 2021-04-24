import React, { useEffect, useState } from 'react';
import '../../../App.css';
import FollowedPlaylists from './FollowedPlaylists.js';
import YourPlaylists from './YourPlaylists.js';

import { NavLink } from 'react-router-dom';

import {
  createPlaylistConnector,
  createItemConnector,
  deleteItemConnector,
  deletePlaylistConnector,
  getFollowedPlaylistsConnector,
  getFollowedPlaylistItemsConnector,
  getPlaylistsConnector,
  getPlaylistItemsConnector,
  updateItemConnector,
  updatePlaylistConnector,
  unfollowPlaylistConnector,
} from '../../../util/apiConnectors.js';

import { 
  AppBar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography 
} from '@material-ui/core';

import Reorder from '@material-ui/icons/PlaylistPlay';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PublicIcon from '@material-ui/icons/Public';
import SearchIcon from '@material-ui/icons/Search';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import theme from '../../../theme';

const initialCreatePlaylistFormData = { id: '', title: '', public: true, followers: [] }

const initialItemState = { id: '', content: ''}
const playlistCard = { height: '150px', width: '150px', borderRadius:'50%', alignItems: 'center', backgroundColor:'#dae0e6', display: 'flex', justifyContent: 'center'  }
const cardContainer = {justifyContent: 'center', display: 'grid'}

const Playlist = () => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = React.useState(false);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = React.useState(false);
  const [loadingCreateItem, setLoadingCreateItem] = React.useState(false);
  const [loadingUnfollowPlaylist, setLoadingUnfollowPlaylist] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [topUserPlaylists, setTopUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);
  const [playlistItems, setPlaylistItems] = React.useState([]);
  const [showCreatePlaylist, setShowCreatePlaylist ] = React.useState(false);
  const [createPlaylistFormData, setCreatePlaylistFormData] = useState('');
  const [editPlaylistFormData, setEditPlaylistFormData] = useState(initialCreatePlaylistFormData);
  const [showEditPlaylist, setShowEditPlaylist ] = React.useState(false);
  const [showDeletePlaylist, setShowDeletePlaylist ] = React.useState(false);
  const [showCreateItem, setShowCreateItem ] = React.useState(false);
  const [showEditItem, setShowEditItem ] = React.useState('');
  const [showItemActions, setShowItemActions] = React.useState('');
  const [createItemFormData, setCreateItemForm] = useState(initialItemState);
  const [editItemFormData, setEditItemFormData] = useState(initialItemState);
  const [loadingFollowedPlaylists, setLoadingFollowedPlaylists] = React.useState(true);
  const [loadingFollowedPlaylistItems, setLoadingFollowedPlaylistItems] = React.useState(true);
  const [selectedFollowedPlaylist, setSelectedFollowedPlaylist] = React.useState({});
  const [followedPlaylists, setFollowedPlaylists] = React.useState([]);
  const [followedPlaylistItems, setFollowedPlaylistItems] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [showYourPlaylists, setShowYourPlaylists] = React.useState(false);
  const [showPlaylistsYouFollow, setShowPlaylistsYouFollow] = React.useState(false);


  useEffect( () => {
    async function getPlaylists (){
      try {
        const yourPlaylists = await getPlaylistsConnector();
        const yourTopPlaylists = yourPlaylists.slice(0, 4);
        await getFollowedPlaylists();
        setTopUserPlaylists(yourTopPlaylists);
        setUserPlaylists(yourPlaylists);
        setLoadingPlaylists(false);
        setLoadingFollowedPlaylists(false);
      } catch(error) {
        console.error('[playlist] getPlaylists error', { error });
        setLoadingPlaylists(false);
        setLoadingFollowedPlaylists(false);
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
      setCreatePlaylistFormData('');
      setSelectedPlaylist(newPlaylist);
      setShowYourPlaylists(true);
      setLoadingCreatePlaylist(false);
    } catch (error) {
      setLoadingPlaylists(false);
      console.error('[playlist] createPlaylist error', { error });
    }
  }


  const getFollowedPlaylists = async () => {
    try {
      const followedPlaylists = await getFollowedPlaylistsConnector();
      const first6 = followedPlaylists.slice(0, 6);
      setFollowedPlaylists(first6);
      if(followedPlaylists.length){
        setSelectedFollowedPlaylist(followedPlaylists[0]);
        getFollowedPlaylistItems(followedPlaylists[0])
      } 
    } catch(error) {
      console.error('[playlist] getFollowedPlaylists error', { error });
    }
  }

  const getFollowedPlaylistItems = async (playlist) => {
    try {
      setLoadingFollowedPlaylistItems(true);
      const newFollowedPlaylistItems = await getFollowedPlaylistItemsConnector(playlist);
      setFollowedPlaylistItems(newFollowedPlaylistItems);
      setLoadingFollowedPlaylistItems(false);
    } catch(error) {
      setLoadingFollowedPlaylistItems(false);
      console.error('[playlist] getFollowedPlaylistItems error', { error });
    }
  }


  const toggleSelectedPlaylist = async (newPlaylist) => {
    if(!selectedPlaylist || newPlaylist.id !== selectedPlaylist.id){
      setSelectedPlaylist(newPlaylist);
      setShowYourPlaylists(true);
    }
  }

  const toggleSelectedFollowedPlaylist = async (newPlaylist) => {
    if(newPlaylist.id !== selectedFollowedPlaylist.id){
      setSelectedFollowedPlaylist(newPlaylist);
      setShowPlaylistsYouFollow(true);
    }
  }

  const toggleShowYourPlaylists = () => {
    setShowYourPlaylists(!showYourPlaylists);
  }

  return (
    <div className='view-container'>
      <Grid container spacing={4} >
        <Grid item xs={12} >
          { showYourPlaylists ?
            <Card position="fixed" >
              { loadingPlaylists ?
                <CardContent style={{height: '75vh'}}>
                  <div className="loading-container"> 
                    <CircularProgress />
                  </div>
                </CardContent >
              :
                <CardContent >
                  <Grid container spacing={4} style={{paddingBottom:'16px'}} >
                    <Grid item xs={12} style={{paddingBottom:'8px'}}> 
                      <IconButton onClick={() =>  { setShowYourPlaylists(false); setSelectedPlaylist(false) }} style={{float: 'left', borderRadius:'5%'}}>
                        <ChevronLeftIcon />
                        <Typography style={{float: 'left', paddingLeft:'8px'}}>All Playlists</Typography> 
                      </IconButton>
                    </Grid>
                      <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px'}}>
                        <Divider />
                      </Grid>   
                      <YourPlaylists selectedPlaylist={selectedPlaylist} userPlaylists={userPlaylists}/>
                  </Grid>
                </CardContent> 
              }
            </Card>
          :
            <React.Fragment>
              { showPlaylistsYouFollow ?
                <Card position="fixed" >
                  { loadingFollowedPlaylists ?
                    <CardContent style={{height: '75vh'}}>
                      <div className="loading-container"> 
                        <CircularProgress />
                      </div>
                    </CardContent >
                  :
                    <CardContent >
                      <Grid container spacing={4} style={{paddingBottom:'16px'}} >
                        <Grid item xs={12} style={{paddingBottom:'8px'}}> 
                          <IconButton onClick={() => { setShowPlaylistsYouFollow(false); setSelectedFollowedPlaylist(false);}} style={{float: 'left', borderRadius:'5%'}}>
                            <ChevronLeftIcon />
                            <Typography style={{float: 'left', paddingLeft:'8px'}}>All Playlists</Typography> 
                          </IconButton>
                        </Grid>
                          <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px'}}>
                            <Divider />
                          </Grid>   
                          <FollowedPlaylists selectedFollowedPlaylist={selectedFollowedPlaylist}/>
                      </Grid>
                    </CardContent> 
                  }
                </Card>
              :
                <React.Fragment>
                  <Card position="fixed" style={{marginBottom:'32px'}} >
                    <CardContent >
                      <Grid container spacing={4} style={{ overflow:'scroll', overflowX:'hidden'}}>
                        <Grid item xs={12} style={{paddingBottom: '0px'}}>
                          <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                          <Typography variant='h4' style={{float: 'left', }}>Your Playlists</Typography>
                        </Grid>  
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        { loadingPlaylists ?
                          <Grid item xs={12}>
                            <div className="loading-container" style={{height: '25vh'}}> 
                              <CircularProgress />
                            </div>
                          </Grid >
                        :
                          <React.Fragment>
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
                                  { loadingCreateItem ? 
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
                            <Grid item xs={8} >
                              <Grid container spacing={4} >
                                { topUserPlaylists.map(p => (
                                  <Grid item key={p.id} xs={12} md={3} style={cardContainer}>
                                    <Card onClick={() => toggleSelectedPlaylist(p)} style={{ ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
                                      <CardContent  >
                                        <Typography>{p.title}</Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                            </Grid>
                            
                            <Grid item xs={12} style={{paddingBottom: '0px'}}>
                              <Button 
                                onClick={() => toggleShowYourPlaylists()}
                                color='primary'
                                style={{width:'100%',}}
                              >View All Your Playlists</Button>
                            </Grid> 
                          </React.Fragment>
                        }
                      </Grid>
                    </CardContent> 
                  </Card>
                  <Card position="fixed" >
                    <CardContent >
                      <Grid container spacing={4} style={{ overflow:'scroll', overflowX:'hidden'}}>
                        <Grid item xs={12} style={{paddingBottom: '0px'}}>
                        <PublicIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                          <Typography variant='h4' style={{float: 'left', }}>Playlists You Follow</Typography>
                        </Grid>  
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        { loadingFollowedPlaylists ?
                          <Grid item xs={12}>
                            <div className="loading-container" style={{height: '25vh'}}> 
                              <CircularProgress />
                            </div>
                          </Grid >
                        :
                          <React.Fragment>
                            <Grid item xs={12} >
                              <Grid container spacing={4} >
                              { followedPlaylists.map(p => (
                                <Grid item key={p.id} xs={12} md={2} style={cardContainer}>
                                  <Card onClick={() => toggleSelectedFollowedPlaylist(p)} style={{ ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
                                    <CardContent  >
                                      <Typography>{p.title}</Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                              </Grid>
                            </Grid>
                            <Grid item xs={12} style={{paddingBottom: '0px'}}>
                              <Button 
                                onClick={() => setShowPlaylistsYouFollow(true)}
                                color='primary'
                                style={{width:'100%',}}
                              >View All Playlists You Follow</Button>
                            </Grid> 
                          </React.Fragment> 
                        }
                      </Grid>
                    </CardContent> 
                  </Card>
                </React.Fragment>
              }
            </React.Fragment>
           
          }
          </Grid>
      </Grid>
    </div>
  );

}

export default Playlist; 