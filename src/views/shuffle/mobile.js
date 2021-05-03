import React, { useEffect } from 'react';
import '../../App.css';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { listPlaylists, listItems } from '../../graphql/queries';
import { compareArrays, shuffleData, sortObjectsAlphabetically } from '../../util/helperFunctions.js';
import { NavLink, useHistory } from 'react-router-dom';

import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
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
  createPlaylistConnector,
} from '../../util/apiConnectors.js';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AddIcon from '@material-ui/icons/Add';
import PublicIcon from '@material-ui/icons/Public';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import SettingsIcon from '@material-ui/icons/Settings';
import Reorder from '@material-ui/icons/PlaylistPlay';
import theme from '../../theme';

const cardHeaderStyle = { backgroundColor: theme.palette.primary.main, float:'left', color:'white', fontSize:'16px', width:'100%' };


const Shuffle = () => {
  const [loading, setLoading] = React.useState(true);
  const [loadingCreateItem, setLoadingCreateItem] = React.useState(false);
  const [loadingCreatePlaylist, setLoadingCreatePlaylist] = React.useState(false);
  const [checkedPlaylists, setCheckedPlaylists] = React.useState([]);
  const [activePlaylists, setActivePlaylists] = React.useState([]);
  const [allPlaylists, setAllPlaylists] = React.useState([]);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [activeItems, setActiveItems] = React.useState([]);
  const [allItems, setAllItems] = React.useState([]);
  const [display, setDisplay] = React.useState('Block');
  const [count, setCount] = React.useState(25);
  const [showCreateNewItem, setShowCreateNewItem] = React.useState(false);
  const [showShuffleSettings, setShowShuffleSettings] = React.useState(false);
  const [newItemFormData, setNewItemFormData] = React.useState({content:'', playlist:''});
  const [showCreatePlaylist, setShowCreatePlaylist] = React.useState(false);
  const [createPlaylistFormData, setCreatePlaylistFormData] = React.useState('');
  const history = useHistory();


  useEffect(() => {
    async function fetchShuffleData (){
      try {
        const { username } = await Auth.currentUserInfo();
        let { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: {followers: {contains: username}}}));
        let playlists = data.listPlaylists.items;
        const sortedPlaylists = await sortObjectsAlphabetically(playlists, "title");
        setAllPlaylists(sortedPlaylists);
        const newUsersPlaylists = sortedPlaylists.filter(p => p.owner === username);
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
  

  const shuffleItems = async (initialChecked) => {

    try{

      let shuffleDataInput;
      const playlistIDsInput = !initialChecked ? checkedPlaylists : initialChecked;
      let playlistSetUpToDate = compareArrays(playlistIDsInput, activePlaylists)

      if(!playlistSetUpToDate || activeItems.length < 1){
        const { data } = await API.graphql(graphqlOperation(listItems, {filter: { itemPlaylistId:  {in: playlistIDsInput }}}));
        shuffleDataInput = data.listItems.items;
        setActivePlaylists(checkedPlaylists);
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
    // shuffleItems();
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

  const clear = () =>{
    let newChecked = [];
    newChecked.push(allPlaylists[0].id);
    setCheckedPlaylists(newChecked);
    shuffleItems(newChecked);
  };

  const toggleShowShuffleSettings = () =>{
    setShowShuffleSettings(!showShuffleSettings);
  };

  const toggleShowCreateNewItem = () =>{
    setShowCreateNewItem(!showCreateNewItem);
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

  const createPlaylist = async () => {
    try {
      if (!createPlaylistFormData) return;
      setLoadingCreatePlaylist(true);
      const createPlaylistInput ={ id: '', title: createPlaylistFormData, public: true, followers: [] }
      await createPlaylistConnector(createPlaylistInput, userPlaylists);
      setCreatePlaylistFormData('');
      setLoadingCreatePlaylist(false);
      history.push('/playlists');
    } catch (error) {
      setLoadingCreatePlaylist(false);
      console.error('[shuffle] createPlaylist error', { error });
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
    <div className='mobile-view-container'>
      { allPlaylists.length > 0 ?
        <Grid container spacing={4} justify="center" alignItems="center" >
          <Grid item xs={12} style={{paddingBottom:'0px'}}>
            <Accordion expanded={showCreateNewItem} onChange={() => toggleShowCreateNewItem()}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="create-item-content"
                id="create-item-header"
                style={{margin:'0px', height:'48px'}}
              >
                <AddIcon fontSize='large' style={{paddingRight:'16px', paddingTop:'12px', float:'left'}}/>  
                <Typography style={{float: 'left', marginBottom: '8px', paddingTop:'12px'}}>Create New Item</Typography>            
              </AccordionSummary>
              <AccordionDetails>
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
                  <Grid item xs={12}>
                    <Divider style={{marginBottom:'12px', marginTop:'24px'}} />
                    <Button 
                      onClick={() => toggleShowCreateNewItem()}
                      startIcon={<ExpandLessIcon />} 
                      style={{width:'100%'}}
                    >Hide Create New Item</Button>       
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} style={{paddingBottom:'0px'}}>
            <Accordion expanded={showShuffleSettings} onChange={() => toggleShowShuffleSettings()}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                style={{margin:'0px', height:'48px'}}
              >
                <SettingsIcon fontSize='large' style={{paddingRight:'16px', paddingTop:'12px', float:'left'}}/>  
                <Typography style={{float: 'left', marginBottom: '8px', paddingTop:'12px'}}>Shuffle Settings</Typography>            
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={0}>
                  <Grid item xs={12} style={{paddingBottom: '0px', paddingTop:'0px'}}>
                    <Divider style={{marginBottom: '16px'}}/>
                  </Grid>
                  <FormControl component="fieldset" style={{width:'100%'}}>
                    <FormLabel component="legend" style={{display:'flex', float:'left'}}>Display Format</FormLabel>
                    <RadioGroup aria-label="gender" name="gender1" value={display} onChange={handleDisplayChange} style={{ display: 'inline-block'}}>
                      <FormControlLabel value="Block" control={<Radio  color='primary'/>} label="Block" style={{ float: 'left'}} />
                      <FormControlLabel value="Cards" control={<Radio color='primary'/>} label="Cards" style={{ float: 'left'}}/>
                    </RadioGroup>
                    <FormLabel component="legend" style={{paddingTop: '8px', display:'flex', float:'left'}}>Item Count</FormLabel>
                    <Grid item key={'card-count-select'} sm={12}>
                      <Grid container spacing={2} style={{paddingTop: '12px'}}>
                        <Grid item key={'card-count-slider'} xs={8}>
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
                        <Grid item key={'count-text-field'} xs={2}>
                          <TextField
                            id="count-text-field"
                            value={count}
                            onChange={() => handleCountChange()}
                            inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                          />
                        </Grid>
                        <Grid item key={'count-total'} xs={2}>
                          <Typography>/ {allItems.length}</Typography>
                        </Grid>
                      </Grid>
                    </Grid> 
                  </FormControl>
                  <Grid item xs={12} style={{ paddingTop: '32px'}}>
                    <Reorder fontSize='large' style={{paddingRight:'16px', paddingBottom:'12px', float:'left'}} />
                    <Typography style={{float: 'left', marginBottom:'8px'}}>Selected Playlists</Typography>
                  </Grid>                
                  <Grid item xs={6}>
                    <Button 
                      onClick={() => clear()}
                      size="small"
                    >Clear</Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      onClick={() => selectAll()}
                      size="small"
                    >Select All</Button>
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
                    <List style={{ display: 'inline-block', paddingTop: '0px'}}>
                      {allPlaylists.map((playlist) => {
                        const labelId = `checkbox-list-label-${playlist.title}`;
                        return (
                          <ListItem key={playlist.title} role={undefined} dense button onClick={() => handleToggleCheckedPlaylists(playlist.id)} style={{float: 'left', width:'100%', height:'50px', marginBottom:'8px'}}>
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
                  <Grid item xs={12}>
                    <Divider style={{marginBottom:'12px'}} />
                    <Button 
                      onClick={() => toggleShowShuffleSettings()}
                      startIcon={<ExpandLessIcon />} 
                      style={{width:'100%'}}
                    >Hide Shuffle Settings</Button>       
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} style={{paddingBottom:'0px'}}>
            <Button 
              onClick={() => shuffleItems()}
              startIcon={<ShuffleIcon  style={{fontSize:'32pt', paddingBottom: '5px', fontWeight:'bold'}}/>} 
              color="secondary" 
              variant='contained' 
              style={{width:'100%', height: '100px',  fontSize:'28pt', fontWeight:'bold'}}
            >Shuffle</Button>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2} justify="center" style={{ overflow:'scroll', overflowX: 'hidden'}} >
              { display ==='Cards' ?
                  activeItems.map(i => (
                      <Grid item key={i.id} xs={6} md={3}>
                        <Card style={{height: '150px', width: '150px', alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF', display: 'flex', justifyContent: 'center' }}>
                          <CardContent  >
                            <Typography >{i.content}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                  ))
                :
                  <Grid item key={'blockDisplay'} xs={12}>
                    <Card style={{padding:'16px', backgroundColor: theme.palette.primary.main, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                      <CardContent style={{ color:'#FFF',  }}>
                        <Typography >{activeItems.map(i => (i.content + ' '))}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
              }
            </Grid>
          </Grid>
        </Grid>
      :
        <Grid container spacing={4} justify='center' style={{marginTop:'16px'}}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                avatar={<ShuffleIcon size='large' style={{marginTop:'4px'}}/>}
                title={<span style={{float: 'left', fontSize:'24px'}}>Welcome</span>}
                style={cardHeaderStyle}
              />
              <CardContent>
                { !showCreatePlaylist ?
                  <Grid container spacing={4}>
                    {/* <Grid item xs={12}>
                      <Typography variant='h2'>Welcome to shuffle.vision!</Typography>
                    </Grid> */}
                    <Grid item xs={12} style={{paddingTop:'24px'}}>
                      <Typography variant='h3'>Create or follow a playlist to begin shuffling</Typography>
                    </Grid>
                    <Grid item key={"creare-playlists"} xs={12}>
                      <Button onClick={() => setShowCreatePlaylist(true)}startIcon={<AddIcon />} variant="contained" color="secondary" style={{width:'100%', height:'100%'}}>Create Playlist</Button>
                    </Grid>
                    <Grid item key={"browse-playlists"} xs={12} style={{paddingTop:'0px'}}>
                      <Button component={NavLink} to={"/playlists"}  startIcon={<PublicIcon />} variant="contained" color="secondary" style={{width:'100%', height:'100%'}}>Browse Playlists</Button>
                    </Grid>
                  </Grid>
                :
                  <Grid container spacing={4} >
                    <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'8px',}}> 
                      <IconButton onClick={() =>  setShowCreatePlaylist(false)} style={{float: 'left',  borderRadius:'5%'}}>
                        <ChevronLeftIcon />
                        <Typography style={{float: 'left',  paddingLeft:'8px',  paddingTop:'4px'}}>Back</Typography> 
                      </IconButton>
                    </Grid>  
                    <Grid item xs={12} style={{ paddingTop:'0px',}}>
                      <Divider />
                    </Grid>  
                    <Grid item xs={12}>
                      <FormControl component="fieldset" style={{width:'100%' }}>
                        <FormLabel component="legend" style={{paddingBottom: '8px', display:'flex', float:'left'}}>Create New Playlist</FormLabel>
                        <TextField
                          id="create-item-text-field"
                          variant="outlined"
                          onChange={e => setCreatePlaylistFormData(e.target.value)}
                          value={createPlaylistFormData}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <Button 
                        onClick={() => setCreatePlaylistFormData('')}
                        variant="outlined"
                        style={{width:'100%'}}
                      >Clear</Button>
                    </Grid>
                    <Grid item xs={6} >
                      { loadingCreatePlaylist ? 
                        <div className="loading-container" style={{top:'0'}}>
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
                }
              </CardContent>
            </Card>
          </Grid>
      </Grid>
    }
  </div>
  )
}

export default Shuffle;