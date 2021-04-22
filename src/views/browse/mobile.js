import React, { useEffect } from 'react';
import '../../App.css';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listPlaylists, listItems } from '../../graphql/queries';
import { updatePlaylist as updatePlaylistMutation } from '../../graphql/mutations';
import { 
  AppBar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography 
}from '@material-ui/core';
import Reorder from '@material-ui/icons/PlaylistPlay';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import theme from '../../theme';


const playlistCard = { height: '125px', width: '125px', alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF', display: 'flex', justifyContent: 'center'}
const cardContainer = {justifyContent: 'center', display: 'grid'}

const BrowseMobile = () => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = React.useState(true);
  const [loadingUserPlaylists, setLoadingUserPlaylists] = React.useState(true);
  const [loadingUserPlaylistItems, setLoadingUserPlaylistItems] = React.useState(true);
  const [allPlaylists, setAllPlaylists] = React.useState([]);
  const [userPlaylists, setUserPlaylists] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(false);
  const [selectedUserPlaylist, setSelectedUserPlaylist] = React.useState(false);
  const [playlistItems, setPlaylistItems] = React.useState([]);
  const [userPlaylistItems, setUserPlaylistItems] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [loadingFollowPlaylist, setLoadingFollowPlaylist] = React.useState(false);

  useEffect(() => {
    async function fetchBrowseData(){
      try {
        setLoadingPlaylists(true)
        const { username } = await Auth.currentUserInfo() 
        const  { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: { followers:  {notContains: username}, public: {eq: true} }}));
        const uniqueUsers = [...new Set(data.listPlaylists.items.map(playlist => playlist.owner))];
        setUsers(uniqueUsers);
        setAllPlaylists(data.listPlaylists.items);
        setLoadingPlaylists(false);
      } catch(error) {
        setLoadingPlaylists(false);
      }
    }
    fetchBrowseData();
  }, [])


  const toggleSelectedPlaylist = async (playlist) => {
    try{
      if(!playlist){
        setSelectedPlaylist(false);
        return;
      }
      setSelectedPlaylist(playlist);
      setLoadingPlaylistItems(true)
      const  { data } = await API.graphql(graphqlOperation(listItems, {filter: { itemPlaylistId:  {eq: playlist.id} }}));
      setPlaylistItems(data.listItems.items);
      setLoadingPlaylistItems(false)
    } catch (error){
      console.error('select playlist error', error);
    }
  }

  const toggleSelectedUserPlaylist = async (playlist) => {
    try{
      if(!playlist){
        setSelectedUserPlaylist(false);
        return;
      }
      setLoadingUserPlaylistItems(true)
      setSelectedUserPlaylist(playlist);
      const  { data } = await API.graphql(graphqlOperation(listItems, {filter: { itemPlaylistId:  {eq: playlist.id} }}));
      setUserPlaylistItems(data.listItems.items);
      setLoadingUserPlaylistItems(false)
    } catch (error){
      console.error('select playlist error', error);
    }
  }

  const selectUser = async (user) => {
    try{
      setSelectedUser(user);
      setLoadingUserPlaylists(true)
      const { username } = await Auth.currentUserInfo() 
      const  { data } = await API.graphql(graphqlOperation(listPlaylists, { filter: { owner:  { eq: user }, public: { eq: true }, followers:  {notContains: username}}}));
      setUserPlaylists(data.listPlaylists.items);
      setLoadingUserPlaylists(false)
      // if(!selectedUserPlaylist && data.listPlaylists.items.length){
      //   toggleSelectedUserPlaylist(data.listPlaylists.items[0]);
      // } 
    } catch (error){
      setSelectedUser(false);
      console.error('[browse] selectUser error', { error });
    }
  }


  const followPlaylist = async (playlist) => {
    try{
      setLoadingFollowPlaylist(true);
      const { username } = await Auth.currentUserInfo() 
      if(playlist.followers.includes(username)){
        return;
      }
      let followersInput = playlist.followers;
      followersInput.push(username);
      const followPlaylistInput = { id: playlist.id, followers: followersInput }
      await API.graphql({ query: updatePlaylistMutation, variables: { input: followPlaylistInput }});
      // setUserPlaylists(data.listPlaylists.items);
      // let newlyFollowedPlaylists = followPlaylistSuccess;
      // newlyFollowedPlaylists.push(playlist.id);
      // setFollowPlaylistSuccess(newlyFollowedPlaylists);
      const newAllPlaylistsArray = allPlaylists.filter(p => p.id !== playlist.id);
      setAllPlaylists(newAllPlaylistsArray);

      const newUserPlaylistsArray = userPlaylists.filter(p => p.id !== playlist.id);
      setUserPlaylists(newUserPlaylistsArray);

      setSelectedPlaylist(false);
      setSelectedUserPlaylist(false);
      setLoadingFollowPlaylist(false);
    } catch (error){
      console.error('[browse] followPlaylist error', { error });
      setLoadingFollowPlaylist(false);
    }
  }

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleTabChange = async (event, newTabValue) => {
    setTabValue(newTabValue);
    setLoadingUserPlaylists(false)
  };


  return (
    <div className='mobile-view-container'>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card position="fixed"  >
            <AppBar position="static" style={{height: '4em'}}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="playlist tabs" variant="fullWidth">
                <Tab label="Browse Playlists" {...a11yProps(0)} style={{textTransform: 'none', fontSize: '1em', fontWeight:'bold' }}/>
                <Tab label="Browse Users" {...a11yProps(1)} style={{textTransform: 'none', fontSize: '1em', fontWeight:'bold' }}/>
              </Tabs>
            </AppBar>
            { tabValue === 0 ?
              <React.Fragment >
                { loadingPlaylists ?
                  <CardContent style={{height: '75vh'}}>
                    <div className="loading-container"> 
                      <CircularProgress />
                    </div>
                  </CardContent >
                :
                  <CardContent >
                    <Grid container spacing={4} style={{ overflow:'scroll', overflowX:'hidden'}}>
                    { selectedPlaylist ?
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom:'8px'}}>
                            <IconButton onClick={() =>  setSelectedPlaylist(false)} style={{float: 'left'}}>
                              <ChevronLeftIcon />
                              <Typography style={{float: 'left', paddingLeft:'8px'}}>Browse Playlists</Typography> 
                            </IconButton>
                          </Grid>
                          <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px'}}>
                            <Divider />
                          </Grid>
                          <Grid item xs={12} style={{paddingBottom: '0px'}}>
                            <FeaturedPlayListOutlinedIcon fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                            <Typography variant='h4' style={{float: 'left', paddingRight:'16px', paddingTop:'6px' }}>{selectedPlaylist.title} Items</Typography>
                            <Typography variant='body2' style={{float: 'left', marginBottom:'16px', paddingTop:'10px' }}>{playlistItems.length} total</Typography>
                          </Grid>  
                          <Grid item xs={12}>
                            { loadingFollowPlaylist ?
                              <CircularProgress />
                            :
                              <Button     
                                size='medium'
                                variant='outlined'
                                color='primary'
                                startIcon={<SubscriptionsIcon />}
                                onClick={() => followPlaylist(selectedPlaylist)}
                                style={{ width: '100%', marginBottom:'16px' }}
                              >Follow Playlist</Button>
                            }
                          </Grid>
                          { loadingPlaylistItems ?
                              <div style={{height:'25vh', width:'100%'}}>
                                <div className="loading-container">
                                  <CircularProgress />
                                </div>
                              </div>
                            :
                              <React.Fragment>
                                { playlistItems.map(item => (
                                  <Grid item key={item.id} xs={6} sm={3}  style={cardContainer}>
                                    <Card style={playlistCard}>
                                      <CardContent >
                                          <Typography>{item.content}</Typography>
                                      </CardContent>
                                    </ Card>
                                  </Grid>
                                ))}
                              </React.Fragment>
                          }
                        </React.Fragment>
                      :
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom: '0px'}}>
                            <Reorder fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                            <Typography variant='h4' style={{float: 'left', paddingTop:'6px' }}>Top Playlists</Typography>
                          </Grid>  
                          { allPlaylists.map(p => (
                            <Grid item key={p.id} xs={6} sm={3} style={cardContainer}>
                              <Card 
                                onClick={() => toggleSelectedPlaylist(p)} 
                                style={p.id === selectedPlaylist.id ? { ...playlistCard, backgroundColor: theme.palette.secondary.main, color:'#000'} : { ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}} >
                                <CardContent >
                                  <Typography>{p.title}</Typography>
                                  <Typography variant='body2'>{p.owner}</Typography>
                                  <Typography variant='body2'>{p.items.items.length} item{p.items.items.length !== 1 ? "s" : null}</Typography>
                                  {/* <Typography variant='body2'>{p.followers.length - 1} follower{p.followers.length !== 0 ? "s" : null}</Typography> */}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </React.Fragment>
                      }                    
                    </Grid>
                  </CardContent >
                }
              </React.Fragment >
            :
              <React.Fragment>
                { loadingUserPlaylists ?
                  <CardContent style={{height: '75vh'}}>
                    <div className="loading-container"> 
                      <CircularProgress />
                    </div>
                  </CardContent >
                :
                  <CardContent >
                    <Grid container spacing={4}>
                      { selectedUser ?
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom:'8px'}}>
                            <IconButton onClick={() =>  setSelectedUser(false)} style={{float: 'left'}}>
                              <ChevronLeftIcon />
                              <Typography style={{float: 'left', paddingLeft:'8px'}}>Browse Users</Typography> 
                            </IconButton>
                          </Grid>
                          <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px'}}>
                            <Divider />
                          </Grid>
                          { loadingUserPlaylists ?
                              <div style={{height:'25vh', width:'100%'}}>
                                <div className="loading-container">
                                  <CircularProgress />
                                </div>
                              </div>
                            :
                              <React.Fragment>
                                { selectedUserPlaylist ?
                                  <React.Fragment>
                                    <Grid item xs={12} style={{paddingBottom:'8px'}}>
                                      <IconButton onClick={() =>  setSelectedUserPlaylist(false)} style={{float: 'left'}}>
                                        <ChevronLeftIcon />
                                        <Typography style={{float: 'left', paddingLeft:'24px'}}>{selectedUser} Playlists</Typography> 
                                      </IconButton>
                                    </Grid>
                                    <Grid item xs={12} style={{paddingBottom:'0px', paddingTop:'0px', marginLeft:'16px'}}>
                                      <Divider />
                                    </Grid>
                                    <Grid item xs={12} style={{paddingBottom: '0px'}}>
                                      <FeaturedPlayListOutlinedIcon fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                                      <Typography variant='h4' style={{float: 'left', paddingRight:'16px', paddingTop:'5px'}}>{selectedUserPlaylist.title} Items</Typography>
                                      <Typography variant='body2' style={{float: 'left', paddingTop:'10px', marginBottom:'16px',}}>{userPlaylistItems.length} total</Typography>
                                      { loadingFollowPlaylist ?
                                        <CircularProgress />
                                      :
                                        <Button     
                                          size='medium'
                                          variant='outlined'
                                          color='primary'
                                          startIcon={<SubscriptionsIcon />}
                                          onClick={() => followPlaylist(selectedUserPlaylist)}
                                          style={{ width: '100%' , marginBottom:'16px' }}
                                        >Follow Playlist</Button>
                                      }
                                    </Grid>  
                                    { loadingUserPlaylistItems ?
                                        <div style={{height:'25vh', width:'100%'}}>
                                          <div className="loading-container">
                                            <CircularProgress />
                                          </div>
                                        </div>
                                      :
                                      <React.Fragment>
                                        { userPlaylistItems.map(item => (
                                          <Grid item key={item.id} xs={6} sm={3} style={cardContainer}>
                                            <Card style={playlistCard}>
                                              <CardContent >
                                                  <Typography>{item.content}</Typography>
                                              </CardContent>
                                            </ Card>
                                          </Grid>
                                        ))}
                                      </React.Fragment>
                                    }
                                  </React.Fragment>
                                :
                                  <React.Fragment>
                                    <Grid item xs={12} style={{paddingBottom: '0px'}}>
                                      <Reorder fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                                      <Typography variant='h4' style={{float: 'left', paddingTop:'5px'}}>{selectedUser} Playlists</Typography>
                                    </Grid>  
                                    { userPlaylists.map(p => (
                                      <Grid item key={p.id} xs={6} sm={3} style={cardContainer}>
                                        <Card 
                                          onClick={() => toggleSelectedUserPlaylist(p)} 
                                          style={p.id === selectedUserPlaylist.id ? { 
                                            ...playlistCard, 
                                            backgroundColor: theme.palette.secondary.main, 
                                            color:'#000'} 
                                          : 
                                            playlistCard}
                                        >
                                          <CardContent >
                                            <Typography>{p.title}</Typography>
                                            <Typography variant='body2'>{p.items.items.length} item{p.items.items.length !== 1 ? "s" : null}</Typography>
                                            <Typography variant='body2'>{p.followers.length - 1} follower{p.followers.length !== 0 ? "s" : null}</Typography>
                                          </CardContent>
                                        </Card>
                                      </Grid>
                                    ))}
                                  </React.Fragment>
                                }
                              
                            </React.Fragment>
                          }
                        </React.Fragment>
                        :
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom: '0px'}}>
                            <AccountCircleIcon fontSize='large' style={{paddingRight:'16px', float:'left'}} />
                            <Typography variant='h4' style={{float: 'left' , paddingTop:'6px'}}>Users</Typography>
                          </Grid>  
                          { loadingPlaylists ?
                              <div style={{height:'25vh', width:'100%'}}>
                                <div className="loading-container">
                                  <CircularProgress />
                                </div>
                              </div>
                            :
                              <React.Fragment>
                                {users.map(user => (
                                  <Grid item key={user} xs={6} sm={3}  style={cardContainer}>
                                    <Card 
                                      onClick={() => selectUser(user)} 
                                      style={user === selectedUser ? { 
                                        ...playlistCard, 
                                        backgroundColor: theme.palette.secondary.main, 
                                        color:'#000'} 
                                      : 
                                        playlistCard}
                                    >                            
                                      <CardContent >
                                        <Typography>{user}</Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}
                              </React.Fragment>
                          }
                        </React.Fragment>
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

export default BrowseMobile;