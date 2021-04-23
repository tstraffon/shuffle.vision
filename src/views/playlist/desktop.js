import React, { useEffect, useState } from 'react';
import '../../App.css';

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
} from '../../util/apiConnectors.js';

import { 
  AppBar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
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
import theme from '../../theme';

const initialCreatePlaylistFormData = { id: '', title: '', public: true, followers: [] }

const initialItemState = { id: '', content: ''}
const playlistCard = { height: '150px', width: '150px', alignItems: 'center', backgroundColor:'#dae0e6', display: 'flex', justifyContent: 'center'  }
const cardContainer = {justifyContent: 'center', display: 'grid'}

const Playlist = () => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = React.useState(false);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = React.useState(false);
  const [loadingCreateItem, setLoadingCreateItem] = React.useState(false);
  const [loadingUnfollowPlaylist, setLoadingUnfollowPlaylist] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);
  const [playlistItems, setPlaylistItems] = React.useState([]);
  const [showCreatePlaylist, setShowCreatePlaylist ] = React.useState(false);
  const [createPlaylistFormData, setCreatePlaylistFormData] = useState(initialCreatePlaylistFormData);
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
  const [selectedFollowedPlaylist, setSelectedFollowedPlaylist] = React.useState(null);
  const [followedPlaylists, setFollowedPlaylists] = React.useState([]);
  const [followedPlaylistItems, setFollowedPlaylistItems] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);


  useEffect( () => {
    async function getPlaylists (){
      try {
        const playlists = await getPlaylistsConnector();
        setUserPlaylists(playlists);
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
      if (!createPlaylistFormData.title) return;
      setLoadingCreatePlaylist(true);
      const { newPlaylist, newUserPlaylists} = await createPlaylistConnector(createPlaylistFormData, userPlaylists);
      setUserPlaylists(newUserPlaylists);
      setCreatePlaylistFormData(initialCreatePlaylistFormData);
      setShowCreatePlaylist(!showCreatePlaylist);
      setPlaylistItems([]);
      setSelectedPlaylist(newPlaylist);
      setLoadingCreatePlaylist(false);
    } catch (error) {
      setLoadingPlaylists(false);
      console.error('[playlist] createPlaylist error', { error });
    }
  }

  const createItem = async () => {
    try {
      if (!createItemFormData.content || !selectedPlaylist.id) return;
      setLoadingCreateItem(true);
      const createdItem = await createItemConnector(createItemFormData.content, selectedPlaylist)
      createItemFormData['id'] = createdItem.createItem.id;
      setPlaylistItems([ ...playlistItems, createdItem.createItem ]);
      setLoadingCreateItem(false);
      setShowCreateItem(!setShowCreateItem);
      setCreateItemForm(initialItemState);
    } catch (error) {
      console.error('[playlist] createItem error', { error });
    }
  }

  const updatePlaylist = async () => {
    try {
      await updatePlaylistConnector(selectedPlaylist, editPlaylistFormData);
      setShowEditPlaylist(false);
      setSelectedPlaylist(editPlaylistFormData);
      let newUserPlaylists = userPlaylists;
      for (const p in userPlaylists) {
        if (newUserPlaylists[p].id === editPlaylistFormData.id) {
          newUserPlaylists[p] = editPlaylistFormData;
          break; 
        }
      }
      setUserPlaylists(newUserPlaylists);
    } catch (error) {
      console.error('[playlist] updatePlaylist error', { error });
    }
  }

  const deletePlaylist = async () => {
    try{
      if (!selectedPlaylist.id) return;
      await deletePlaylistConnector(selectedPlaylist);
      const newUserPlaylistsArray = userPlaylists.filter(p => p.id !== selectedPlaylist.id);
      setUserPlaylists(newUserPlaylistsArray);
      setShowDeletePlaylist(!showDeletePlaylist);
      setSelectedPlaylist(false)
    } catch (error){
      console.error('[playlist] deletePlaylist error', { error });
    }
  }

  const updateItem = async () => {
    try {
      await updateItemConnector(editItemFormData)
      for (const i in playlistItems) {
        if (playlistItems[i].id === editItemFormData.id) {
          playlistItems[i].content = editItemFormData.content;
          break; 
        }
      }
      setShowEditItem('');
    } catch (error) {
      console.error('[playlist] updateItem error', { error });
    }
  }

  const deleteItem = async (itemId) => {
    try{
      console.log('deleteItem', itemId)
      await deleteItemConnector(itemId); 
      const newplaylistItemsArray = playlistItems.filter(p => p.id !== itemId);
      setPlaylistItems(newplaylistItemsArray);
    } catch (error) {
      console.error('[playlist] deleteItem error', { error });
    }
  }

  const getFollowedPlaylists = async () => {
    try {
      const followedPlaylists = await getFollowedPlaylistsConnector();
      setFollowedPlaylists(followedPlaylists);
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

  const unfollowPlaylist = async (playlist) => {
    try{
      setLoadingUnfollowPlaylist(true);
      const newFollowedPlaylistsArray = await unfollowPlaylistConnector(playlist, followedPlaylists);
      setFollowedPlaylists(newFollowedPlaylistsArray);
      if(newFollowedPlaylistsArray.length){ 
        setSelectedFollowedPlaylist(newFollowedPlaylistsArray[0]);       
        getFollowedPlaylistItems(newFollowedPlaylistsArray[0]);
      } else {
        setSelectedFollowedPlaylist(false);
      }
      setLoadingUnfollowPlaylist(false);
    } catch (error){
      console.error('[playlis] unfollowPlaylist error', { error });
      setLoadingUnfollowPlaylist(false);
    }
  }

  const toggleSelectedPlaylist = async (newPlaylist) => {
    if(!selectedPlaylist || newPlaylist.id !== selectedPlaylist.id){
      setLoadingPlaylistItems(true);
      setSelectedPlaylist(newPlaylist);
      const newPlaylistItems = await getPlaylistItemsConnector(newPlaylist);
      setPlaylistItems(newPlaylistItems);
      setLoadingPlaylistItems(false);
      setEditPlaylistFormData(newPlaylist)
    }
  }

  const toggleSelectedFollowedPlaylist = async (newPlaylist) => {
    if(newPlaylist.id !== selectedFollowedPlaylist.id){
      setSelectedFollowedPlaylist(newPlaylist);
      await getFollowedPlaylistItems(newPlaylist)
    }
  }

  const toggleShowCreatePlaylist = () => {
    setShowCreatePlaylist(!showCreatePlaylist);
  }


  const toggleShowEditPlaylist = () => {
    setEditPlaylistFormData(selectedPlaylist)
    setShowEditPlaylist(!showEditPlaylist);
  }

  const toggleShowDeletePlaylist = () => {
    setShowDeletePlaylist(!showDeletePlaylist);
  }

  const toggleShowCreateItem = () => {
    setShowCreateItem(!showCreateItem);
  }

  const toggleShowEditItem = (item) => {
    setEditItemFormData(item)
    setShowEditItem(item.id);
  }

  const toggleShowItemActions = (item) => {
    setShowItemActions(item.id);
  }

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleTabChange = async (event, newTabValue) => {
    setTabValue(newTabValue);
    if(newTabValue === 1 && !followedPlaylists.length){
      setLoadingFollowedPlaylists(true);
      await getFollowedPlaylists();
      setLoadingFollowedPlaylists(false);
    }
  };


  return (
    <div className='view-container'>
      <Grid container spacing={4} >
        <Grid item xs={12} >
          <Card position="fixed" >
            <AppBar position="static" style={{height: '4em'}}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="playlist tabs" variant="fullWidth">
                <Tab label="Your Playlists" {...a11yProps(0)} style={{textTransform: 'none', fontSize: '1.6em',  height: '4em', paddingBottom:'1.75em'}}/>
                <Tab label={"Playlists You Follow"} {...a11yProps(1)} style={{textTransform: 'none', fontSize: '1.6em', height:'4em',  paddingBottom:'1.75em'}}/>
              </Tabs>
            </AppBar>
            { tabValue === 0 ?
              <React.Fragment>
                { loadingPlaylists ?
                  <CardContent style={{height: '75vh'}}>
                    <div className="loading-container"> 
                      <CircularProgress />
                    </div>
                  </CardContent >
                :
                  <CardContent >
                    <Grid container spacing={4} style={{ overflow:'scroll', overflowX:'hidden'}}>
                      {selectedPlaylist ?
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom:'8px'}}> 
                            <IconButton onClick={() =>  setSelectedPlaylist(false)} style={{float: 'left'}}>
                              <ChevronLeftIcon />
                              <Typography style={{float: 'left', paddingLeft:'8px'}}>Your Playlists</Typography> 
                            </IconButton>
                          </Grid>
                          <Grid item xs={12} style={{paddingBottom:'24px', paddingTop:'0px'}}>
                            <Divider />
                          </Grid>       
                          <Grid item xs={6} style={{paddingTop: '0px'}} >
                            <SearchIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                            {showEditPlaylist ? 
                              <React.Fragment>
                                <TextField
                                  id="playlist-title-text-field"
                                  onChange={e => setEditPlaylistFormData({ ...editPlaylistFormData, 'title': e.target.value})}
                                  placeholder="New Item"
                                  value={editPlaylistFormData.title}
                                  // label={'Edit Title'}
                                  inputProps={{style: { float: 'left', paddingRight:'16px'}}}  
                                  style={{float:'left'}}                            
                                />
                                <IconButton onClick={() => toggleShowEditPlaylist()} style={{float: 'right', paddingRight:'16px', top:'-8px'}}>
                                  <CancelOutlinedIcon />
                                </IconButton>
                                <IconButton onClick={() => updatePlaylist()} style={{float: 'right', paddingRight:'16px', top:'-8px'}}>
                                  <SaveOutlinedIcon />
                                </IconButton>
                              </React.Fragment>
                            : 
                              <React.Fragment>
                                <Typography variant='h4' style={{float: 'left', paddingRight:'16px'}}>{selectedPlaylist.title}</Typography>
                                <IconButton onClick={() => toggleShowDeletePlaylist()} style={{float: 'right', paddingRight:'16px', top:'-8px'}}>
                                  <DeleteIcon/>
                                </IconButton>
                                <IconButton onClick={() => toggleShowEditPlaylist()} style={{float: 'right', paddingRight:'16px', top:'-8px'}}>
                                  <EditIcon/>
                                </IconButton>
                              </React.Fragment>
                            }
                            <Table>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Owner: </TableCell>
                                  <TableCell >{selectedPlaylist.owner}</TableCell>
                                  <TableCell>Created At:</TableCell>
                                  <TableCell>{selectedPlaylist.createdAt.toString().slice(0, 10)}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>Item Count: </TableCell>
                                  <TableCell>{playlistItems.length}</TableCell>
                                  <TableCell>Last Updated:</TableCell>
                                  <TableCell>{selectedPlaylist.updatedAt.toString().slice(0, 10)}</TableCell>
                                </TableRow>
                                <TableRow style={{borderBottom: 'hidden'}}>
                                  <TableCell>Public:</TableCell>
                                  <TableCell style={{height:'19px'}}>{showEditPlaylist ?   
                                      <React.Fragment>
                                        False
                                        <Switch
                                          checked={editPlaylistFormData.public}
                                          onChange={e => setEditPlaylistFormData({ ...editPlaylistFormData, 'public': !editPlaylistFormData.public})}
                                          name="public"
                                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        /> 
                                        True
                                      </React.Fragment>                               
                                    : 
                                      <React.Fragment>
                                         {selectedPlaylist.public.toString().charAt(0).toUpperCase() + selectedPlaylist.public.toString().slice(1)}
                                      </React.Fragment>
                                    }
                                  </TableCell>                      
                                  <TableCell>Followers:</TableCell>
                                  <TableCell>{selectedPlaylist.followers.length - 1}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Grid>
                          { showDeletePlaylist ? 
                            <Grid item xs={6}>
                              <Grid container spacing={4}>
                                <Grid item xs={12}>
                                  <Typography variant='h3'>Are you sure want to delete this playlist?</Typography>
                                </Grid>
                                <Grid item xs={12} style={{paddingTop: '0px'}} >
                                  <Typography variant='h1'>{selectedPlaylist.title}</Typography>
                                </Grid>
                                <Grid item xs={12} style={{paddingTop: '0px'}} >
                                  { playlistItems.length > 0 ?
                                    <Typography variant='h3'>This will also delete all {playlistItems.length} of it's items</Typography>
                                  :
                                    null
                                  }
                                </Grid>
                                <Grid item xs={3} />
                                <Grid item key={"cancel"} xs={3} style={{paddingTop: '0px'}} >
                                  <Button onClick={() => toggleShowDeletePlaylist()} startIcon={<CancelOutlinedIcon />} style={{width:'100%', height:'100%'}}>Cancel</Button>
                                </Grid>
                                <Grid item key={"delete"} xs={3}  style={{paddingTop: '0px'}} >
                                  <Button onClick={() => deletePlaylist()} startIcon={<DeleteIcon />} variant="contained" color="primary" style={{width:'100%', height:'100%'}}>Delete</Button>
                                </Grid>
                                <Grid item xs={3} />
                              </Grid>
                            </Grid>
                          :
                            null
                          }
                          <Grid item xs={12} >
                            <Divider style={{marginBottom: '16px'}}/>
                            <FeaturedPlayListOutlinedIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                            <Typography variant='h4' style={{float: 'left', marginBottom: '16px'}}>{selectedPlaylist.title} Items</Typography>
                            { loadingPlaylistItems ?
                              <div style={{height:'25vh', width:'80%'}}>
                                <div className="loading-container"> 
                                  <CircularProgress />
                                </div>
                              </div>
                              :
                              <Grid container spacing={4} style={{marginBottom: '16px'}}>
                                <Grid item key={'create-item'} xs={12} md={2} style={cardContainer}>
                                  { showCreateItem ?
                                    <Card style={playlistCard}>
                                      <CardContent >
                                        { loadingCreateItem ?
                                            <div className="loading-container"> 
                                              <CircularProgress />
                                            </div>
                                          :
                                            <React.Fragment>
                                              <TextField
                                                id="new-item-text-field"
                                                onChange={e => setCreateItemForm({ ...createItemFormData, 'content': e.target.value})}
                                                placeholder="New Item"
                                                value={createItemFormData.title}
                                                inputProps={{style: { textAlign: 'center' }}}                              
                                              />
                                              <IconButton >                            
                                                <SaveOutlinedIcon onClick={() => createItem()}/>
                                              </IconButton>                          
                                              <IconButton>                            
                                                <CancelOutlinedIcon onClick={() => toggleShowCreateItem()}/>
                                              </IconButton>

                                            </React.Fragment>
                                        }
                                      </CardContent>
                                    </Card>
                                    :
                                    <Card style={playlistCard} onClick={() => toggleShowCreateItem()}>
                                      <CardContent>
                                        <IconButton>                            
                                          <AddIcon />
                                        </IconButton>
                                      </CardContent>
                                    </ Card>
                                  }
                                </Grid>
                                { playlistItems.map(item => (
                                  <Grid item key={item.id} xs={12} md={2} style={cardContainer}>
                                    <Card style={{...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF', }}>
                                      { showEditItem === item.id ?
                                        <CardContent>
                                          <TextField
                                            id="playlist-title-text-field"
                                            onChange={e => setEditItemFormData({ ...editItemFormData, 'content': e.target.value})}
                                            value={editItemFormData.content}
                                            inputProps={{style: { 'aria-label': 'bare', textAlign: 'center', color:'#FFF' }}}      
                                          />
                                          <IconButton style={{color:'#FFF'}}>                            
                                            <SaveOutlinedIcon onClick={() => updateItem()}/>
                                          </IconButton>                          
                                          <IconButton style={{color:'#FFF'}}>                            
                                            <CancelOutlinedIcon onClick={() => toggleShowEditItem({id: ''})}/>
                                          </IconButton>
                                        </CardContent>
                                        :
                                        <CardContent onMouseEnter={() => toggleShowItemActions(item)} onMouseLeave={() => toggleShowItemActions({id: ''})}>
                                          <Typography>{item.content}</Typography>
                                          { showItemActions === item.id ?
                                            <React.Fragment >
                                              <IconButton style={{color:'#FFF'}}>                            
                                                <EditIcon onClick={() => toggleShowEditItem(item)}/>
                                              </IconButton>                          
                                              <IconButton style={{color: '#FFF'}}>                            
                                                <DeleteIcon onClick={() => deleteItem(item.id)}/>
                                              </IconButton>

                                            </React.Fragment>
                                            :
                                            null
                                          }
                                        </CardContent>
                                      }
                                    </ Card>
                                  </Grid>
                                ))}
                              </Grid> 
                            }
                          </Grid>
                        </React.Fragment>
                      :
                        <React.Fragment>
                           <Grid item xs={12} style={{paddingBottom: '0px'}}>
                              <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                              <Typography variant='h4' style={{float: 'left', }}>Your Playlists</Typography>
                            </Grid>  
                            <Grid item key={'create-playlist'} xs={12} md={2} style={cardContainer}>
                              { showCreatePlaylist ?
                                <Card style={playlistCard}>
                                  <CardContent >
                                    { loadingCreatePlaylist ?
                                        <div className="loading-container"> 
                                          <CircularProgress />
                                        </div>
                                      :
                                      <React.Fragment>
                                        <TextField
                                          id="playlist-title-text-field"
                                          onChange={e => setCreatePlaylistFormData({ ...createPlaylistFormData, 'title': e.target.value})}
                                          placeholder="New Playlist"
                                          value={createPlaylistFormData.title}
                                          inputProps={{style: { textAlign: 'center' }}}                              
                                        />
                                        <IconButton>                            
                                          <SaveOutlinedIcon onClick={() => createPlaylist()}/>
                                        </IconButton>                          
                                        <IconButton>                            
                                          <CancelOutlinedIcon onClick={() => toggleShowCreatePlaylist()}/>
                                        </IconButton>
                                      </React.Fragment>
                                    }
                                  </CardContent>
                                </Card>
                                :
                                <Card style={playlistCard} onClick={() => toggleShowCreatePlaylist()}>
                                  <CardContent >
                                    <IconButton>                            
                                      <AddIcon/>
                                    </IconButton>
                                  </CardContent>
                                </Card>
                              }
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
                        </React.Fragment>
                      }
                    </Grid>
                
                </CardContent> 
              }
            </React.Fragment>  
          :
            <React.Fragment>
              { loadingFollowedPlaylists ?
                <CardContent style={{height: '75vh'}}>
                  <div className="loading-container"> 
                    <CircularProgress />
                  </div>
                </CardContent >
              :
                <CardContent >
                  <Grid container spacing={4} style={{marginBottom: '16px'}}>
                    <Grid item xs={12} style={{paddingBottom: '0px'}}>
                      <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                      <Typography variant='h4' style={{float: 'left', }}>Playlists</Typography>
                    </Grid>  
                    <Grid item key={"browse-card"} xs={12} md={2} style={cardContainer}>
                      <Card component={NavLink} to={"/browse"} style={playlistCard}>
                        <CardContent  >
                          <IconButton>                            
                            <PublicIcon />
                          </IconButton>
                        </CardContent>
                      </Card>
                    </Grid>
                    { followedPlaylists.map(p => (
                      <Grid item key={p.id} xs={12} md={2} style={cardContainer}>
                        <Card onClick={() => toggleSelectedFollowedPlaylist(p)} style={p.id === selectedFollowedPlaylist.id ? { ...playlistCard, backgroundColor: theme.palette.secondary.main, color:'#000'} : { ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
                          <CardContent  >
                            <Typography>{p.title}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    {selectedFollowedPlaylist ?
                      <React.Fragment>
                        <Grid item xs={12} style={{paddingBottom: '0px'}}>
                          <Divider style={{marginBottom: '16px'}}/>
                          <SearchIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                          <Typography variant='h4' style={{float: 'left', }}>{selectedFollowedPlaylist.title} Details</Typography>
                          { loadingUnfollowPlaylist ?
                              <div className="loading-container" style={{float: 'right', marginRight: '64px', top:'0',}} > 
                                <CircularProgress />
                              </div>
                            :
                            <Button     
                              size='medium'
                              startIcon={<CancelOutlinedIcon />}
                              onClick={() => unfollowPlaylist(selectedFollowedPlaylist)}
                              style={{float: 'right', marginRight: '16px'}}
                            >Unfollow Playlist</Button>
                            }
                        </Grid>  
                        <Grid item xs={6} >
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell>Owner: </TableCell>
                                <TableCell >{selectedFollowedPlaylist.owner}</TableCell>
                                <TableCell>Created At:</TableCell>
                                <TableCell>{selectedFollowedPlaylist.createdAt.toString().slice(0, 10)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Item Count: </TableCell>
                                <TableCell>{followedPlaylistItems.length}</TableCell>
                                <TableCell>Last Updated:</TableCell>
                                <TableCell>{selectedFollowedPlaylist.updatedAt.toString().slice(0, 10)}</TableCell>
                              </TableRow>
                              <TableRow style={{borderBottom: 'hidden'}}>
                                <TableCell>Public:</TableCell>
                                <TableCell>{selectedFollowedPlaylist.public.toString().charAt(0).toUpperCase() + selectedFollowedPlaylist.public.toString().slice(1)}</TableCell>                      
                                <TableCell>Followers:</TableCell>
                                <TableCell>{selectedFollowedPlaylist.followers.length - 1}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider style={{marginBottom: '16px'}}/>
                          <FeaturedPlayListOutlinedIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                          <Typography variant='h4' style={{float: 'left', marginBottom: '16px'}}>{selectedFollowedPlaylist.title} Items</Typography>
                          { loadingFollowedPlaylistItems ?
                            <div style={{height:'25vh', width:'80%'}}>
                              <div className="loading-container"> 
                                <CircularProgress />
                              </div>
                            </div>
                            :
                            <Grid container spacing={4} style={{marginBottom: '16px'}}>
                              { followedPlaylistItems.map(item => (
                                <Grid item key={item.id} xs={12} md={2} style={cardContainer}>
                                  <Card style={{...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF', }}>
                                    <CardContent>
                                        <Typography>{item.content}</Typography>
                                      </CardContent>
                                  </ Card>
                                </Grid>
                              ))}
                            </Grid> 
                          }
                        </Grid>
                      </React.Fragment>
                    :
                      null
                    }
                  </Grid>
                </CardContent>
                }
              </React.Fragment>
            }
          </Card>
        </Grid>
      </Grid>
    </div>
  );

}

export default Playlist; 