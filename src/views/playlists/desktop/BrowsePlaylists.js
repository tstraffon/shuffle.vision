import React, { useEffect, useState } from 'react';
import '../../../App.css';
import PlaylistDetails from './PlaylistDetails.js';

import { 
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Typography 
} from '@material-ui/core';

import Reorder from '@material-ui/icons/PlaylistPlay';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import theme from '../../../theme';

const playlistCard = { height: '150px', width: '150px', borderRadius:'50%',alignItems: 'center', backgroundColor: theme.palette.primary.main, color:'#FFF',  display: 'flex', justifyContent: 'center'  }
const cardContainer = {justifyContent: 'center', display: 'grid'}

const YourPlaylists = (props) => {
  const [loadingPlaylists, setLoadingPlaylists] = React.useState(true);
  const [playlists, setPlaylists] = React.useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(false);

  useEffect( () => {
    async function getPlaylists (){
      try {
        if(props.selectedPlaylist){
          setSelectedPlaylist(props.selectedPlaylist);
          setLoadingPlaylists(false);
        }
        setPlaylists(props.playlists);
        setLoadingPlaylists(false);
      } catch(error) {
        console.error('[playlists-you-follow] getPlaylists error', { error });
        setLoadingPlaylists(false);
      }
    }
    getPlaylists();
  }, []);


  const toggleSelectedPlaylist = async (newPlaylist) => {
    if(!selectedPlaylist || newPlaylist.id !== selectedPlaylist.id){
      setSelectedPlaylist(newPlaylist);
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
          {selectedPlaylist ?
            <React.Fragment>
              <Grid item xs={12} style={{paddingBottom:'8px'}}> 
                <IconButton onClick={() => setSelectedPlaylist(false)} style={{float: 'left', paddingLeft:'32px', borderRadius:'5%'}}>
                  <ChevronLeftIcon />
                  <Typography style={{float: 'left', paddingLeft:'8px'}}>Browse All Playlists</Typography> 
                </IconButton>
              </Grid>    
              <Grid item xs={12} style={{ paddingTop:'0px', paddingLeft:'32px'}}>
                <Divider />
              </Grid>   
              <PlaylistDetails selectedPlaylist={selectedPlaylist} followed={false} />
            </React.Fragment>
          :
            <React.Fragment>
              <Grid item xs={12} style={{marginBottom:'16px'}} >
                <Reorder size='small' style={{paddingRight:'16px', float:'left'}} />
                <Typography variant='h4' style={{float: 'left', }}>All Playlists</Typography>
              </Grid>  
              <Grid container spacing={4} >
                { playlists.map(p => (
                  <Grid item key={p.id} xs={12} md={2} style={cardContainer}>
                    <Card onClick={() => toggleSelectedPlaylist(p)} style={{ ...playlistCard, backgroundColor: theme.palette.primary.main, color:'#FFF'}}>
                      <CardContent  >
                        <Typography>{p.title}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </React.Fragment>
          }          
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default YourPlaylists; 