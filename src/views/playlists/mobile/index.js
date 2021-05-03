import React, { useEffect, useState } from 'react';
import '../../../App.css';
import YourPlaylists from './YourPlaylists.js';
import PlaylistsYouFollow from './PlaylistsYouFollow';
import BrowsePlaylists from './BrowsePlaylists';
import { sortObjectsAlphabetically } from '../../../util/helperFunctions.js';

import {
  createPlaylistConnector,
  getFollowedPlaylistsConnector,
  getUserPlaylistsConnector,
  getAllPlaylistsConnector,
} from '../../../util/apiConnectors.js';

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
import PublicIcon from '@material-ui/icons/Public';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';

import theme from '../../../theme';

const playlistCard = { height: '125px', width: '125px', borderRadius:'50%', alignItems: 'center', backgroundColor:'#dae0e6', display: 'flex', justifyContent: 'center' };
const cardContainer = {justifyContent: 'center', display: 'grid'}

const Playlist = () => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = React.useState(false);
  const [loadingBrowsePlaylists, setLoadingBrowsePlaylists] = React.useState(true);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [topUserPlaylists, setTopUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);
  const [createPlaylistFormData, setCreatePlaylistFormData] = useState('');
  const [loadingFollowedPlaylists, setLoadingFollowedPlaylists] = React.useState(true);
  const [selectedFollowedPlaylist, setSelectedFollowedPlaylist] = React.useState(false);
  const [followedPlaylists, setFollowedPlaylists] = React.useState(['']);
  const [topFollowedPlaylists, setTopFollowedPlaylists] = React.useState([]);
  const [showYourPlaylists, setShowYourPlaylists] = React.useState(false);
  const [showPlaylistsYouFollow, setShowPlaylistsYouFollow] = React.useState(false);
  const [browsePlaylists, setBrowsePlaylists] = React.useState([]);
  const [topBrowsePlaylists, setTopBrowsePlaylists] = React.useState(['']);
  const [showBrowsePlaylists, setShowBrowsePlaylists] = React.useState(false);
  const [selectedBrowsePlaylist, setSelectedBrowsePlaylist] = React.useState(false);
  const [pageRefresh, setPageRefresh] = React.useState(false);

  const getPlaylists = async () => {
    try {
      let yourPlaylists = await getUserPlaylistsConnector();
      const yourMostRecentPlaylists = sortObjectsAlphabetically(yourPlaylists, "createdAt");
      const start = yourMostRecentPlaylists.length - 4;
      const end = yourMostRecentPlaylists.length;
      const yourTopPlaylists = yourMostRecentPlaylists.slice(start, end).reverse();
      yourPlaylists = yourPlaylists.reverse();
      setTopUserPlaylists(yourTopPlaylists);
      setUserPlaylists(yourPlaylists);
      setLoadingPlaylists(false);

      const followedPlaylists = await getFollowedPlaylistsConnector();
      const first4Followed = followedPlaylists.slice(0, 4);
      setTopFollowedPlaylists(first4Followed);
      setFollowedPlaylists(followedPlaylists);
      setLoadingFollowedPlaylists(false);

      const browsePlaylists = await getAllPlaylistsConnector();
      const first4browsePlaylists = browsePlaylists.slice(0, 4);
      setTopBrowsePlaylists(first4browsePlaylists);
      setBrowsePlaylists(browsePlaylists);
      setLoadingBrowsePlaylists(false);

    } catch(error) {
      console.error('[playlist] getPlaylists error', { error });
      setLoadingPlaylists(false);
      setLoadingFollowedPlaylists(false);
      setLoadingBrowsePlaylists(false);
    }
  }

  useEffect( () => {
    getPlaylists();
  }, []);

  const createPlaylist = async () => {
    try {
      if (!createPlaylistFormData) return;
      setLoadingCreatePlaylist(true);
      const createPlaylistInput ={ id: '', title: createPlaylistFormData, public: true, followers: [] }
      const { newPlaylist } = await createPlaylistConnector(createPlaylistInput, userPlaylists);
      setCreatePlaylistFormData('');
      setSelectedPlaylist(newPlaylist);
      setShowYourPlaylists(true);
      setLoadingCreatePlaylist(false);
    } catch (error) {
      setLoadingPlaylists(false);
      console.error('[playlist] createPlaylist error', { error });
    }
  }

  const toggleSelectedPlaylist = async (newPlaylist) => {
    if(!selectedPlaylist || newPlaylist.id !== selectedPlaylist.id){
      setSelectedPlaylist(newPlaylist);
      setShowYourPlaylists(true);
    }
  }

  const toggleSelectedFollowedPlaylist = async (newPlaylist) => {
    setSelectedFollowedPlaylist(newPlaylist);
    setShowPlaylistsYouFollow(true);
  }

  const toggleSelectedBrowsePlaylist = async (newPlaylist) => {
    setSelectedBrowsePlaylist(newPlaylist);
    setShowBrowsePlaylists(true);
  }

  const toggleShowYourPlaylists = () => {
    setShowYourPlaylists(!showYourPlaylists);
  }
  
  const togglePageRefresh = () => {
    setPageRefresh(!pageRefresh);
  }
  
  return (
    <div className='mobile-view-container'>
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
                      <IconButton fontSize='large' onClick={() => {
                        setShowYourPlaylists(false); 
                        setSelectedPlaylist(false);
                        setLoadingBrowsePlaylists(true); 
                        setLoadingFollowedPlaylists(true); 
                        setLoadingPlaylists(true); 
                        setShowPlaylistsYouFollow(false); 
                        setSelectedFollowedPlaylist(false);
                        getPlaylists(); 
                        }} style={{float: 'left', borderRadius:'5%'}}>
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
                          <IconButton 
                            onClick={() => { 
                              setLoadingBrowsePlaylists(true); 
                              setLoadingFollowedPlaylists(true); 
                              setShowPlaylistsYouFollow(false); 
                              setSelectedFollowedPlaylist(false);
                              getPlaylists(); 
                            }} 
                            style={{float: 'left', borderRadius:'5%'}}
                            fontSize='large'
                          >
                            <ChevronLeftIcon />
                            <Typography style={{float: 'left', paddingLeft:'8px'}}>All Playlists</Typography> 
                          </IconButton>
                        </Grid>
                          <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px'}}>
                            <Divider />
                          </Grid>   
                          <PlaylistsYouFollow selectedFollowedPlaylist={selectedFollowedPlaylist} playlistsYouFollow={followedPlaylists} />
                      </Grid>
                    </CardContent> 
                  }
                </Card>
              :
                <React.Fragment>
                  { showBrowsePlaylists ?
                    <Card position="fixed" >
                      { loadingBrowsePlaylists ?
                        <CardContent style={{height: '75vh'}}>
                          <div className="loading-container"> 
                            <CircularProgress />
                          </div>
                        </CardContent >
                      :
                        <CardContent >
                          <Grid container spacing={4} style={{paddingBottom:'16px'}} >
                            <Grid item xs={12} style={{paddingBottom:'8px'}}> 
                              <IconButton 
                                onClick={() => { 
                                  setLoadingBrowsePlaylists(true); 
                                  setLoadingFollowedPlaylists(true); 
                                  setShowBrowsePlaylists(false); 
                                  setSelectedBrowsePlaylist(false);
                                  getPlaylists(); 
                                }} 
                                style={{float: 'left', borderRadius:'5%'}}
                                fontSize='large'
                              >
                                <ChevronLeftIcon />
                                <Typography style={{float: 'left', paddingLeft:'8px'}}>All Playlists</Typography> 
                              </IconButton>
                            </Grid>
                              <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px'}}>
                                <Divider />
                              </Grid>   
                              <BrowsePlaylists selectedPlaylist={selectedBrowsePlaylist} playlists={browsePlaylists} togglePageRefresh={togglePageRefresh}/>
                          </Grid>
                        </CardContent> 
                      }
                    </Card>
                  :
                    <React.Fragment>
                      <Card position="fixed" style={{marginBottom:'32px'}} >
                        <CardContent >
                          <Grid container spacing={4}>
                            <Grid item xs={12} style={{paddingBottom: '0px'}}>
                              <Reorder fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                              <Typography variant='h4' style={{float: 'left', paddingTop:'6px'}}>Your Playlists</Typography>
                            </Grid>  
                            <Grid item xs={12}>
                              <Divider />
                            </Grid>
                            { loadingPlaylists ?
                              <Grid item xs={12}>
                                <div className="loading-container" style={{height: '203px'}}> 
                                  <CircularProgress />
                                </div>
                              </Grid >
                            :
                              <React.Fragment>
                                <Grid item xs={12}style={{paddingLeft:'32px', paddingRight:'32px'}} >
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
                                          color='secondary'
                                          style={{width:'100%',}}
                                        >Create</Button>
                                      }
                                    </Grid>
                                  </Grid>
                                </Grid>
                                { topUserPlaylists.map(p => (
                                  <Grid item key={p.id} xs={6} md={3} style={cardContainer}>
                                    <Card onClick={() => toggleSelectedPlaylist(p)} style={{ ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
                                      <CardContent  >
                                        <Typography>{p.title}</Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}
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
                      { followedPlaylists.length > 0 ?
                        <Card position="fixed" style={{marginBottom:'32px'}}>
                          <CardContent >
                            <Grid container spacing={4}>
                              <Grid item xs={12} style={{paddingBottom: '0px'}}>
                                <SubscriptionsIcon fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                                <Typography variant='h4' style={{float: 'left', paddingTop:'8px'}}>Playlists You Follow</Typography>
                              </Grid>  
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                              { loadingFollowedPlaylists ?
                                <Grid item xs={12}>
                                  <div className="loading-container" style={{height:'203px'}}> 
                                    <CircularProgress />
                                  </div>
                                </Grid >
                              :
                                <React.Fragment>
                                  <Grid item xs={12} >
                                    <Grid container spacing={4} >
                                    { topFollowedPlaylists.map(p => (
                                      <Grid item key={p.id} xs={6} md={2} style={cardContainer}>
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
                      :
                        null
                      }
                      {topBrowsePlaylists.length > 0 ?
                        <Card position="fixed" >
                          <CardContent >
                            <Grid container spacing={4}>
                              <Grid item xs={12} style={{paddingBottom: '0px'}}>
                              <PublicIcon fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                                <Typography variant='h4' style={{float: 'left', paddingTop:'7px'}}>Browse All Playlists</Typography>
                              </Grid>  
                              <Grid item xs={12}>
                                <Divider />
                              </Grid>
                              { loadingBrowsePlaylists ?
                                <Grid item xs={12}>
                                  <div className="loading-container" style={{height: '203px'}}> 
                                    <CircularProgress />
                                  </div>
                                </Grid >
                              :
                                <React.Fragment>
                                  <Grid item xs={12} >
                                    <Grid container spacing={4} >
                                    { topBrowsePlaylists.map(p => (
                                      <Grid item key={p.id} xs={6} md={2} style={cardContainer}>
                                        <Card onClick={() => toggleSelectedBrowsePlaylist(p)} style={{ ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
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
                                      onClick={() => setShowBrowsePlaylists(true)}
                                      color='primary'
                                      style={{width:'100%',}}
                                    >View All Playlists</Button>
                                  </Grid> 
                                </React.Fragment> 
                              }
                            </Grid>
                          </CardContent> 
                        </Card>
                      :
                        null
                      }
                    </React.Fragment>
                  }
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