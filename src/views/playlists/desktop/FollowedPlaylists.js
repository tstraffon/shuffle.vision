import React, { useEffect, useState } from 'react';
import '../../../App.css';

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
const playlistCard = { height: '150px', width: '150px', alignItems: 'center', backgroundColor:'#dae0e6', display: 'flex', justifyContent: 'center'  }
const cardContainer = {justifyContent: 'center', display: 'grid'}

const FollowedPlaylists = (props) => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = React.useState(false);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = React.useState(false);
  const [loadingCreateItem, setLoadingCreateItem] = React.useState(false);
  const [loadingUnfollowPlaylist, setLoadingUnfollowPlaylist] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
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
  const [selectedFollowedPlaylist, setSelectedFollowedPlaylist] = React.useState(false);
  const [followedPlaylists, setFollowedPlaylists] = React.useState([]);
  const [followedPlaylistItems, setFollowedPlaylistItems] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);


  useEffect( () => {
    async function getPlaylists (){
      try {
        console.log("props", props)
        if(props.selectedFollowedPlaylist){
          setSelectedFollowedPlaylist(props.selectedFollowedPlaylist);
        }
        const playlists = await getPlaylistsConnector();
        const yourPlaylists = playlists.slice(0, 4);
        await getFollowedPlaylists();

        setUserPlaylists(yourPlaylists);
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
      // if(followedPlaylists.length){
      //   setSelectedFollowedPlaylist(followedPlaylists[0]);
      //   getFollowedPlaylistItems(followedPlaylists[0])
      // } 
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
    <React.Fragment>  
      { loadingFollowedPlaylists ?
          <div style={{height:'25vh', width:'100%'}}>
            <div className="loading-container"> 
              <CircularProgress />
            </div>
          </div>
      :
        <React.Fragment>
          { selectedFollowedPlaylist ?
            <React.Fragment>
              <Grid item xs={12} style={{paddingBottom:'8px'}}> 
                <IconButton onClick={() => { setSelectedFollowedPlaylist(false);}} style={{float: 'left', paddingLeft:'32px', borderRadius:'5%'}}>
                  <ChevronLeftIcon />
                  <Typography style={{float: 'left', paddingLeft:'8px'}}>Playlists You Follow</Typography> 
                </IconButton>
              </Grid>
              <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px', paddingLeft:'32px'}}>
                <Divider />
              </Grid>   
              <Grid item xs={12} style={{paddingBottom: '0px'}}>
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
            <React.Fragment>
              <Grid item xs={12} style={{paddingBottom: '0px'}}>
                <PublicIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                <Typography variant='h4' style={{float: 'left', }}>Playlists You Follow</Typography>
              </Grid>
              { followedPlaylists.map(p => (
                <Grid item key={p.id} xs={12} md={2} style={cardContainer}>
                  <Card onClick={() => toggleSelectedFollowedPlaylist(p)} style={{ ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
                    <CardContent  >
                      <Typography>{p.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </React.Fragment>
          }
        </React.Fragment>
      }
    
    </React.Fragment>
  );

}

export default FollowedPlaylists; 