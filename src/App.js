import React, { useState, useEffect } from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import { Box, Grid, ListItemIcon, MenuItem, MenuList, Typography } from '@material-ui/core';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import Reorder from '@material-ui/icons/PlaylistPlay';
import PublicIcon from '@material-ui/icons/Public';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import theme from './theme';

import { 
  Browse,
  Playlist,
  Shuffle, 
} from "./views/index.js";

// styles
const navMenutItem = {color: "white", paddingLeft:'16px'}
const navBar = { 
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.primary.main,
  paddingTop: '32px',
  color: 'white',
  /* position: absolute; */
}

const signOut = async () => {
  try {
      await Auth.signOut();
  } catch (error) {
      console.log('error signing out: ', error);
  }
}

function App() {

  return (
    <div className="App">
      <BrowserRouter bassname="/">
        <Grid container spacing={8} justify="center">
          <Grid item xs={3} sm={3} style={{paddingTop: '0px'}}>    
            <div style={navBar}>
              <h1>shuffle.vision</h1>
              <Box p={2} style={{paddingLeft: '0px', paddingRight: '0px'}}>
                <MenuList>
                  <MenuItem component={NavLink} to={"/"} >
                    <ListItemIcon style={navMenutItem}>
                      <ShuffleIcon fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Shuffle</Typography>
                  </MenuItem>
                  <MenuItem component={NavLink} to={"/playlists"} >
                    <ListItemIcon style={navMenutItem}>
                      <Reorder fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Playlists</Typography>
                  </MenuItem>
                  <MenuItem component={NavLink} to={"/browse"} >
                    <ListItemIcon style={navMenutItem}>
                      <PublicIcon fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Browse</Typography>
                  </MenuItem>
                  <MenuItem component={NavLink} to={"/browse"} >
                    <ListItemIcon style={navMenutItem}>
                      <AccountCircleIcon fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={signOut} >
                    <ListItemIcon style={navMenutItem}>
                      <ExitToAppIcon fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Sign Out</Typography>
                  </MenuItem>
                </MenuList>
              </Box>
            </div>
          </Grid>
          <Grid item xs={9} style={{paddingRight: '96px'}}>  
            <div className={"content-container"}>
              <Switch>
                <Route exact path ="/" render={()=> <Shuffle/>}></Route>
                <Route path ="/playlists" render={()=> <Playlist />}></Route> 
                <Route path ="/browse" render={()=> <Browse />}></Route> 
              </Switch> 
            </div>
          </Grid>
        </Grid>
      </BrowserRouter>  
    </div>
  );
}

export default withAuthenticator(App);