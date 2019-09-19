import React, {Component} from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Reorder from '@material-ui/icons/PlaylistPlay';
import Filter from '@material-ui/icons/Filter';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { Link } from 'react-router-dom';
import axios from 'axios';




const styles = theme => ({
    fab: {
        float: 'left',
        margin: theme.spacing.unit,
      },
    menuContainer: {
        width: '100%',
        height: '100%',
        // float: 'right',
        // margin: theme.spacing.unit * 2,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit * 2,
    },
    fabContainer: {
        width: '25%',
        float:'right',
        marginTop: theme.spacing.unit * 2,
    },
    paper: {
        width: '100%',
        float: 'right',
        padding: theme.spacing.unit * 2,
    },
    textField: {    
        width: '90%',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
    },
    button:{
        width: '50%',
        margin: 'auto',
        paddingTop: 2,
        paddingBottom: 2,
        border: '2px',
        transition: 'all .2s ease-in-out',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    },
});




class NavMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showMenu: false,
      addPhrase: false,
      textFieldValue: "",
      filterOpen: false,
    };
  }

    _handleTextFieldChange= (e) => {
        this.setState({
            textFieldValue: e.target.value
        });
    }

    toggleMenu = () => {     
        const currentState = this.state.showMenu;
        this.setState({ showMenu: !currentState });
    };

    toggleAddPhrase = () => {
        const currentState = this.state.addPhrase;
        this.setState({addPhrase: !currentState, textFieldValue:""});
    } 

    addPhrase = async () => {
        const { textFieldValue } = this.state;
        console.log('[addPhrase] adding new phrase to db', textFieldValue);

        await axios.get('/api/addPhrase',{
            params: {
                phrase: textFieldValue,
                memberId: "582731e4-cccb-11e9-bea0-88e9fe785c3a",
                playlistId: "7fc3d6ac-cccc-11e9-bea0-88e9fe785c3a",
            },
        }); 
        
        const currentState = this.state.addPhrase;

        this.setState({addPhrase: !currentState});
    }          

    async componentDidMount() {
        this.setState({loading: false})
    }

  render() {
    const { classes, } = this.props;
    const { loading, addPhrase, showMenu } = this.state;
    if(loading){
      return(<div></div>);
    }

    return (  
        <div className={classes.menuContainer} onMouseEnter={this.toggleMenu} onMouseLeave={this.toggleMenu}>
            <CssBaseline />
            <Slide direction="left" in={showMenu} mountOnEnter unmountOnExit>
                <div>
                    <Slide direction="left" in={addPhrase} mountOnEnter unmountOnExit>
                        <Paper className={classes.paper}>
                            <TextField
                                id="outlined-uncontrolled"
                                label="new phrase"
                                value={this.state.textFieldValue} 
                                onChange={this._handleTextFieldChange}                    
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            /> 
                            <Button size="large" color="secondary" className={classes.button} onClick={this.addPhrase}>
                                Submit
                            </Button>
                            <Button size="large" color="secondary" className={classes.button} onClick={this.toggleAddPhrase}>
                                Cancel
                            </Button>
                        </Paper>
                    </Slide>
                    <div className={classes.fabContainer}>
                        <Slide direction="left" in={!addPhrase} mountOnEnter unmountOnExit>
                            <Fab color="primary" aria-label="playlist" className={classes.fab} onClick={this.toggleAddPhrase}>
                                <AddIcon />
                            </Fab>
                        </Slide>
                        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                            <Fab color="primary" aria-label="playlist" className={classes.fab} button component={Link} to="/playlists">
                                <Reorder />
                            </Fab>
                        </Slide>
                        {/* <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                            <Fab color="primary" aria-label="photos" className={classes.fab} button component={Link} to="/images">
                                <Filter />
                            </Fab>
                        </Slide> */}
                        <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                            <Fab color="primary" aria-label="profile" className={classes.fab} button component={Link} to="/account">
                                <AccountCircle />
                            </Fab>
                        </Slide> 
                    </div>
                </div>
            </Slide>
        </div>
    );
  }
}


NavMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavMenu);

