import React, { useEffect, useState } from 'react';
import '../../../App.css';

import { 
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography 
} from '@material-ui/core';

import {
  followPlaylistConnector,
  unfollowPlaylistConnector,
} from '../../../util/apiConnectors.js';

import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined'
import SearchIcon from '@material-ui/icons/Search';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import theme from '../../../theme';

const itemsCard = { height: '150px', width: '150px', alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF', display: 'flex', justifyContent: 'center' };
const cardContainer = { justifyContent: 'center', display: 'grid' };

const PlaylistDetails = (props) => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [loadingPlaylistItems, setLoadingPlaylistItems] = React.useState(true);
  const [loadingFollowPlaylist, setLoadingFollowPlaylist] = React.useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);
  const [playlistItems, setPlaylistItems] = React.useState([]);
  const [followedPlaylist, setFollowedPlaylist] = React.useState(false);


  useEffect( () => {
    async function getPlaylistDetails (){
      try {
        if(props.selectedPlaylist){
          setSelectedPlaylist(props.selectedPlaylist);
          setPlaylistItems(props.selectedPlaylist.items.items);
          setLoadingPlaylistItems(false);
          setLoadingPlaylists(false);
          if(props.followed){
            setFollowedPlaylist(true);
          }
        }
      } catch(error) {
        console.error('[playlist] getPlaylistDetails error', { error });
        setLoadingPlaylists(false);
      }
    }
    getPlaylistDetails();
  }, []);

  const toggleFollowPlaylist = async (playlist) => {
    try {
      setLoadingFollowPlaylist(true);
      if(followedPlaylist){
        await unfollowPlaylistConnector(playlist);
        setFollowedPlaylist(false);
      } else {
        await followPlaylistConnector(playlist)
        setFollowedPlaylist(true)
      }
      setLoadingFollowPlaylist(false);
    } catch (error){
      console.error('[browse] followPlaylist error', { error });
      setLoadingFollowPlaylist(false);
    }
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
          <Grid item xs={6} style={{paddingTop: '0px'}} >
            <SearchIcon size='small' style={{paddingRight:'16px', float:'left'}} />
            <Typography variant='h4' style={{float: 'left', paddingRight:'16px'}}>{selectedPlaylist.title}</Typography>

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
                  <TableCell style={{height:'19px'}}>{selectedPlaylist.public.toString().charAt(0).toUpperCase() + selectedPlaylist.public.toString().slice(1)}</TableCell>                      
                  <TableCell>Followers:</TableCell>
                  <TableCell>{selectedPlaylist.followers.length - 1}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12} >
            <Divider style={{marginBottom: '16px'}}/>
            <FeaturedPlayListOutlinedIcon size='small' style={{paddingRight:'16px', float:'left'}} />
            <Typography variant='h4' style={{float: 'left', marginBottom: '16px'}}>{selectedPlaylist.title} Items</Typography>
            { loadingFollowPlaylist ?
              <div className="loading-container" style={{float: 'right', marginRight: '96px', top:'0px'}} > 
                <CircularProgress />
              </div>
            :
              <Button     
                startIcon={<SubscriptionsIcon />}
                variant='contained'
                color='secondary'
                onClick={() => toggleFollowPlaylist(selectedPlaylist)}
                style={{float: 'right', marginRight: '16px'}}
              >{followedPlaylist ? 'Unfollow Playlist' : 'Follow Playlist'}</Button>
            }
            { loadingPlaylistItems ?
              <div style={{height:'25vh', width:'80%'}}>
                <div className="loading-container"> 
                  <CircularProgress />
                </div>
              </div>
            :
              <Grid container spacing={4} style={{marginBottom: '16px'}}>
                { playlistItems.map(item => (
                  <Grid item key={item.id} xs={12} md={2} style={cardContainer}>
                    <Card style={itemsCard}>
                      <CardContent >
                        <Typography>{item.content}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
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