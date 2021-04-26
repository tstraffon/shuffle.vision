import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import './App.css';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import { 
  AppBar,
  CssBaseline,
  Box, 
  Divider,
  Drawer,
  Grid, 
  IconButton,
  ListItemIcon, 
  MenuItem, 
  MenuList, 
  Toolbar,
  Typography 
} from '@material-ui/core';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import Reorder from '@material-ui/icons/PlaylistPlay';
import PublicIcon from '@material-ui/icons/Public';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { isMobile, isTablet } from 'react-device-detect';
import theme from './theme';

import { 
  BrowseMobile,
  Playlist,
  PlaylistMobile,
  Profile,
  Shuffle,
  ShuffleMobile, 
} from "./views/index.js";


// styles
const navMenutItem = {color: "white", paddingLeft:'16px'}
const navBar = { 
  width: '17%',
  height: '100%',
  flexGrow: 1,
  backgroundColor: theme.palette.primary.main,
  paddingTop: '32px',
  color: 'white',
  position: 'fixed',
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  title: {
    flexGrow: 1,
    fontWeight:'bold',
    fontSize: '2em',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    // width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
    color:'#FFF',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    backgroundColor: theme.palette.secondary.main,
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    backgroundColor:'#000',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
}));

const signOut = async () => {
  try {
      // setLoadingSignOut(true)
      await Auth.signOut();
      window.location.replace("https://shuffle.vision");
  } catch (error) {
      console.error('error signing out: ', error);
  }
}


function App() {

  const [ mobileMenuOpen, setMobileMenuOpen ] = React.useState(false);
  const classes = useStyles();
  const theme = useTheme();

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="App">
      <BrowserRouter bassname="/">
        <Grid container spacing={8} style={{maxHeight: '100vh'}} justify="center">
          { !isMobile && !isTablet ?
            <React.Fragment>
              <Grid item xs={2} style={{paddingTop: '0px'}}>    
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
                      <MenuItem component={NavLink} to={"/profile"} >
                        <ListItemIcon style={navMenutItem}>
                          <AccountCircleIcon fontSize="large" />
                        </ListItemIcon>
                        <Typography variant="inherit">Profile</Typography>
                      </MenuItem>
                      <MenuItem onClick={() => signOut} >
                        <ListItemIcon style={navMenutItem}>
                          <ExitToAppIcon fontSize="large" />
                        </ListItemIcon>
                        <Typography variant="inherit">Sign Out</Typography>
                      </MenuItem>
                    </MenuList>
                  </Box>
                </div>
              </Grid>
              <Grid item xs={10} style={{paddingRight: '96px', paddingLeft: '96px', maxHeight: '100vh' }}>  
                <div className={"content-container"}>
                  <Switch>
                    <Route exact path ="/" render={()=> <Shuffle/>}></Route>
                    <Route path ="/playlists" render={()=> <Playlist />}></Route> 
                    <Route path ="/profile" render={()=> <Profile />}></Route> 
                  </Switch> 
                </div>
            </Grid> 
            </React.Fragment>
          :
            <div className={classes.root}>
              <CssBaseline />
              <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: mobileMenuOpen,
                })}
              >
                <Toolbar>
                  <Typography variant="h6" noWrap className={classes.title}>
                    shuffle.vision
                  </Typography>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleMobileMenuOpen}
                    className={clsx(mobileMenuOpen && classes.hide)}
                  >
                    <MenuIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={mobileMenuOpen}
                classes={{
                  paper: classes.drawerPaper,
                }}
              >
                <div className={classes.drawerHeader}>
                  <IconButton onClick={() => handleMobileMenuClose()}>
                    {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon style={{color:'#000'}} />}
                  </IconButton>
                </div>
                <Divider />
                <MenuList>
                  <MenuItem component={NavLink} onClick={() => handleMobileMenuClose()} to={"/"} >
                    <ListItemIcon>
                      <ShuffleIcon style={{color:'#FFF'}} fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Shuffle</Typography>
                  </MenuItem>
                  <MenuItem component={NavLink} onClick={() => handleMobileMenuClose()} to={"/playlists"} >
                    <ListItemIcon>
                      <Reorder style={{color:'#FFF'}} fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Playlists</Typography>
                  </MenuItem>
                  <MenuItem component={NavLink} onClick={() => handleMobileMenuClose()} to={"/profile"} >
                    <ListItemIcon>
                      <AccountCircleIcon style={{color:'#FFF'}} fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => signOut()} >
                    <ListItemIcon>
                      <ExitToAppIcon style={{color:'#FFF'}} fontSize="large" />
                    </ListItemIcon>
                    <Typography variant="inherit">Sign Out</Typography>
                  </MenuItem>
                </MenuList>
              </Drawer>
              <Grid item xs={12} style={{ paddingTop: '56px', maxHeight: '100vh' }}>  
                <div className={"content-container"}>
                  <Switch>
                    <Route exact path ="/" render={()=> <ShuffleMobile/>}></Route>
                    <Route path ="/playlists" render={()=> <PlaylistMobile />}></Route> 
                    <Route path ="/profile" render={()=> <Profile />}></Route> 
                  </Switch> 
                </div>
              </Grid>
            </div>
          }
        </Grid>
      </BrowserRouter>  
    </div>
  );
}

export default withAuthenticator(App);