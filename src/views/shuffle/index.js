import React, { useEffect, useState } from 'react';
import '../../App.css';
import { API, graphqlOperation } from 'aws-amplify';
import { listPlaylists, listItems } from '../../graphql/queries';
import { compareArrays, shuffleData, sortObjectsAlphabetically } from '../../util/helperFunctions.js';

import { 
  Button,
  Card,
  CardContent,
  Checkbox,
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
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography 
}from '@material-ui/core';

import ShuffleIcon from '@material-ui/icons/Shuffle';
import SettingsIcon from '@material-ui/icons/Settings';
import Reorder from '@material-ui/icons/PlaylistPlay';

const Shuffle = () => {
  const [loading, setLoading] = React.useState(true);
  const [checkedPlaylists, setCheckedPlaylists] = React.useState([]);
  const [activePlaylists, setActivePlaylists] = React.useState([]);
  const [allPlaylists, setAllPlaylists] = React.useState([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = React.useState(true);
  const [activeItems, setActiveItems] = React.useState([]);
  const [allItems, setAllItems] = React.useState([]);
  const [display, setDisplay] = React.useState('Cards');
  const [count, setCount] = React.useState(3);

  useEffect(async () => {
    await fetchPlaylists()
    setLoading(false);
  }, [])
  
  const fetchPlaylists = async () => {
      try{
        const apiData = await API.graphql({ query: listPlaylists });
        const sortedPlaylists = sortObjectsAlphabetically(apiData.data.listPlaylists.items, "title");
        setAllPlaylists(sortedPlaylists);
        let initialChecked = [];
        initialChecked.push(sortedPlaylists[0].id);
        setCheckedPlaylists(initialChecked)
      } catch (error){
        console.error('[shuffle-fetch-playlists] error', {error})
      }

  }

  const shuffleItems = async () => {

    try{

      let shuffleDataInput;
      let updateActivePlaylists = compareArrays(checkedPlaylists, activePlaylists)

      if(!updateActivePlaylists || activeItems.length < 1){
        const { data } = await API.graphql(graphqlOperation(listItems, {filter: { itemPlaylistId:  {in: checkedPlaylists} }}));
        shuffleDataInput = data.listItems.items;
        setActivePlaylists(checkedPlaylists);
        setAllItems(shuffleDataInput)
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
    // shuffleItems();
  }

  const handleToggleCheckedPlaylists = (value) => () => {
    const currentIndex = checkedPlaylists.indexOf(value);
    const newCheckedPlaylists = [...checkedPlaylists];

    if (currentIndex === -1) {
      newCheckedPlaylists.push(value);
    } else {
      newCheckedPlaylists.splice(currentIndex, 1);
    }

    setCheckedPlaylists(newCheckedPlaylists);
    // shuffleItems();
  };


  if(loading){
    return( 
      <div className="Loading">
        <CircularProgress />
      </div>
    )
  } 

  return(
    <div className='view-container'>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <Card position="fixed" color="primary" style={{height: '200px', overflow:'scroll', overflowX: 'hidden'}} >
            <CardContent >
              <Reorder style={{paddingRight:'16px', float:'left'}} />
              <Typography style={{float: 'left', }}>Selected Playlists</Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} style={{ paddingTop: '8px'}}>
                  <Divider style={{ marginBottom: '8px'}} />
                  <List style={{ display: 'inline-block', paddingTop: '0px'}}>
                    {allPlaylists.map((playlist) => {
                      const labelId = `checkbox-list-label-${playlist.title}`;
                      return (
                        <ListItem key={playlist.title} role={undefined} dense button onClick={handleToggleCheckedPlaylists(playlist.id)} style={{float: 'left', height:'50px', width:'50%'}}>
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
        <Grid item xs={4}>
          <Button 
            onClick={shuffleItems}
            startIcon={<ShuffleIcon  style={{fontSize:'32pt', paddingBottom: '5px', fontWeight:'bold'}}/>} 
            color="secondary" 
            variant='contained' 
            style={{width:'100%', height: '200px',  fontSize:'28pt', fontWeight:'bold'}}
          >Shuffle</Button>
        </Grid>
        <Grid item xs={4}>
          <Card position="fixed" color="primary" style={{height: '200px'}} >
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
                        <FormControlLabel value="Cards" control={<Radio color='primary'/>} label="Cards" style={{ float: 'left'}}/>
                        <FormControlLabel value="Block" control={<Radio  color='primary'/>} label="Block" style={{ float: 'left'}} />
                      </RadioGroup>
                      <FormLabel component="legend" style={{paddingTop: '8px'}}>Item Count</FormLabel>
                      <Grid item key={'card-count-select'} sm={12}>
                        <Grid container spacing={2} style={{paddingTop: '4px'}}>
                          <Grid item key={'card-count-slider'} sm={10}>
                            <Slider
                              value={count}
                              step={1}
                              onChange={handleCountChange}
                              onChangeCommitted={handleCommittedCountChange}
                              min={1}
                              // max={allItems.length > 0 ? allItems.length : 3}
                              max={50}
                            />
                          </Grid>
                          <Grid item key={'count-text-field'} sm={2}>
                            <TextField
                              id="count-text-field"
                              value={count}
                              onChange={handleCountChange}
                              inputProps={{ 'aria-label': 'bare', 'color': "#FFF" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid> 
                    </FormControl>
                  </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={4} justify="center" style={{marginTop: `32px`, overflow:'scroll', overflowX: 'hidden'}} >
        { display ==='Cards' ?
            activeItems.map(i => (
                <Grid item key={i.id} xs={12} md={3}>
                  <Card>
                    <CardContent  >
                      <Typography>{i.content}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
            ))
          :
            <Grid item key={'blockDisplay'} xs={12}>
              <Card>
                <CardContent  >
                  <Typography>{activeItems.map(i => (i.content + ' '))}</Typography>
                </CardContent>
              </Card>
            </Grid>
        }
      </Grid>
  </div>
  )
}

export default Shuffle;