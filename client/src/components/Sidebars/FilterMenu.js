import React, {Component} from 'react';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Card from '@material-ui/core/Card';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import FilterIcon from '@material-ui/icons/FilterList';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import { AddToSessionPlaylists } from '../../actions/index.js';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';



const styles = theme => ({
    fab: {
        float: 'left',
        margin: theme.spacing.unit,
      },
    menuContainer: {
        width: '100%',
        height: '100%',
        padding: theme.spacing.unit * 3,
        // float: 'right',
        // margin: theme.spacing.unit * 2,
    },
    extendedIcon: {
        marginRight: theme.spacing.unit * 2,
    },
    paper: {
        width: '100%',
        float: 'left',
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
    appBar: {
        position: 'relative',
      },
      icon: {
        marginRight: theme.spacing.unit * 2,
      },
      heroUnit: {
        backgroundColor: theme.palette.background.paper,
      },
      heroContent: {
        // marginTop: '4em',
        maxWidth: 600,
        margin: '0 auto',
        padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
      },
      heroButtons: {
        marginTop: theme.spacing.unit * 4,
      },
      layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
          width: 1100,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      },
      cardGrid: {
        padding: `${theme.spacing.unit * 8}px 0`,
      },
      card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      },
      cardMedia: {
        paddingTop: '56.25%', // 16:9
      },
      cardContent: {
        flexGrow: 1,
      },
      displayFormatLabel: {
        paddingTop: '25%',
        float: 'right',
      },
      footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing.unit * 6,
      },
      root: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      formControl: {
        margin: theme.spacing.unit * 2,
        width: '100%',
      },
      select: {
        minHeight: '50px',
      },
      inputContainer:{
        paddingTop: theme.spacing.unit * 2,
      },
      selectEmpty: {
        marginTop: theme.spacing.unit * 4,
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      countTextField: {
        width: '75%',
        textAlgign: 'center',
        // position: 'absolute',
        // bottom: '0' ,
        paddingTop: theme.spacing.unit * 3,
        paddingLeft: theme.spacing.unit * 2,

      },
      chip: {
        margin: 2,
      },
      noLabel: {
        marginTop: theme.spacing.unit * 6,
      },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


class FilterMenu extends Component {

  constructor(props) {
    super(props);

    this.state = {
        loading: true,
        showMenu: true,
        displayFormat: 'block',
        sessionCount: 3,
        sessionPlaylists: ['First Playlist'],
        allPlaylists: [
          {
            user:'Sly',
            open: false,
            playlists: [
              'First Playlist',
              '2nd Playlist', 
              'Tres Plays'
            ],
          },
          {
            user:'dzul',
            open: false,
            playlists: [
              'Numero Uno',
              '#2', 
              'Thr33'
            ],
          },
        ],
        textFieldValue: '',
        genreFilterOpen: false,
        emotionFilterOpen: false,
        producerFilterOpen: false,
    };
  }

    handleFilterClick = (filter, value) => {
      switch (filter){
        case "genres":
          console.log(filter, value);
          break;
        case "emotions":
          console.log(filter, value);
          break;
        case "producers":
          console.log(filter, value);
          break;
        default:
          break;
      }
    };
  
    toggleFilters = (filter) => {
      switch (filter){
        case "genres":
          this.setState(state => ({ genreFilterOpen: !state.genreFilterOpen }));
          break;
        case "emotions":
          this.setState(state => ({ emotionFilterOpen: !state.emotionFilterOpen }));
          break;
        case "producers":
          this.setState(state => ({ producerFilterOpen: !state.producerFilterOpen }));
          break;
        default:
          break;
      }
    };

    toggleMenu = () => {     
        const currentState = this.state.showMenu;
        // this.setState({ showMenu: !currentState });
    };

    async componentDidMount() {
        const { sessionCount, sessionPlaylists } = this.props;
        console.log("[settings] setting props", sessionCount, sessionPlaylists);

        this.setState({
            sessionCount,
            sessionPlaylists,
            loading: false
        })
      }

    handleDisplayFormatChange = (event) => {
        console.log("[settings] displayFormat change", event.target.value);
        this.setState({ displayFormat: event.target.value });
    }
    
    handleCountSliderChange = (event, value) => {
        console.log("[settings] count change", value);
        this.setState({ sessionCount: value });
    }

    handleCountTextFieldChange = (event) => {
      console.log("[settings] txtField count change", event.target.value);
      this.setState({ sessionCount: event.target.value });
  }

    handlePlaylistChange = (event) => { 
        console.log("[settings] playlist change", event.target.value);
        this.setState({ selectedPlaylists: event.target.value })
    }

    getStyles = (name, personName, theme) => {
        return {
          fontWeight:
            personName.indexOf(name) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
        };
    }

    addToSessionPlaylists = (playlistId) => {
        this.props.AddToSessionPlaylists(this.props.playlistId);
    }

  render() {
    const { classes } = this.props;
    const { loading, showMenu, displayFormat, sessionCount, sessionPlaylists, allPlaylists, genreFilterOpen, emotionFilterOpen, producerFilterOpen } = this.state;
    console.log('[filter-menu] allPlaylists', allPlaylists);
    console.log('[filter-menu] sessionPlaylists', sessionPlaylists);

    if(loading){
      return(<div></div>);
    }

    return (

      <div className={classes.menuContainer} onMouseEnter={this.toggleMenu} onMouseLeave={this.toggleMenu}>
          <CssBaseline />
          <Slide direction="right" in={showMenu} mountOnEnter unmountOnExit>
            <div >
              
              <Grid container spacing={2}>
                <Grid item key={'output-style-filler'} sm={2}>
                {/* <Typography id="playlist-select" gutterBottom>Format</Typography> */}
                </Grid>
                <Grid item key={'output-style-select'} sm={2}>
                  <Typography id="cards-displayFormat" className={classes.displayFormatLabel} gutterBottom>Cards</Typography>
                </Grid>
                <Grid item key={'output-style-select'} sm={2}>
                  <Radio
                    checked={displayFormat === 'cards'}
                    onChange={this.handleDisplayFormatChange}
                    value="cards"
                    name="cards-radio-button"
                    inputProps={{ 'aria-label': 'A' }}
                  />
                </Grid>
                <Grid item key={'output-style-select'} sm={2}>
                  <Typography id="cards-displayFormat" className={classes.displayFormatLabel} gutterBottom>Block</Typography>
                </Grid>
                <Grid item key={'output-style-select'} sm={2}>
                  <Radio
                    checked={displayFormat === 'block'}
                    onChange={this.handleDisplayFormatChange}
                    value="block"
                    name="block-radio-button"
                    inputProps={{ 'aria-label': 'B' }}
                  />
                </Grid>
                <Grid item key={'count-input'} sm={12}>
                    <Grid container spacing={2}>
                      <Grid item key={'count-slider-input'} sm={9}>
                      <Typography id="discrete-slider" gutterBottom>Card Count</Typography>
                        <Slider
                          value={sessionCount}
                          // aria-labelledby="discrete-slider"
                          // valueLabelDisplay="auto"
                          step={1}
                          onChange={this.handleCountSliderChange}
                          min={1}
                          max={50}
                        />
                      </Grid>
                      <Grid item key={'count-text-field'} sm={3}>
                        <TextField
                          id="count-text-field"
                          className={classes.countTextField}
                          value={sessionCount}
                          onChange={this.handleCountTextFieldChange}
                          inputProps={{ 'aria-label': 'bare' }}
                        />
                      </Grid>
                    </Grid>
                </Grid>
                <Grid item key={'playlist-input'} className={classes.inputContainer} sm={12}>
                  {/* <FormControl className={classes.formControl}> */}
                  <List>
                    <Typography id="playlist-select" gutterBottom>Playlists</Typography>
                      {allPlaylists.map(playlist => (
                        <div>
                          <ListItem button onClick={() => { this.toggleFilters("genres"); }}>
                            <ListItemText primary={playlist.user} />
                            {playlist.open ? <ExpandLess /> : <ExpandMore />}
                          </ListItem>
                          <Collapse in={genreFilterOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {playlist.playlists.map(x => (
                                <ListItem button className={classes.nested} onClick={() => { this.handleFilterClick(playlist, x); }}>
                                  <Checkbox
                                    checked={true}
                                    // onChange={this.handleFilterClick('alternative')}
                                    value={x}
                                  />                  
                                  <ListItemText inset primary={x} />
                                </ListItem>
                              ))}
                            </List>
                        </Collapse>
                      </div>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </div>
        </Slide>
      </div>

    );
  }
}

// Settings Redux Container
const mapStateToProps = state => ({
    sessionCount: state.sessionCount,
    sessionPlaylists: state.sessionPlaylists,
  });

const mapDispatchToProps = dispatch => {
  return {
    AddToSessionPlaylists: playlistId => dispatch(AddToSessionPlaylists(playlistId))
  };
}

const FilterMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(FilterMenu);

FilterMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilterMenuContainer);

