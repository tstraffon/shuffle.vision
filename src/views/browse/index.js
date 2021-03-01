import React, { useEffect, useState } from 'react';
import '../../App.css';
import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listPlaylists, listItems } from '../../graphql/queries';
import { updatePlaylist as updatePlaylistMutation } from '../../graphql/mutations';
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Typography 
}from '@material-ui/core';
import Reorder from '@material-ui/icons/PlaylistPlay';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined';
import PublicIcon from '@material-ui/icons/Public';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import theme from '../../theme';

const cardHeaderStyle = { backgroundColor: theme.palette.primary.main, float:'left', color:'white', fontSize:'16px', width:'100%' }
const cardContentStyle = { overflow: 'scroll', overflowX: 'hidden', maxHeight:'450px'}

const playlistCard = { height: '150px', width: '150px', alignItems: 'center'}
const playlistCardContent = { paddingTop:'42px'}

const Playlist = () => {
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


  useEffect(async () => {
    await fetchPlaylists();
  }, [])


  const fetchPlaylists = async () => {
      try {
        setLoadingPlaylists(true)
        const { username } = await Auth.currentUserInfo() 
        const  { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: { followers:  {notContains: username}, public: {eq: true} }}));
        const uniqueUsers = [...new Set(data.listPlaylists.items.map(playlist => playlist.owner))];
        console.log(data.listPlaylists.items)
        setUsers(uniqueUsers);
        setAllPlaylists(data.listPlaylists.items);
        setLoadingPlaylists(false)
      } catch(error) {
        console.error('[playlist-fetchPlaylists] error', error);
      }
  }


  const toggleSelectedPlaylist = async (playlist) => {
    try{
      console.log("new selected playlist", playlist)
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
      console.log('fetchPlaylistItems data', data);
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
      const  { data } = await API.graphql(graphqlOperation(listPlaylists, { filter: { owner:  { eq: user }, public: { eq: true } }}));
      setUserPlaylists(data.listPlaylists.items);
      setLoadingUserPlaylists(false)
      console.log('[browse] selectUser result', data);
    } catch (error){
      setSelectedUser(false);
      console.error('[browse] selectUser error', { error });
    }
  }

  const deselectUser = () => {
    setSelectedUser(false);
    setSelectedUserPlaylist(false);
  }


  const followPlaylist = async (playlist) => {
    try{
      console.log('[browse] followPlaylist playlist', playlist);

      const { username } = await Auth.currentUserInfo() 
      if(playlist.followers.includes(username)){
        return;
      }
      let followersInput = playlist.followers;
      followersInput.push(username);
      const followPlaylistInput = { id: playlist.id, followers: followersInput }
      console.log('[browse] followPlaylist uboyt', followPlaylistInput);
      const  { data } = await API.graphql({ query: updatePlaylistMutation, variables: { input: followPlaylistInput }});
      // setUserPlaylists(data.listPlaylists.items);
      console.log('[browse] followPlaylist result', data);
    } catch (error){
      console.error('[browse] followPlaylist error', { error });
    }
  }


  return (
    <div className='view-container'>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card position="fixed" style={{ backgroundColor: '#efefee' }}>
            <CardHeader
              avatar={<PublicIcon size='large' />}
              title={<span style={{float: 'left', fontSize:'24px'}}>Browse by Playlist</span>}
              style={cardHeaderStyle}
            />
            <CardContent >
              <Grid container spacing={4}>
                <Grid item xs={12} style={{paddingBottom: '0px'}}>
                  <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                  <Typography variant='h4' style={{float: 'left', }}>Top Playlists</Typography>
                </Grid>  
                { loadingPlaylists ?
                  <div style={{height:'25vh', width:'100%'}}>
                    <div className="loading-container">
                      <CircularProgress />
                    </div>
                  </div>
                :
                  <React.Fragment style={cardContentStyle}>
                    { allPlaylists.map(p => (
                      <Grid item key={p.id} xs={12} sm={6} md={3} lg={2}>
                        <Card 
                          onClick={() => toggleSelectedPlaylist(p)} 
                          style={p.id === selectedPlaylist.id ? { 
                            ...playlistCard, 
                            backgroundColor: theme.palette.primary.main, 
                            color:'#FFF'} 
                          : 
                            playlistCard}
                        >
                          <CardContent style={playlistCardContent}>
                            <Typography>{p.title}</Typography>
                            <Typography variant='body2'>{p.owner}</Typography>
                            <Typography variant='body2'>{p.items.items.length} item{p.items.items.length !== 1 ? "s" : null}</Typography>
                            <Typography variant='body2'>{p.followers.length - 1} follower{p.followers.length !== 0 ? "s" : null}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </React.Fragment>
                }
                { selectedPlaylist ?
                  <React.Fragment>
                    <Grid item xs={12} style={{paddingBottom: '0px'}}>
                      <Divider style={{marginBottom: '16px'}}/>
                      <FeaturedPlayListOutlinedIcon size='small' style={{paddingRight:'16px', float:'left'}} />
                      <Typography variant='h4' style={{float: 'left', paddingRight:'16px' }}>{selectedPlaylist.title} Items</Typography>
                      <Typography variant='body2' style={{float: 'left', paddingTop:'4px'}}>{playlistItems.length} total</Typography>
                      <Button   
                        size='medium'
                        startIcon={<CancelOutlinedIcon />}
                        onClick={() => toggleSelectedPlaylist(false)}
                        style={{float: 'right'}}
                      >Close</Button>
                      <Button     
                        size='medium'
                        startIcon={<SubscriptionsIcon />}
                        onClick={() => followPlaylist(selectedUserPlaylist)}
                        style={{float: 'right', marginRight: '16px'}}
                      >Follow Playlist</Button>
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
                            <Grid item key={item.id} xs={12} md={2}>
                              <Card style={playlistCard}>
                                <CardContent style={{paddingTop: '60px'}}>
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
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card position="fixed" color="primary">
            <CardHeader
              avatar={<PublicIcon size='large' />}
              title={<span style={{float: 'left', fontSize:'24px'}}>Browse by User</span>}
              style={cardHeaderStyle}
            />
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
                        <Grid item key={user} xs={12} md={2}>
                          <Card 
                            onClick={() => selectUser(user)} 
                            style={user === selectedUser ? { 
                              ...playlistCard, 
                              backgroundColor: theme.palette.primary.main, 
                              color:'#FFF'} 
                            : 
                              playlistCard}
                          >                            
                            <CardContent style={playlistCardContent}>
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
                      <Button   
                        size='medium'
                        startIcon={<CancelOutlinedIcon />}
                        onClick={deselectUser}
                        style={{float: 'right'}}
                      >Close</Button>
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
                            <Grid item key={p.id} xs={12} md={2}>
                              <Card 
                                onClick={() => toggleSelectedUserPlaylist(p)} 
                                style={p.id === selectedUserPlaylist.id ? { 
                                  ...playlistCard, 
                                  backgroundColor: theme.palette.primary.main, 
                                  color:'#FFF'} 
                                : 
                                  playlistCard}
                              >
                                <CardContent style={playlistCardContent}>
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
                      <Button   
                        size='medium'
                        startIcon={<CancelOutlinedIcon />}
                        onClick={() => toggleSelectedUserPlaylist(false)}
                        style={{float: 'right'}}
                      >Close</Button>
                      <Button     
                        size='medium'
                        startIcon={<SubscriptionsIcon />}
                        onClick={() => followPlaylist(selectedUserPlaylist)}
                        style={{float: 'right', marginRight: '16px'}}
                      >Follow Playlist</Button>
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
                          <Grid item key={item.id} xs={12} md={2}>
                            <Card style={playlistCard}>
                              <CardContent style={{paddingTop: '60px'}}>
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
          </Card>
        </Grid>
      </Grid>
    </div>
  );

}

export default Playlist;