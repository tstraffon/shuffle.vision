import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import SearchBar from './SearchBar';
import JukeBox from './JukeBox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { connect } from 'react-redux';


const styles = theme => ({
  topBar: {
    flexGrow: 1,
  },
  searchBar: {
    width: '100%',
  },
  jukeBox: {
    width: '100%',
  },
});

class TopBar extends React.Component {

  render() {
    const { classes, beat, cart } = this.props;
    const cartCount = cart.length;

    return (

        <React.Fragment>
        <CssBaseline />
            <Grid container spacing={40} className={classes.topBar}>
                <Grid item key={'searchBar'} sm={8} md={6} lg={4}>
                    <SearchBar className={classes.searchBar}/>
                </Grid>
                <Grid item key={'jukeBox'} sm={12} md={10} lg={7}>
                    <JukeBox className={classes.jukeBox} beat={beat} /> 
                </Grid>
                <Grid item key={'jukeBox'} sm={4} md={2} lg={1}>
                <IconButton color="inherit" to="/checkout">
                    <Badge badgeContent={cartCount} color="secondary">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
                </Grid>
            </Grid>

        </React.Fragment>

    );
  }
}

// TopBarContainer
const mapStateToProps = state => ({
    cart: state.cart,
});

const TopBarContainer = connect(
    mapStateToProps,
)(TopBar);

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBarContainer);
