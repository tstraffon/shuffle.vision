import React, { useEffect } from 'react';
import '../../App.css';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { listPlaylists, listItems } from '../../graphql/queries';
import { compareArrays, shuffleData, sortObjectsAlphabetically } from '../../util/helperFunctions.js';

import { 
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextField,
  Typography 
}from '@material-ui/core';

import {
  createItemConnector,
} from '../../util/apiConnectors.js';

import ShuffleIcon from '@material-ui/icons/Shuffle';
import SettingsIcon from '@material-ui/icons/Settings';
import Reorder from '@material-ui/icons/PlaylistPlay';
import AddIcon from '@material-ui/icons/Add';
import theme from '../../theme';


const ShuffleMobile = () => {
  const [loading, setLoading] = React.useState(true);
  const [loadingCreateItem, setLoadingCreateItem] = React.useState(false);
  const [checkedPlaylists, setCheckedPlaylists] = React.useState([]);
  const [activePlaylists, setActivePlaylists] = React.useState([]);
  const [allPlaylists, setAllPlaylists] = React.useState([]);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [activeItems, setActiveItems] = React.useState([]);
  const [allItems, setAllItems] = React.useState([]);
  const [display, setDisplay] = React.useState('Block');
  const [count, setCount] = React.useState(25);
  const [newItemFormData, setNewItemFormData] = React.useState({content:'', playlist:''});

  useEffect(() => {
    async function fetchShuffleData (){
      try {
        const { username } = await Auth.currentUserInfo();
        let { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: {followers: {contains: username}}}));
        let playlists = data.listPlaylists.items;
        const sortedPlaylists = await sortObjectsAlphabetically(playlists, "title");
        setAllPlaylists(sortedPlaylists);
        const newUsersPlaylists = sortedPlaylists.filter(p => p.owner === username);
        console.log("newUsersPlaylists", newUsersPlaylists);
        setUserPlaylists(newUsersPlaylists);
        let initialChecked = [], totalCount = 0;
        for(const p of sortedPlaylists){
          totalCount = totalCount + p.items.items.length;
          initialChecked.push(p.id);
        }
        const firstCount = totalCount > 25 ? 25 : totalCount;
        setCount(firstCount);
        setCheckedPlaylists(initialChecked);
        await shuffleItems(initialChecked);
        setLoading(false);
      } catch (error){
        console.error('[shuffle-fetch-playlists] error', {error});
        setLoading(false);
      }      
    }
    fetchShuffleData();
  }, [])
  

  const shuffleItems = async (checkInputs) => {

    try{

      let shuffleDataInput;
      const playlistIDsInput = !checkInputs ? checkedPlaylists : checkInputs;
      let playlistSetUpToDate = compareArrays(playlistIDsInput, activePlaylists);

      if(!playlistSetUpToDate || activeItems.length < 1){
        const { data } = await API.graphql(graphqlOperation(listItems, {filter: { itemPlaylistId:  {in: playlistIDsInput }}}));
        shuffleDataInput = data.listItems.items;
        setActivePlaylists(playlistIDsInput);
        setAllItems(shuffleDataInput)
        if(shuffleDataInput.length < count){
          setCount(shuffleDataInput.length)
        }
      } else {
        shuffleDataInput = allItems;
      }

      const newActiveItems = shuffleData(shuffleDataInput, count);
      setActiveItems(newActiveItems)

    }catch(error){
      console.error("[shuffleItems] error", error);
    }
    
  }


  const handleDisplayChange = (event) => {
    setDisplay(event.target.value );
    shuffleItems();
  }

  const handleCountChange = (event, newValue) => {
    setCount(newValue);
  }

  const handleCommittedCountChange = (event, newValue) => {
    setCount(newValue);
    shuffleItems();
  }

  const handleToggleCheckedPlaylists = (value) => {
    const currentIndex = checkedPlaylists.indexOf(value);
    const newCheckedPlaylists = [...checkedPlaylists];

    if (currentIndex === -1) {
      newCheckedPlaylists.push(value);
    } else {
      newCheckedPlaylists.splice(currentIndex, 1);
    }

    setCheckedPlaylists(newCheckedPlaylists);
    shuffleItems(newCheckedPlaylists);
  };

  const selectAll = () => {
    let newChecked = [];
    for (const p of allPlaylists){
      newChecked.push(p.id)
    }
    setCheckedPlaylists(newChecked);
    shuffleItems(newChecked);
  };

  const clearShufflePlaylists = () =>{
    let newChecked = [];
    newChecked.push(allPlaylists[0].id);
    setCheckedPlaylists(newChecked);
    shuffleItems(newChecked);
  };

  const clearCreateItemForm = () =>{
    console.log("newItemFormData", newItemFormData);
    setNewItemFormData({ playlist: '', content: ''})
    let newChecked = [];
    newChecked.push(allPlaylists[0].id);
    setCheckedPlaylists(newChecked);
    shuffleItems(newChecked);
  };

  const handlePlaylistSelectChange = (event) => {
    console.log('event', event.target.value)
    setNewItemFormData({ ...newItemFormData, 'playlist': event.target.value});
  }

  const createItem = async () => {
    try {
      if (!newItemFormData.content || !newItemFormData.playlist) return;
      setLoadingCreateItem(true);
      const playlistObj = allPlaylists.filter(p => p.title === newItemFormData.playlist);
      await createItemConnector(newItemFormData.content, playlistObj[0])
      setLoadingCreateItem(false);
      setNewItemFormData({ playlist: '', content: ''})
    } catch (error) {
      console.error('[playlist] createItem error', { error });
    }
  }


  if(loading){
    return( 
      <div className="loading-container">
        <CircularProgress />
      </div>
    )
  } 

  return(
    <div className='view-container'>
      <Grid container spacing={4}>
        <Grid item xs={8} style={{paddingRight:'32px'}}>
          <Button 
            onClick={() => shuffleItems()}
            startIcon={<ShuffleIcon  style={{fontSize:'32pt', paddingBottom: '5px', fontWeight:'bold'}}/>} 
            color="secondary" 
            variant='contained' 
            style={{width:'100%', height: '200px',  fontSize:'28pt', fontWeight:'bold'}}
          >Shuffle</Button>
          <Grid container spacing={4} justify="center" style={{marginTop: `24px`, overflow:'scroll', overflowX: 'hidden', }} >
            { display ==='Cards' ?
              activeItems.map(i => (
                <Grid item key={i.id} xs={12} md={3}>
                  <Card style={{height: '150px', width: '150px', alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF', display: 'flex', justifyContent: 'center' }}>
                    <CardContent  >
                      <Typography>{i.content}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            :
              <Grid item key={'blockDisplay'} xs={12}>
                <Card style={{ padding:'64px', backgroundColor: theme.palette.primary.main, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                  <CardContent style={{ width: '100%', color:'#FFF',  }}>
                    <Typography variant='h3' >{activeItems.map(i => (i.content + ' '))}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            }
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Card position="fixed" color="primary" style={{marginBottom: '32px'}} >
            <CardContent >
              <div style={{ paddingBottom: '8px'}}>
                <AddIcon style={{paddingRight:'16px', float:'left'}}/>
                <Typography style={{float: 'left', marginBottom: '8px'}}>Create New Item</Typography>
              </div>
              <Grid container spacing={0}>
                <Grid item xs={12} style={{paddingBottom: '0px', paddingTop:'0px'}}>
                  <Divider style={{marginBottom: '16px'}}/>
                </Grid>
                <FormControl component="fieldset" style={{width:'100%'}}>
                  <FormLabel component="legend" style={{paddingBottom: '8px', display:'flex', float:'left'}}>Item Content</FormLabel>
                  <TextField
                    id="create-item-text-field"
                    variant="outlined"
                    onChange={e => setNewItemFormData({ ...newItemFormData, 'content': e.target.value})}
                    value={newItemFormData.content}
                    style={{marginBottom:'16px'}}

                  />
                  <FormLabel component="legend" style={{paddingBottom: '8px', display:'flex', float:'left'}}>Select Playlist</FormLabel>
                  <Select
                    variant='outlined'
                    color='primary'
                    value={newItemFormData.playlist}
                    onChange={handlePlaylistSelectChange}
                    style={{   textAlign: 'left'}}
                  >
                    {userPlaylists.map((playlist) => {
                      return (
                        <MenuItem value={playlist.title}>{playlist.title}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <Grid item xs={6}>
                  <Button 
                    onClick={() => clearCreateItemForm()}
                    variant="outlined"
                    style={{width:'90%',marginTop:'24px'}}
                  >Clear</Button>
                </Grid>
                <Grid item xs={6} >
                  { loadingCreateItem ? 
                    <div className="loading-container">
                      <CircularProgress />
                    </div>
                  :
                    <Button 
                      onClick={() => createItem()}
                      variant="contained"
                      color='secondary'
                      style={{width:'90%', marginTop:'24px'}}
                    >Create</Button>
                  }
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card position="fixed" color="primary" >
            <CardContent >
              <div style={{ paddingBottom: '8px'}}>
                <SettingsIcon style={{paddingRight:'16px', float:'left'}}/>
                <Typography style={{float: 'left', marginBottom: '8px'}}>Shuffle Settings</Typography>
              </div>
              <Grid container spacing={0}>
                <Grid item xs={12} style={{paddingBottom: '0px', paddingTop:'0px'}}>
                  <Divider style={{marginBottom: '16px'}}/>
                </Grid>
                <FormControl component="fieldset" style={{width:'100%'}}>
                  <FormLabel component="legend">Display Format</FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" value={display} onChange={handleDisplayChange} style={{ display: 'inline-block'}}>
                    <FormControlLabel value="Block" control={<Radio  color='primary'/>} label="Block" style={{ float: 'left'}} />
                    <FormControlLabel value="Cards" control={<Radio color='primary'/>} label="Cards" style={{ float: 'left'}}/>
                  </RadioGroup>
                  <FormLabel component="legend" style={{paddingTop: '16px', display:'flex', float:'left'}}>Item Count</FormLabel>
                  <Grid item key={'card-count-select'} sm={12}>
                    <Grid container spacing={2} style={{paddingTop: '4px'}}>
                      <Grid item key={'card-count-slider'} sm={8}>
                        <Slider
                          value={count}
                          step={1}
                          onChange={handleCountChange}
                          onChangeCommitted={handleCommittedCountChange}
                          min={1}
                          max={allItems.length}
                          // max={50}
                        />
                      </Grid>
                      <Grid item key={'count-text-field'} sm={2}>
                        <TextField
                          id="count-text-field"
                          value={count}
                          onChange={() => handleCountChange()}
                          inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                        />
                      </Grid>
                      <Grid item key={'count-total'} sm={2}>
                        <Typography>/ {allItems.length}</Typography>
                      </Grid>
                    </Grid>
                  </Grid> 
                </FormControl>
                <Grid item xs={12} style={{ paddingTop: '32px'}}>
                  <Reorder style={{paddingRight:'16px', float:'left'}} />
                  <Typography style={{float: 'left', }}>Selected Playlists</Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: '8px'}}>
                  <Divider style={{ marginBottom: '8px'}} />
                  {allPlaylists.map((playlist) => {
                    if(checkedPlaylists.indexOf(playlist.id) !== -1){
                      return (
                        <Chip color="primary" key={playlist.id}label={playlist.title} style={{margin: '8px'}}/>
                      );
                    } else {
                      return null
                    }
                  })}
                </Grid>
                <Grid item xs={6} style ={{paddingTop:'8px'}}>
                  <Button 
                    onClick={() => clearShufflePlaylists()}
                    size="small"
                    variant="outlined"
                    style={{width:'90%'}}
                  >Clear</Button>
                </Grid>
                <Grid item xs={6} style ={{paddingTop:'8px'}}>
                  <Button 
                    onClick={() => selectAll()}
                    size="small"
                    variant="outlined"
                    style={{width:'90%'}}
                  >Select All</Button>
                </Grid>
                <Grid item xs={12} style ={{paddingTop:'8px'}}>
                  <Divider style={{ marginBottom: '8px'}} />
                  <List style={{ display: 'inline-block', paddingTop: '0px'}}>
                    {allPlaylists.map((playlist) => {
                      const labelId = `checkbox-list-label-${playlist.title}`;
                      return (
                        <ListItem key={playlist.title} role={undefined} dense button onClick={() => handleToggleCheckedPlaylists(playlist.id)} style={{float: 'left', width:'50%', height:'50px', marginBottom:'8px'}}>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checkedPlaylists.indexOf(playlist.id) !== -1}
                              tabIndex={-1}
                              disableRipple
                              color='primary'
                              inputProps={{ 'aria-labelledby': labelId }}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={playlist.title} />
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  </div>
  )
}

export default ShuffleMobile;