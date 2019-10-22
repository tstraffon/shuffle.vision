import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import { Link, Route, Switch } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import { 
  Home, 
  Playlists,
  Images,
  Account,
  SignIn,
  NavMenu,
  FilterMenu,
} from "./components/index.js";


const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing.unit * 4,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  searchField: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin:'auto',
    width: '100%',
  },
});

class App extends React.Component {

  render() {
    const { classes } = this.props;

    return (

      <div className={classes.root}>
        <React.Fragment>

            <CssBaseline />

            <AppBar
                position="fixed"
                className={classNames(classes.appBar)}
            >
            </AppBar>
            <main className={classes.content}>
            <Grid container spacing={16} justify="center">
                <Grid item xs={3}>
                    <FilterMenu />
                </Grid>
                <Grid item xs={6}>
                    <Switch>
                        <Route exact path ="/" render={()=> <Home/>}></Route>
                        <Route path ="/playlists" render={()=> <Playlists />}></Route> 
                        <Route path="/images" render={()=> <Images />} />
                        <Route path="/account" render={()=> <Account />} />
                    </Switch> 
                </Grid>
                <Grid item xs={3}>
                    <NavMenu />
                </Grid>
            </Grid>                
            </main>
        </React.Fragment>

    </div>

    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
