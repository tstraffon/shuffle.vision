import React, { useEffect, useState } from 'react';
import '../../App.css';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listPlaylists, listItems } from '../../graphql/queries';
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
  Typography 
}from '@material-ui/core';
import Reorder from '@material-ui/icons/PlaylistPlay';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import PublicIcon from '@material-ui/icons/Public';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import theme from '../../theme';


const initialFormState = { title: ''}
const initialItemState = { content: ''}
const cardHeaderStyle = { backgroundColor: theme.palette.primary.main, float:'left', color:'white', fontSize:'16px', width:'100%' }

const Playlist = () => {
  const [ loading, setLoading ] = React.useState(true);
  const [showCreatePlaylist, setShowCreatePlaylist ] = React.useState(false);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState({});
  const [playlistItems, setPlaylistItems] = React.useState([]);

  const [formData, setFormData] = useState(initialFormState);
  const [itemData, setItemData] = useState(initialItemState);


  useEffect(async () => {
    await fetchPlaylists();
    setLoading(false);
  }, [])


  const fetchPlaylists = async () => {
      // const apiData = await API.graphql({ query: listPlaylists, variables, });
      try {
        const { username } = await Auth.currentUserInfo() 
        const  { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: { owner:  {eq: username} }}));
        console.log('fetchPlaylists data', data);
        setUserPlaylists(data.listPlaylists.items);
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
      if (!formData.title) return;
      console.log('[playlists] createPlaylist Input',  formData);

      const { data:createPlaylistResult } = await API.graphql({ query: createPlaylistMutation, variables: { input: formData } });
      console.log('[playlists] createPlaylistResult', createPlaylistResult);

      formData['id'] = createPlaylistResult.createPlaylist.id;
      setUserPlaylists([ ...userPlaylists, formData ]);
      setFormData(initialFormState);
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
              avatar={<PublicIcon size='large' />}
              title={<span style={{float: 'left', fontSize:'24px'}}>Browse</span>}
              style={cardHeaderStyle}
            />
            <CardContent >
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Divider />
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