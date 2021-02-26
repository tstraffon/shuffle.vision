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
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import theme from '../../theme';


const initialCPFormState = { title: '', public: true}
const initialItemState = { content: ''}

const playlistCard = { height: '150px', width: '150px', alignItems: 'center'}
const playlistCardContent = { paddingTop:'62px'}
const cardHeaderStyle = { backgroundColor: theme.palette.primary.main, float:'left', color:'white', fontSize:'16px', width:'100%' }

const Playlist = () => {
  const [ loading, setLoading ] = React.useState(true);
  const [showCreatePlaylist, setShowCreatePlaylist ] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState({title:'No Playlists Found'});
  const [playlistItems, setPlaylistItems] = React.useState([]);

  const [cpFormData, setCPFormState] = useState(initialCPFormState);
  const [itemData, setItemData] = useState(initialItemState);


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
        } 
      } catch(error) {
        console.error('[playlist-fetchPlaylists] error', error);
      }
  }

  const fetchPlaylistItems = async (playlist) => {
    // const apiData = await API.graphql({ query: listPlaylists, variables, });
    try {
      const  { data } = await API.graphql(graphqlOperation(listItems, {filter: { playlistID:  {eq: playlist.id} }}));
      console.log('fetchPlaylistItems data', data);
      setPlaylistItems(data.listItems.items);

    } catch(error) {
      console.error('[playlist-fetchPlaylistItems] error', error);
    }
}



  const createPlaylist = async () => {
    try {
      if (!cpFormData.title) return;
      const { username } = await Auth.currentUserInfo() 
      cpFormData.followers = [username]
      console.log('cpFormData', cpFormData)
      const { data:createPlaylistResult } = await API.graphql({ query: createPlaylistMutation, variables: { input: cpFormData } });
      cpFormData['id'] = createPlaylistResult.createPlaylist.id;
      setUserPlaylists([ ...userPlaylists, cpFormData ]);
      setCPFormState(initialCPFormState);
      setShowCreatePlaylist(!showCreatePlaylist);
      setSelectedPlaylist(createPlaylistResult.createPlaylist)
    } catch (error) {
      console.error('[playlists] createPlaylist error', error);
    }

  }

  const createItem = async () => {
    try {
      if (!itemData.content) return;
  
      const { data:createItemResult } = await API.graphql({ query: createItemMutation, variables: { input: itemData } });
      itemData['id'] = createItemResult.createItem.id;

      setItemData(initialItemState);
    } catch (error) {
    }
  }

  const deletePlaylist = async ({ id }) => {
    const newUserPlaylistsArray = userPlaylists.filter(p => p.id !== id);
    setUserPlaylists(newUserPlaylistsArray);
    await API.graphql({ query: deletePlaylistMutation, variables: { input: { id } }});
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
    fetchPlaylistItems(newPlaylist)
    console.log("selectedPlaylist", selectedPlaylist);
    setSelectedPlaylist(newPlaylist);
  }

  const toggleShowCreatePlaylist = () => {
    setShowCreatePlaylist(!showCreatePlaylist);
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
                            onChange={e => setCPFormState({ ...cpFormData, 'title': e.target.value})}
                            placeholder="New Playlist"
                            value={cpFormData.title}
                            inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                            style={{alignContent:'center'}}
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
              <Grid item xs={12} style={{paddingBottom: '0px'}}>
                <Divider style={{marginBottom: '16px'}}/>
                {/* <EditIcon size='small' style={{paddingRight:'16px', float:'left'}} /> */}
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
                      <TableCell>{selectedPlaylist.items.length}</TableCell>
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
                  <CardContent style={{paddingTop: '50px'}}>
                    <IconButton>                            
                      <AddIcon onClick={toggleShowCreatePlaylist}/>
                    </IconButton>
                  </CardContent>
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
                      <DeleteIcon onClick={toggleShowCreatePlaylist}/>
                    </IconButton>
                  </CardContent>
                </ Card>
              </Grid>
              <Grid item xs={12}>
                <Divider style={{marginBottom: '16px'}}/>
                <FeaturedPlayListOutlinedIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                <Typography variant='h4' style={{float: 'left', marginBottom: '16px'}}>{selectedPlaylist.title} Items</Typography>
                <TableContainer component={Paper}>
                  <Table  aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell>Content</TableCell>
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
                          <TableCell><Checkbox /></TableCell>
                          <TableCell component="th" scope="row">
                            {i.item.content}
                          </TableCell>
                          <TableCell>                                
                            {i.item.owner}
                          </TableCell>
                          <TableCell>                                
                            {i.item.created_at}
                          </TableCell>
                          <TableCell>                                
                            {i.item.last_updated}
                          </TableCell>
                          <TableCell >       
                            <IconButton aria-label="edit item" component="span">
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                          <TableCell >
                            <IconButton aria-label="delete item" component="span">
                              <DeleteIcon onClick={() => deleteItem(i.item.id)}/>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );

}

export default Playlist;