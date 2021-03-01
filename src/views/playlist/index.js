import React, { useEffect, useState } from 'react';
import '../../App.css';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listPlaylists, listItems } from '../../graphql/queries';

import { 
  createPlaylist as createPlaylistMutation, 
  updateItem as updateItemMutation, 
  deletePlaylist as deletePlaylistMutation, 
  createItem as createItemMutation, 
  updatePlaylist as updatePlaylistMutation, 
  deleteItem as deleteItemMutation,
} from '../../graphql/mutations';

import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Modal,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography 
} from '@material-ui/core';
import { sortObjectsAlphabetically } from '../../util/helperFunctions.js';
import Reorder from '@material-ui/icons/PlaylistPlay';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import SearchIcon from '@material-ui/icons/Search';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import theme from '../../theme';


const initialCreatePlaylistFormData = { id: '', title: '', public: true, followers: [] }

const initialItemState = { id: '', content: ''}
const playlistCard = { height: '150px', width: '150px', alignItems: 'center'}
const playlistCardContent = { paddingTop:'62px'}
const cardHeaderStyle = { backgroundColor: theme.palette.primary.main, float:'left', color:'white', fontSize:'16px', width:'100%' }

const Playlist = () => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = React.useState(true);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = React.useState(false);
  const [loadingCreateItem, setLoadingCreateItem] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(null);
  const [playlistItems, setPlaylistItems] = React.useState([]);
  const [showCreatePlaylist, setShowCreatePlaylist ] = React.useState(false);
  const [createPlaylistFormData, setCreatePlaylistFormData] = useState(initialCreatePlaylistFormData);
  const [editPlaylistFormData, setEditPlaylistFormData] = useState(initialCreatePlaylistFormData);
  const [showEditPlaylist, setShowEditPlaylist ] = React.useState(false);
  const [showDeletePlaylist, setShowDeletePlaylist ] = React.useState(false);
  const [showCreateItem, setShowCreateItem ] = React.useState(false);
  const [showEditItem, setShowEditItem ] = React.useState('');
  const [createItemFormData, setCreateItemForm] = useState(initialItemState);
  const [editItemFormData, setEditItemFormData] = useState(initialItemState);


  useEffect(async () => {
    await fetchPlaylists();
    setLoadingPlaylists(false);
  }, [])


  const fetchPlaylists = async () => {
    try {
      const { username } = await Auth.currentUserInfo() 
      const  { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: { owner:  {eq: username} }}));
      const sortedData = sortObjectsAlphabetically(data.listPlaylists.items, "title");
      setUserPlaylists(sortedData);
      if(sortedData.length){
        setSelectedPlaylist(sortedData[0]);
        fetchPlaylistItems(sortedData[0])
      } 
    } catch(error) {
      console.error('[playlist-fetchPlaylists] error', { error });
    }
  }

  const fetchPlaylistItems = async (playlist) => {
    try {
      setLoadingPlaylistItems(true);
      const playlistId = playlist.id;
      const  { data } = await API.graphql(graphqlOperation(listItems, { filter: { itemPlaylistId: { eq: playlistId }}}));
      setPlaylistItems(data.listItems.items);
      setLoadingPlaylistItems(false);
    } catch(error) {
      setLoadingPlaylistItems(false);
      console.error('[playlist-fetchPlaylistItems] error', { error });
    }
}



  const createPlaylist = async () => {
    try {
      if (!createPlaylistFormData.title) return;
      setLoadingCreatePlaylist(true);
      const { username } = await Auth.currentUserInfo() 
      const createPlaylistInput = {title: createPlaylistFormData.title, public: true, followers: [username] }
      createPlaylistFormData.followers = [username]
      const { data } = await API.graphql({ query: createPlaylistMutation, variables: { input: createPlaylistInput } });
      let newPlaylist = data.createPlaylist
      newPlaylist['followers'] = [username];
      const newSortedData = sortObjectsAlphabetically([ ...userPlaylists, newPlaylist ], "title");

      setUserPlaylists(newSortedData);
      setCreatePlaylistFormData(initialCreatePlaylistFormData);
      setShowCreatePlaylist(!showCreatePlaylist);
      setPlaylistItems([])
      setSelectedPlaylist(newPlaylist)
      setLoadingCreatePlaylist(false);
    } catch (error) {
      setLoadingPlaylists(false);
      console.error('[playlists] createPlaylist error', { error });
    }

  }

  const createItem = async () => {
    try {
      if (!createItemFormData.content || !selectedPlaylist.id) return;
      setLoadingCreateItem(true);
      const createItemInput = { content: createItemFormData.content, itemPlaylistId: selectedPlaylist.id }
      const { data:createItemResult } = await API.graphql({ query: createItemMutation, variables: { input: createItemInput}});
      createItemFormData['id'] = createItemResult.createItem.id;
      setPlaylistItems([ ...playlistItems, createItemResult.createItem ]);
      setLoadingCreateItem(false);
      setShowCreateItem(!setShowCreateItem);
      setCreateItemForm(initialItemState);
    } catch (error) {
      console.error('[playlists] createItem error', { error });
    }
  }

  const updatePlaylist = async () => {
    try {
      const updatePlaylistInput ={ id: selectedPlaylist.id, title: editPlaylistFormData.title, public: editPlaylistFormData.public }
      const { data:updatePlaylist } = await API.graphql({ query: updatePlaylistMutation, variables: { input: updatePlaylistInput}});
      setShowEditPlaylist(false);
      setSelectedPlaylist(editPlaylistFormData);
    } catch (error) {
      console.error('[playlists] updatePlaylist error', { error });
    }
  }

  const deletePlaylist = async () => {
    
    try{

      if (!selectedPlaylist.id) return;
      const { id } = selectedPlaylist;
      await API.graphql({ query: deletePlaylistMutation, variables: { input: { id } }});
      const newUserPlaylistsArray = userPlaylists.filter(p => p.id !== id);
      setUserPlaylists(newUserPlaylistsArray);
      setShowDeletePlaylist(!showDeletePlaylist);
      if(newUserPlaylistsArray.length){
        setSelectedPlaylist(newUserPlaylistsArray[0]);
        fetchPlaylistItems(newUserPlaylistsArray[0])
      } 
      setSelectedPlaylist(newUserPlaylistsArray[0])
    } catch (error){
      console.error('[playlists] delete error', { error });
    }
  }

  const updateItem = async () => {
    try {
      const updateItemInput = { id: editItemFormData.id, content: editItemFormData.content }
      const { data:updateItem } = await API.graphql({ query: updateItemMutation, variables: { input: updateItemInput}});
      for (const i in playlistItems) {
        if (playlistItems[i].id == editItemFormData.id) {
          playlistItems[i].content = editItemFormData.content;
          break; 
        }
      }
      setShowEditItem('');
    } catch (error) {
      console.error('[playlists] updateItem error', { error });
    }
  }


  const deleteItem = async (id) => {
    try{
      console.log('delete item w/ id', id);
      const newplaylistItemsArray = playlistItems.filter(p => p.id !== id);
      setPlaylistItems(newplaylistItemsArray);
      const { data } = await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
      console.log('delete item ', data);

    } catch (error) {
    }
  }

  const toggleSelectedPlaylist = async (newPlaylist) => {

    if(newPlaylist.id !== selectedPlaylist.id){
      setSelectedPlaylist(newPlaylist);
      await fetchPlaylistItems(newPlaylist)
      setEditPlaylistFormData(newPlaylist)
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


  return (
    <div className='view-container'>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card position="fixed" style={{ backgroundColor: '#efefee' }}>
            <CardHeader
              avatar={<Reorder size='large' />}
              title={<span style={{float: 'left', fontSize:'24px'}}>Your Playlists</span>}
              style={cardHeaderStyle}
            />
            { loadingPlaylists ?
              <CardContent style={{height: '50vh'}}>
                <div className="loading-container"> 
                  <CircularProgress />
                </div>
              </CardContent >
            :
              <CardContent >
                <Grid container spacing={4} style={{marginBottom: '16px'}}>
                  <Grid item key={'create-playlist'} xs={12} md={2}>
                    <Card style={playlistCard}>
                        { showCreatePlaylist ?
                          <CardContent style={{paddingTop: '50px'}}>
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
                                  inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                                  inputProps={{style: { textAlign: 'center' }}}                              
                                />
                                <IconButton>                            
                                  <SaveOutlinedIcon onClick={createPlaylist}/>
                                </IconButton>                          
                                <IconButton>                            
                                  <CancelOutlinedIcon onClick={toggleShowCreatePlaylist}/>
                                </IconButton>
                              </React.Fragment>
                            }
                          </CardContent>
                          :
                          <CardContent style={{paddingTop: '50px'}}>
                            <IconButton>                            
                              <AddIcon onClick={toggleShowCreatePlaylist}/>
                            </IconButton>
                          </CardContent>
                        }

                    </Card>
                  </Grid>
                  { userPlaylists.map(p => (
                    <Grid item key={p.id} xs={12} md={2}>
                      <Card onClick={() => toggleSelectedPlaylist(p)} style={p.id === selectedPlaylist.id ? { ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'} : playlistCard}>
                        <CardContent  style={playlistCardContent}>
                          <Typography>{p.title}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  {selectedPlaylist ?
                    <React.Fragment>
                      <Grid item xs={12} style={{paddingBottom: '0px'}}>
                        <Divider style={{marginBottom: '16px'}}/>
                        <SearchIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                        <Typography variant='h4' style={{float: 'left', }}>{selectedPlaylist.title} Details</Typography>
                      </Grid>  
                      <Grid item xs={6} >
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
                              <TableCell>{selectedPlaylist.public.toString().charAt(0).toUpperCase() + selectedPlaylist.public.toString().slice(1)}</TableCell>                      
                              <TableCell>Followers:</TableCell>
                              <TableCell>{selectedPlaylist.followers.length - 1}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid item xs={2} >
                        <Card style={playlistCard}>
                          { showEditPlaylist ?
                            <CardContent >
                              <TextField
                                id="playlist-title-text-field"
                                onChange={e => setEditPlaylistFormData({ ...editPlaylistFormData, 'title': e.target.value})}
                                placeholder="New Item"
                                value={editPlaylistFormData.title}
                                label={'Edit Title'}
                                inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                                inputProps={{style: { textAlign: 'center' }}}                              
                              />
                              <Grid item xs={12} style={{paddingTop: '6px', paddingBottom:'0px'}}>
                                <Typography variant={'caption'} style={{float: 'left', paddingTop: '10px', paddingBottom: '4px', color:'gray'}}>Public: </Typography>
                                <Switch
                                  checked={editPlaylistFormData.public}
                                  onChange={e => setEditPlaylistFormData({ ...editPlaylistFormData, 'public': !editPlaylistFormData.public})}
                                  name="public"
                                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                                />
                              </Grid>
                              <IconButton style={{paddingTop: '4px', paddingBottom: '4px'}}>                            
                                <SaveOutlinedIcon onClick={updatePlaylist}/>
                              </IconButton>                          
                              <IconButton style={{paddingTop: '4px', paddingBottom: '4px'}}>                            
                                <CancelOutlinedIcon onClick={toggleShowEditPlaylist}/>
                              </IconButton>
                            </CardContent>
                            :
                            <CardContent style={{paddingTop: '50px'}}>
                              <IconButton size='large'>                            
                                <EditIcon onClick={toggleShowEditPlaylist}/>
                              </IconButton>
                            </CardContent>
                          }
                        </ Card>
                      </Grid>
                      <Grid item xs={2} >
                        <Card style={playlistCard}>
                          <CardContent style={{paddingTop: '50px'}}>
                            <IconButton size='large'>                            
                              <PublishIcon onClick={toggleShowDeletePlaylist}/>
                            </IconButton>
                          </CardContent>                        
                        </Card>
                      </Grid>
                      <Grid item xs={2} >
                        <Card style={playlistCard}>
                          <CardContent style={{paddingTop: '50px'}}>
                            <IconButton>                            
                              <DeleteIcon onClick={toggleShowDeletePlaylist}/>
                            </IconButton>
                          </CardContent>                        
                        </Card>
                      </Grid>
                      <Modal
                        open={showDeletePlaylist}
                        onClose={toggleShowDeletePlaylist}
                        aria-labelledby="delete-playlist-modal"
                        aria-describedby="delete-playlist-modal-description"
                      >
                        <Card className={"modal-card"}>
                          <CardContent className={"modal-card-content"}>
                            <Typography variant='h3' style={{marginBottom: '32px', marginTop: '16px'}}>Are you sure want to delete this playlist?</Typography>
                            <Typography variant='h1' style={{marginBottom: '32px'}}>{selectedPlaylist.title}</Typography>
                            { playlistItems.length > 0 ?
                            <Typography variant='h3' style={{marginBottom: '32px'}}>This will also delete all {playlistItems.length} of it's items</Typography>
                              :
                              null
                            }
                            <Button 
                              variant='contained'
                              style={{marginRight:'16px'}}
                              startIcon={<DeleteIcon />}
                              color='secondary'
                              onClick={deletePlaylist}
                            >Delete</Button>
                            <Button 
                              variant='contained' 
                              style={{marginLeft:'16px'}}
                              startIcon={<CancelOutlinedIcon />}
                              color='primary'
                              onClick={toggleShowDeletePlaylist}
                            >Cancel</Button>
                          </CardContent>                        
                        </Card>                    
                      </Modal>
                      <Grid item xs={12}>
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
                            <Grid item key={'create-item'} xs={12} md={2}>
                              <Card style={playlistCard}>
                                { showCreateItem ?
                                  <CardContent style={{paddingTop: '50px'}}>
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
                                            inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                                            inputProps={{style: { textAlign: 'center' }}}                              
                                          />
                                          <IconButton >                            
                                            <SaveOutlinedIcon onClick={createItem}/>
                                          </IconButton>                          
                                          <IconButton>                            
                                            <CancelOutlinedIcon onClick={toggleShowCreateItem}/>
                                          </IconButton>

                                        </React.Fragment>
                                    }
                                  </CardContent>
                                  :
                                  <CardContent style={{paddingTop: '50px'}}>
                                    <IconButton size='large'>                            
                                      <AddIcon onClick={toggleShowCreateItem}/>
                                    </IconButton>
                                  </CardContent>
                                }
                              </ Card>
                            </Grid>
                            { playlistItems.map(item => (
                              <Grid item key={item.id} xs={12} md={2}>
                                <Card style={playlistCard}>
                                  { showEditItem === item.id ?
                                    <CardContent >
                                      <Button   
                                        size='small'
                                        startIcon={<DeleteIcon />}
                                        onClick={() => deleteItem(item.id)}
                                        style={{marginBottom: '8px'}}
                                      >Delete</Button>
                                      <TextField
                                        id="playlist-title-text-field"
                                        onChange={e => setEditItemFormData({ ...editItemFormData, 'content': e.target.value})}
                                        value={editItemFormData.content}
                                        label={'Edit Item'}
                                        inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                                        inputProps={{style: { textAlign: 'center' }}}      
                                        style={{marginBottom: '8px'}}                        
                                      />

                                      <IconButton style={{paddingTop: '4px', paddingBottom: '4px'}}>                            
                                        <SaveOutlinedIcon onClick={updateItem}/>
                                      </IconButton>                          
                                      <IconButton style={{paddingTop: '4px', paddingBottom: '4px'}}>                            
                                        <CancelOutlinedIcon onClick={() => toggleShowEditItem({id: ''})}/>
                                      </IconButton>
                                    </CardContent>
                                    :
                                    <CardContent style={{paddingTop: '50px'}}>
                                      <IconButton size='large' onClick={() => toggleShowEditItem(item)}>                            
                                        <Typography>{item.content}</Typography>
                                      </IconButton>
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
                    null
                  }
                </Grid>
              </CardContent>
            }
          </Card>
        </Grid>
      </Grid>
    </div>
  );

}

export default Playlist;