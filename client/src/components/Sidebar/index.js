import React from 'react';
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
import axios from 'axios';




const styles = theme => ({
    fab: {
        float: 'right',
        margin: theme.spacing.unit,
      },
    menuContainer: {
        width: '10%',
        float: 'right',
        margin: theme.spacing.unit * 2,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit * 2,
    },
    paper: {
        width: '25%',
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



class Sidebar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      addPhrase: false,
      textFieldValue: "",
    };
  }

    _handleTextFieldChange= (e) => {
        this.setState({
            textFieldValue: e.target.value
        });
    }

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
    const { loading, addPhrase } = this.state;
    if(loading){
      return(<div></div>);
    }

    return (
      
      <React.Fragment>
        <CssBaseline />
            {addPhrase ?  
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
                        <Button size="large" color="secondary" className={classes.button} onClick={() => { this.addPhrase(); }}>
                            Submit
                        </Button>
                        <Button size="large" color="secondary" className={classes.button} onClick={() => { this.toggleAddPhrase(); }}>
                            Cancel
                        </Button>
                    </Paper>
                </Slide>
                :
                <div className={classes.menuContainer}>
                    <Fab color="primary" aria-label="add" className={classes.fab} onClick={() => { this.toggleAddPhrase(); }}>
                        <AddIcon />
                    </Fab>
                    <Fab color="primary" aria-label="playlist" className={classes.fab} onClick={() => { this.toggleAddPhrase(); }}>
                        <Reorder />
                    </Fab>
                    <Fab color="primary" aria-label="photos" className={classes.fab} onClick={() => { this.toggleAddPhrase(); }}>
                        <Filter />
                    </Fab>
                    <Fab color="primary" aria-label="profile" className={classes.fab} onClick={() => { this.toggleAddPhrase(); }}>
                        <AccountCircle />
                    </Fab>
                </div>
            }
      </React.Fragment>
    );
  }
}


Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sidebar);

