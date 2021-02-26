import React, { useEffect, useState } from 'react';
import '../../App.css';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { getPlaylistsByTitle, listPlaylists, listItems, getPlaylist } from '../../graphql/queries';
import { 
  createPlaylist as createPlaylistMutation, 
  deletePlaylist as deletePlaylistMutation, 
  createItem as createItemMutation, 
  deleteItem as deleteItemMutation, 
} from '../../graphql/mutations';
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Radio,
  RadioGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
import SearchIcon from '@material-ui/icons/Search';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import theme from '../../theme';


const initialCPFormState = { title: '', public: true, followers: [] }

const initialItemState = { content: ''}
const initalSelectedPlaylist = {title:'No Playlists Found'}
const playlistCard = { height: '150px', width: '150px', alignItems: 'center'}
const playlistCardContent = { paddingTop:'62px'}
const cardHeaderStyle = { backgroundColor: theme.palette.primary.main, float:'left', color:'white', fontSize:'16px', width:'100%' }

const Playlist = () => {
  const [loading, setLoading] = React.useState(true);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(null);
  const [playlistItems, setPlaylistItems] = React.useState([]);
  const [showCreatePlaylist, setShowCreatePlaylist ] = React.useState(false);
  const [playlistFormData, setPlaylistFormData] = useState(initialCPFormState);
  const [showCreateItem, setShowCreateItem ] = React.useState(false);
  const [showDeletePlaylist, setShowDeletePlaylist ] = React.useState(false);
  const [itemFormData, setItemFormData] = useState(initialItemState);


  useEffect(async () => {
    await fetchPlaylists();
    setLoading(false);
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
        console.error('[playlist-fetchPlaylists] error', error.errors[0].message);
      }
  }

  const fetchPlaylistItems = async (playlist) => {
    // const apiData = await API.graphql({ query: listPlaylists, variables, });
    try {
      const playlistId = playlist.id;
      console.log('fetchPlaylistItems playlistId', playlistId);
      const  { data } = await API.graphql(graphqlOperation(listItems, { filter: { itemPlaylistId: { eq: playlistId }}}));
      console.log('fetchPlaylistItems data', data);
      setPlaylistItems(data.listItems.items);

    } catch(error) {
      console.error('[playlist-fetchPlaylistItems] error', error.errors[0].message);
    }
}



  const createPlaylist = async () => {
    try {
      if (!playlistFormData.title) return;
      const { username } = await Auth.currentUserInfo() 
      playlistFormData.followers = [username]
      console.log('playlistFormData', playlistFormData)
      const { data } = await API.graphql({ query: createPlaylistMutation, variables: { input: playlistFormData } });
      let newPlaylist = data.createPlaylist
      newPlaylist['followers'] = [username];
      const newSortedData = sortObjectsAlphabetically([ ...userPlaylists, newPlaylist ], "title");

      setUserPlaylists(newSortedData);
      setPlaylistFormData(initialCPFormState);
      setShowCreatePlaylist(!showCreatePlaylist);
      setPlaylistItems([])
      setSelectedPlaylist(newPlaylist)
    } catch (error) {
      console.error('[playlists] createPlaylist error', error.errors[0].message);
    }

  }

  const createItem = async () => {
    try {
      console.log('[ playlists] itemFormData, selectedPlaylist', itemFormData, selectedPlaylist)

      if (!itemFormData.content || !selectedPlaylist.id) return;
  
      const { data:createItemResult } = await API.graphql({ query: createItemMutation, variables: { input: {...itemFormData, itemPlaylistId: selectedPlaylist.id }}});
      itemFormData['id'] = createItemResult.createItem.id;
      console.log('[ playlists] createitem result', createItemResult)
      setPlaylistItems([ ...playlistItems, createItemResult.createItem ]);
      setShowCreateItem(!setShowCreateItem);
      setItemFormData(initialItemState);
    } catch (error) {
      console.error('[playlists] createItem error', error.errors[0].message);
    }
  }

  const deletePlaylist = async () => {
    
    try{

      if (!selectedPlaylist.id) return;
      console.log("deleting playlist...", selectedPlaylist)

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
      console.error('[playlists] delete error', error.errors[0].message);
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

  const toggleSelectedPlaylist = (newPlaylist) => {
    if(newPlaylist.id !== selectedPlaylist.id){
      fetchPlaylistItems(newPlaylist)
      console.log("selectedPlaylist", selectedPlaylist);
      setSelectedPlaylist(newPlaylist);
    }
  }

  const toggleShowCreatePlaylist = () => {
    setShowCreatePlaylist(!showCreatePlaylist);
  }

  const toggleShowCreateItem = () => {
    setShowCreateItem(!showCreateItem);
  }

  const toggleShowDeletePlaylist = () => {
    setShowDeletePlaylist(!showDeletePlaylist);
  }

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  if(loading){
    return( 
      <div className="Loading">
        <CircularProgress />
      </div>
    )
  } 

  return (
    <div className='view-container'>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card position="fixed" color="primary">
            <CardHeader
              avatar={<Reorder size='large' />}
              title={<span style={{float: 'left', fontSize:'24px'}}>Your Playlists</span>}
              style={cardHeaderStyle}
            />
            <CardContent >
              <Grid container spacing={4} style={{marginBottom: '16px'}}>
                <Grid item key={'create-playlist'} xs={12} md={2}>
                  <Card style={playlistCard}>
                      { showCreatePlaylist ?
                        <CardContent style={{paddingTop: '50px'}}>
                          <TextField
                            id="playlist-title-text-field"
                            onChange={e => setPlaylistFormData({ ...playlistFormData, 'title': e.target.value})}
                            placeholder="New Playlist"
                            value={playlistFormData.title}
                            inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                            inputProps={{style: { textAlign: 'center' }}}                              
                          />
                          <IconButton>                            
                            <SaveOutlinedIcon onClick={createPlaylist}/>
                          </IconButton>                          
                          <IconButton>                            
                            <CancelOutlinedIcon onClick={toggleShowCreatePlaylist}/>
                          </IconButton>
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
                            <TableCell>{selectedPlaylist.followers.length}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                    <Grid item xs={2} >
                      <Card style={playlistCard}>
                        { showCreateItem ?
                          <CardContent style={{paddingTop: '50px'}}>
                            <TextField
                              id="playlist-title-text-field"
                              onChange={e => setItemFormData({ ...itemFormData, 'content': e.target.value})}
                              placeholder="New Item"
                              value={itemFormData.title}
                              inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                              inputProps={{style: { textAlign: 'center' }}}                              
                            />
                            <IconButton >                            
                              <SaveOutlinedIcon onClick={createItem}/>
                            </IconButton>                          
                            <IconButton>                            
                              <CancelOutlinedIcon onClick={toggleShowCreateItem}/>
                            </IconButton>
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
                    <Grid item xs={2} >
                      <Card style={playlistCard}>
                        <CardContent style={{paddingTop: '50px'}}>
                          <IconButton>                            
                            <EditIcon onClick={toggleShowCreatePlaylist}/>
                          </IconButton>
                        </CardContent>
                      </ Card>
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
                          <Typography variant='h3' style={{marginBottom: '32px'}}>Are you sure want to delete this playlist?</Typography>
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
                      <TableContainer component={Paper}>
                        <Table  aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Item</TableCell>
                              <TableCell>Owner</TableCell>
                              <TableCell>Created At</TableCell>
                              <TableCell>Last Updated</TableCell>
                              <TableCell>Edit</TableCell>
                              <TableCell >Delete</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {playlistItems.map((i) => (
                              <TableRow key={i.id}>
                                <TableCell component="th" scope="row">
                                  {i.content}
                                </TableCell>
                                <TableCell>                                
                                  {i.owner}
                                </TableCell>
                                <TableCell>                                
                                  {i.createdAt.toString().slice(0, 10)}
                                </TableCell>
                                <TableCell>                                
                                  {i.updatedAt.toString().slice(0, 10)}
                                </TableCell>
                                <TableCell >       
                                  <IconButton aria-label="edit item" component="span">
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                                <TableCell >
                                  <IconButton aria-label="delete item" component="span">
                                    <DeleteIcon onClick={() => deleteItem(i.id)}/>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      </Grid>
                  </React.Fragment>
                :
                  null
                }
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

}

export default Playlist;