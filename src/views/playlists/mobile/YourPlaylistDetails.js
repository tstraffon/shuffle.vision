import React, { useEffect, useState } from 'react';
import '../../../App.css';

import {
  createItemConnector,
  deleteItemConnector,
  deletePlaylistConnector,
  updateItemConnector,
  updatePlaylistConnector,
} from '../../../util/apiConnectors.js';

import { 
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  FormControl,
  FormLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography 
} from '@material-ui/core';

import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined'
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import theme from '../../../theme';

const initialCreatePlaylistFormData = { id: '', title: '', public: true, followers: [] }
const initialItemState = { id: '', content: ''}
const itemsCard = { height: '125px', width: '125px', alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF', display: 'flex', justifyContent: 'center'  }
const editItemCard = { height: '200px', width: '100%', alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF', display: 'flex', justifyContent: 'center'  }

const cardContainer = {justifyContent: 'center', display: 'grid'}

const PlaylistDetails = (props) => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = React.useState(true);
  const [loadingCreateItem, setLoadingCreateItem] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);
  const [playlistItems, setPlaylistItems] = React.useState([]);
  const [editPlaylistFormData, setEditPlaylistFormData] = useState(initialCreatePlaylistFormData);
  const [showEditPlaylist, setShowEditPlaylist ] = React.useState(false);
  const [showDeletePlaylist, setShowDeletePlaylist ] = React.useState(false);
  const [showEditItem, setShowEditItem ] = React.useState('');
  const [showItemActions, setShowItemActions] = React.useState('');
  const [createItemFormData, setCreateItemForm] = useState(initialItemState);
  const [editItemFormData, setEditItemFormData] = useState(initialItemState);

  useEffect( () => {
    async function getPlaylistDetails (){
      try {
        if(props.selectedPlaylist){
          setSelectedPlaylist(props.selectedPlaylist);
          setPlaylistItems(props.selectedPlaylist.items.items);
          setEditPlaylistFormData(props.selectedPlaylist)
          setLoadingPlaylistItems(false);
          setLoadingPlaylists(false);
        }

      } catch(error) {
        console.error('[playlist] getPlaylistDetails error', { error });
        setLoadingPlaylists(false);
      }
    }
    getPlaylistDetails();
  }, []);


  const createItem = async () => {
    try {
      if (!createItemFormData.content || !selectedPlaylist.id) return;
      setLoadingCreateItem(true);
      const createdItem = await createItemConnector(createItemFormData.content, selectedPlaylist)
      createItemFormData['id'] = createdItem.createItem.id;
      setPlaylistItems([ ...playlistItems, createdItem.createItem ]);
      setLoadingCreateItem(false);
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
      props.resetStateOnPlaylistDelete(selectedPlaylist.id)
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
      await deleteItemConnector(itemId); 
      const newplaylistItemsArray = playlistItems.filter(p => p.id !== itemId);
      setPlaylistItems(newplaylistItemsArray);
    } catch (error) {
      console.error('[playlist] deleteItem error', { error });
    }
  }


  const toggleShowEditPlaylist = () => {
    setEditPlaylistFormData(selectedPlaylist)
    setShowEditPlaylist(!showEditPlaylist);
  }

  const toggleShowDeletePlaylist = () => {
    setShowDeletePlaylist(!showDeletePlaylist);
  }

  const toggleShowEditItem = (item) => {
    setEditItemFormData(item)
    setShowEditItem(item.id);
  }

  const toggleShowItemActions = (item) => {
    setShowItemActions(item.id);
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
          { showDeletePlaylist ? 
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant='h3'>Are you sure want to delete this playlist?</Typography>
                </Grid>
                <Grid item key={"cancel"} xs={6} style={{paddingTop: '0px'}} >
                  <Button onClick={() => toggleShowDeletePlaylist()} startIcon={<CancelOutlinedIcon />} variant="outlined"style={{width:'100%', height:'100%'}}>Cancel</Button>
                </Grid>
                <Grid item key={"delete"} xs={6}  style={{paddingTop: '0px'}} >
                  <Button onClick={() => deletePlaylist()} startIcon={<DeleteIcon />} variant="contained" color="secondary" style={{width:'100%', height:'100%'}}>Delete</Button>
                </Grid>
              </Grid>
            </Grid>
          :
            <React.Fragment>
              <Grid item xs={12} style={{paddingLeft:'32px', paddingRight:'32px'}} >
                <FormControl component="fieldset" style={{width:'100%'}}>
                  <FormLabel component="legend" style={{paddingBottom: '8px', display:'flex', float:'left'}}>Add New Item</FormLabel>
                  <TextField
                    id="create-item-text-field"
                    variant="outlined"
                    onChange={e => setCreateItemForm({ ...createItemFormData, 'content': e.target.value})}
                    value={createItemFormData.content}
                    style={{marginBottom:'16px'}}
                  />
                </FormControl>
                <Grid container spacing={4} >
                  <Grid item xs={6}>
                    <Button 
                      onClick={() => setCreateItemForm(initialItemState)}
                      variant="outlined"
                      style={{width:'100%'}}
                    >Clear</Button>
                  </Grid>
                  <Grid item xs={6} >
                    { loadingCreateItem? 
                      <div className="loading-container">
                        <CircularProgress />
                      </div>
                    :
                      <Button 
                        onClick={() => createItem()}
                        variant="contained"
                        color='secondary'
                        style={{width:'100%',}}
                      >Create</Button>
                    }
                  </Grid>
                </Grid>
              </Grid>
            </React.Fragment>
          }
          <Grid item xs={12} style={{paddingTop: '0px'}} >
            <SearchIcon fontSize='large' style={{paddingRight:'16px', float:'left'}} />
            {showEditPlaylist ? 
              <React.Fragment>
                <TextField
                  id="playlist-title-text-field"
                  onChange={e => setEditPlaylistFormData({ ...editPlaylistFormData, 'title': e.target.value})}
                  placeholder="New Item"
                  value={editPlaylistFormData.title}
                  inputProps={{style: { float: 'left', paddingRight:'16px', }}}  
                  style={{float:'left', width:'50%'}}                            
                />
                <IconButton onClick={() => updatePlaylist()} style={{float: 'right', paddingRight:'8px'}}>
                  <SaveOutlinedIcon />
                </IconButton>
                <IconButton onClick={() => toggleShowEditPlaylist()} style={{float: 'right', paddingRight:'8px'}}>
                  <CancelOutlinedIcon />
                </IconButton>
              </React.Fragment>
            : 
              <React.Fragment>
                <Typography variant='h4' style={{float: 'left', paddingRight:'4px', paddingTop:'7px'}}>{selectedPlaylist.title}</Typography>
                <IconButton onClick={() => toggleShowDeletePlaylist()} style={{float: 'right', paddingRight:'4px', top:'-6px'}}>
                  <DeleteIcon/>
                </IconButton>
                <IconButton onClick={() => toggleShowEditPlaylist()} style={{float: 'right', paddingRight:'4px', top:'-6px'}}>
                  <EditIcon/>
                </IconButton>
              </React.Fragment>
            }
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Owner: </TableCell>
                  <TableCell >{selectedPlaylist.owner}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Item Count: </TableCell>
                  <TableCell>{playlistItems.length}</TableCell>
                </TableRow>
                <TableRow>
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
                </TableRow>
                <TableRow>
                  <TableCell>Created At:</TableCell>
                  <TableCell>{selectedPlaylist.createdAt.toString().slice(0, 10)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Last Updated:</TableCell>
                  <TableCell>{selectedPlaylist.updatedAt.toString().slice(0, 10)}</TableCell>
                </TableRow>
                <TableRow style={{borderBottom: 'hidden'}}>
                  <TableCell>Followers:</TableCell>
                  <TableCell>{selectedPlaylist.followers.length - 1}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} >
            <Divider style={{marginBottom: '16px'}}/>
            <FeaturedPlayListOutlinedIcon fontSize='large' style={{paddingRight:'16px', float:'left'}} />
            <Typography variant='h4' style={{float: 'left', marginBottom: '16px', paddingTop:'6px'}}>{selectedPlaylist.title} Items</Typography>
            { loadingPlaylistItems ?
              <div style={{height:'25vh', width:'80%'}}>
                <div className="loading-container"> 
                  <CircularProgress />
                </div>
              </div>
              :
              <Grid container spacing={4} style={{marginBottom: '16px', paddingLeft:'8px', paddingRight:"8px"}}>
                { playlistItems.map(item => (
                  <React.Fragment>
                    { showEditItem === item.id ?
                      <Grid item key={item.id} xs={12} md={4} style={cardContainer}>
                        <Card style={editItemCard}>
                          <CardContent>
                            <Grid container spacing={4} >
                              <Grid item xs={12}>
                                <TextField
                                  id="playlist-title-text-field"
                                  onChange={e => setEditItemFormData({ ...editItemFormData, 'content': e.target.value})}
                                  value={editItemFormData.content}
                                  inputProps={{style: { 'aria-label': 'bare', textAlign: 'center', color:'#FFF', width:'100%' }}}      
                                />
                                <Grid container spacing={4} style={{paddingTop:'16px'}}>
                                  <Grid item xs={6}>
                                    <Button 
                                      onClick={() => toggleShowEditItem({id: ''})}
                                      variant="outlined"
                                      // color='secondary'
                                      style={{width:'100%', color:'#FFF', borderColor:'#FFF'}}
                                    >Cancel</Button>
                                  </Grid>
                                  <Grid item xs={6} >
                                    { loadingCreateItem? 
                                      <div className="loading-container">
                                        <CircularProgress />
                                      </div>
                                    :
                                      <Button 
                                        onClick={() => updateItem()}
                                        variant="contained"
                                        color='secondary'
                                        style={{width:'100%',}}
                                      >Update</Button>
                                    }
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}  >
                                <Button onClick={() => deleteItem(item.id)}startIcon={<DeleteIcon />} variant="contained" color="secondary" >Delete</Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    :
                      <Grid item key={item.id} xs={6} md={2} style={cardContainer}>
                        <Card style={itemsCard}>
                          <CardContent onClick={() => toggleShowEditItem(item)} onMouseEnter={() => toggleShowItemActions(item)} onMouseLeave={() => toggleShowItemActions({id: ''})}>
                            <Typography>{item.content}</Typography>
                            { showItemActions === item.id ?
                              <React.Fragment >
                                <IconButton style={{color:'#FFF'}}>                            
                                  <EditIcon />
                                </IconButton>                          
                              </React.Fragment>
                              :
                              null
                            }
                            </CardContent>
                          </Card>
                        </Grid>
                      }
                  </React.Fragment>
                ))}
              </Grid> 
            }
          </Grid>
        </React.Fragment>
      }
    </React.Fragment>
  );

}

export default PlaylistDetails; 