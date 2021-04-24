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
  Tab,
  Tabs,
  Typography 
}from '@material-ui/core';
import Reorder from '@material-ui/icons/PlaylistPlay';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import theme from '../../theme';


const playlistCard = { height: '150px', width: '150px', alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF', display: 'flex', justifyContent: 'center'}
const cardContainer = {justifyContent: 'center', display: 'grid'}

const Browse = () => {
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
        const playlistsWithItems = data.listPlaylists.items.filter(p => p.items.items.length > 0);
        const uniqueUsers = [...new Set(data.listPlaylists.items.map(playlist => playlist.owner))];
        setUsers(uniqueUsers);
        setAllPlaylists(playlistsWithItems);
        if(playlistsWithItems.length){
          setSelectedPlaylist(playlistsWithItems[0]);
          toggleSelectedPlaylist(playlistsWithItems[0])
        } 
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
      if(!selectedUserPlaylist && data.listPlaylists.items.length){
        toggleSelectedUserPlaylist(data.listPlaylists.items[0]);
      } 
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
    if(newTabValue === 1 && users.length && !userPlaylists.length){
      setSelectedUser(users[0]);
      await selectUser(users[0])
    }
  };


  return (
    <div className='view-container'>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card position="fixed" style={{playlistCard}} >
            <AppBar position="static" style={{height: '4em'}}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="playlist tabs" variant="fullWidth">
                <Tab label="Browse Playlists" {...a11yProps(0)} style={{textTransform: 'none', fontSize: '1.6em',  height: '4em', paddingBottom:'1.75em'}}/>
                <Tab label="Browse Users" {...a11yProps(1)} style={{textTransform: 'none', fontSize: '1.6em', height:'4em',  paddingBottom:'1.75em'}}/>
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
                      <Grid item xs={12} style={{paddingBottom: '0px'}}>
                        <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                        <Typography variant='h4' style={{float: 'left', }}>Top Playlists</Typography>
                      </Grid>  
                      { allPlaylists.map(p => (
                        <Grid item key={p.id} xs={12} sm={6} md={3} lg={2} style={cardContainer}>
                          <Card 
                            onClick={() => toggleSelectedPlaylist(p)} 
                            style={p.id === selectedPlaylist.id ? { ...playlistCard, backgroundColor: theme.palette.secondary.main, color:'#000'} : { ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}} >
                            <CardContent >
                              <Typography>{p.title}</Typography>
                              <Typography variant='body2'>{p.owner}</Typography>
                              <Typography variant='body2'>{p.items.items.length} item{p.items.items.length !== 1 ? "s" : null}</Typography>
                              <Typography variant='body2'>{p.followers.length - 1} follower{p.followers.length !== 0 ? "s" : null}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                      { selectedPlaylist ?
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom: '0px'}}>
                            <Divider style={{marginBottom: '16px'}}/>
                            <FeaturedPlayListOutlinedIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                            <Typography variant='h4' style={{float: 'left', paddingRight:'16px' }}>{selectedPlaylist.title} Items</Typography>
                            <Typography variant='body2' style={{float: 'left', paddingTop:'4px'}}>{playlistItems.length} total</Typography>
                            { loadingFollowPlaylist ?
                              <div className="loading-container" style={{float: 'right', marginRight: '64px', top:'0',}} > 
                                <CircularProgress />
                              </div>
                            :
                              <React.Fragment>
                                <Button     
                                  size='medium'
                                  startIcon={<SubscriptionsIcon />}
                                  onClick={() => followPlaylist(selectedPlaylist)}
                                  style={{float: 'right', marginRight: '16px'}}
                                >Follow Playlist</Button>
                              </React.Fragment>
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
                                  <Grid item key={item.id} xs={12} md={2} style={cardContainer}>
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
                        null
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
                      <Grid item xs={12} style={{paddingBottom: '0px'}}>
                        <AccountCircleIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                        <Typography variant='h4' style={{float: 'left' }}>Users</Typography>
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
                              <Grid item key={user} xs={12} md={2} style={cardContainer}>
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
                      { selectedUser ?
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom: '0px'}}>
                            <Divider style={{marginBottom: '16px'}}/>
                            <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                            <Typography variant='h4' style={{float: 'left', }}>{selectedUser} Playlists</Typography>
                          </Grid>  
                          { loadingUserPlaylists ?
                              <div style={{height:'25vh', width:'100%'}}>
                                <div className="loading-container">
                                  <CircularProgress />
                                </div>
                              </div>
                            :
                              <React.Fragment>
                                { userPlaylists.map(p => (
                                  <Grid item key={p.id} xs={12} md={2} style={cardContainer}>
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
                        :
                        null
                      }
                      { selectedUserPlaylist ?
                        <React.Fragment>
                          <Grid item xs={12} style={{paddingBottom: '0px'}}>
                            <Divider style={{marginBottom: '16px'}}/>
                            <FeaturedPlayListOutlinedIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                            <Typography variant='h4' style={{float: 'left', paddingRight:'16px' }}>{selectedUserPlaylist.title} Items</Typography>
                            <Typography variant='body2' style={{float: 'left', paddingTop:'4px'}}>{userPlaylistItems.length} total</Typography>
                            { loadingFollowPlaylist ?
                              <div className="loading-container" style={{float: 'right', marginRight: '16px'}} > 
                                <CircularProgress />
                              </div>
                            :
                              <Button     
                                size='medium'
                                startIcon={<SubscriptionsIcon />}
                                onClick={() => followPlaylist(selectedUserPlaylist)}
                                style={{float: 'right', marginRight: '16px'}}
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
                                <Grid item key={item.id} xs={12} md={2} style={cardContainer}>
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
                        null
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

export default Browse;