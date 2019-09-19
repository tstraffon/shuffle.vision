import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';import FormControl from '@material-ui/core/FormControl';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { AddToSessionPlaylists } from '../../actions/index.js';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


const styles = theme => ({
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
    minWidth: 120,
  },
  select: {
    minHeight: '50px',
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 4,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing.unit * 6,
  },
});

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

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



class Settings extends React.Component {

    constructor(props) {
      super(props);
      this.shuffle = this.shuffle.bind(this);
  
      this.state = {
        sessionCount: 3,
        sessionPlaylists: ['First Playlist'],
        allPlaylists: ['First Playlist', '2nd Playlist', 'Tres Plays'],
        loading: true,
      };
    }

    async componentDidMount() {
        const { sessionSettings } = this.props;
        const { sessionCount, sessionPlaylists, allPlaylists } = sessionSettings;
        console.log("[settings] setting props", {sessionSettings});

        this.setState({
            sessionCount,
            sessionPlaylists,
            allPlaylists,
            loading: false
        })
      }
    
    handleCountChange = (event) => {
        console.log("[settings] count change", event.target.value);
        this.setState({ sessionCount: event.target.value })
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


    shuffle = () => {
        const settings = {
            sessionCount: this.state.sessionCount,
            sessionPlaylists: this.state.sessionPlaylists,
        }
        this.props.shuffle(settings);
    }

    render() {
        const { classes, sessionSettings } = this.props;
        const { allPlaylists } = sessionSettings;
        const { sessionCount, sessionPlaylists, loading } = this.state;

        if(loading){
            return null;
        }
        console.log("[settings] state", this.state);
        console.log("[settings] allPlaylists", allPlaylists);


        return (
            <React.Fragment>
            <CssBaseline />
                <div className={classes.heroUnit}>
                    <div className={classes.heroContent}>
                        <div className={classes.margin} />
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="count">Count</InputLabel>
                                <Select
                                value={sessionCount}
                                onChange={this.handleCountChange}
                                inputProps={{
                                    name: 'count',
                                    id: 'count',
                                }}
                                className={classes.select}
                                >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                                <MenuItem value={12}>12</MenuItem>

                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="select-multiple-chip">Playlists</InputLabel>
                            <Select
                                className={classes.select}
                                multiple
                                value={sessionPlaylists}
                                onChange={this.handlePlaylistChange}
                                input={<Input id="select-multiple-chip" />}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip key={value} label={value} className={classes.chip} />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                {/* {allPlaylists.map(playlist => (
                                    <MenuItem key={playlist.playlistId} value={playlist.name}>
                                    {playlist.name}
                                    </MenuItem>
                                ))} */}
                            </Select>
                        </FormControl>
                        <div className={classes.heroButtons}>
                        <Grid container spacing={16} justify="center">
                            <Grid item>
                            <Button variant="contained" color="primary" onClick={() => { this.shuffle(); }} >
                                Shuffle
                            </Button>
                            </Grid>
                        </Grid>
                        </div>
                    </div>
                </div>
            </React.Fragment>
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

const SettingsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Settings);

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SettingsContainer);
