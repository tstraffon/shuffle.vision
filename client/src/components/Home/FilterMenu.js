import React, {Component} from 'react';
import Slider from '@material-ui/core/Slider';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Checkbox from '@material-ui/core/Checkbox';
import { AddToPlaylists, RemoveFromPlaylists, SelectCardCount, SelectDisplay } from '../../actions/index.js';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import axios from 'axios';



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
      nested: {
        paddingTop: '0px',
        paddingBottom: '0px'
      }
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
        showMenu: false,
        displayFormat: 'cards',
        allPlaylists: [],
        memberPlaylists: [],
        cardCount: 3,
        textFieldValue: '',
        genreFilterOpen: false,
        emotionFilterOpen: false,
        producerFilterOpen: false,
    };
  }

  async componentDidMount() {

    const { data:allPlaylists } = await axios.get('/api/allPlaylists'); 

    // console.log("[filter-menu] componentDidMount allPlaylists", allPlaylists);
    const memberPlaylists = [];

    for (const p of allPlaylists){
      const memberObj = memberPlaylists.find((member, i) => { return p.memberId === member.memberId });

      if(!memberObj){
        const newMember = {
          memberId: p.memberId,
          showPlaylists: false,
          playlists:[{
            name: p.name,
            checked: p.memberId === 'sly' ? true : false
          }]
        }
        memberPlaylists.push(newMember)
      } else {
        memberObj.playlists.push({name: p.name, checked: p.memberId === 'sly' ? true : false });
      }
    }

    // console.log("[filter-menu] memberPlaylists", memberPlaylists);

    this.setState({
      allPlaylists,
      memberPlaylists,
      loading: false
    })
  }


  toggleSelectPlaylist = (memberPlaylists, memberIndex, playlistIndex ) => {
    const currentPlaylistState = memberPlaylists[memberIndex].playlists[playlistIndex].checked;
    memberPlaylists[memberIndex].playlists[playlistIndex].checked = !currentPlaylistState;

    const { allPlaylists } = this.state;
    const playlist = allPlaylists.find((p, i) => { return p.name === memberPlaylists[memberIndex].playlists[playlistIndex].name });
    // console.log("[filter-menu] toggledPlaylist", playlist);

    if(!currentPlaylistState){
      // console.log("[filter-menu] new playlist selected", playlist);
      this.props.AddToPlaylists(playlist);
    } else {
      // add remove playlist function here
      // console.log("[filter-menu] playlist deselected", playlist);
      this.props.RemoveFromPlaylists(playlist);
    }

    this.setState({ memberPlaylists });
  };

  toggleShowMemberPlaylists = (memberPlaylists, memberIndex) => {

    const currentPlaylistState = memberPlaylists[memberIndex].showPlaylists;
    memberPlaylists[memberIndex].showPlaylists = !currentPlaylistState;

    this.setState({ memberPlaylists });
  };

  toggleMenuTrue = () => {     
      this.setState({ showMenu: true });
  };

  toggleMenuFalse = () => {     
    this.setState({ showMenu: false });
  };



  handleDisplayFormatChange = (event) => {
    // console.log("[filter-menu] displayFormat change", event.target.value);
    this.props.SelectDisplay(event.target.value);
    this.setState({ displayFormat: event.target.value });
  }
  
  handleCountSliderChange = (event, value) => {
    // console.log("[filter-menu] count change", value);
    this.setState({ cardCount: value });
  }

  handleSliderComittedChange = (event, value) => {
    // console.log("[filter-menu] adding new count to store", value);
    this.props.SelectCardCount(value);
  }

  handleCountTextFieldChange = (event) => {
    // console.log("[filter-menu] txtField count change", event.target.value);
    this.setState({ cardCount: event.target.value });
  }

  handlePlaylistChange = (event) => { 
    // console.log("[filter-menu] playlist change", event.target.value);
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

  AddToPlaylists = (playlist) => {
      this.props.AddToPlaylists(playlist);
  }


  render() {
    const { classes } = this.props;
    const { loading, showMenu, displayFormat, cardCount, memberPlaylists} = this.state;


    if(loading){
      return(<div></div>);
    }
    // console.log('[filter-menu] memberPlaylists', memberPlaylists);
    // console.log('[filter-menu] sessionPlaylists', sessionPlaylists);
    return (

      <div className={classes.menuContainer} onMouseEnter={this.toggleMenuTrue} onMouseLeave={this.toggleMenuFalse}>
          <CssBaseline />
          <Slide direction="right" in={showMenu} mountOnEnter unmountOnExit>
            <div >
              
              <Grid container spacing={0}>
                <Grid item key={'card-title'} sm={2}>
                {/* <Typography id="playlist-select" gutterBottom>Format</Typography> */}
                </Grid>
                <Grid item key={'card-count-title'} sm={2}>
                  <Typography id="card-count-title-item" className={classes.displayFormatLabel} gutterBottom>Cards</Typography>
                </Grid>
                <Grid item key={'card-count-radio'} sm={2}>
                  <Radio
                    checked={displayFormat === 'cards'}
                    onChange={this.handleDisplayFormatChange}
                    value="cards"
                    name="cards-radio-button"
                    inputProps={{ 'aria-label': 'A' }}
                  />
                </Grid>
                <Grid item key={'block-title'} sm={2}>
                  <Typography id="block-title-item" className={classes.displayFormatLabel} gutterBottom>Block</Typography>
                </Grid>
                <Grid item key={'block-radio'} sm={2}>
                  <Radio
                    checked={displayFormat === 'block'}
                    onChange={this.handleDisplayFormatChange}
                    value="block"
                    name="block-radio-button"
                    inputProps={{ 'aria-label': 'B' }}
                  />
                </Grid>
                <Grid item key={'card-count-select'} sm={12}>
                    <Grid container spacing={2}>
                      <Grid item key={'card-count-slider'} sm={9}>
                      <Typography id="discrete-slider" gutterBottom>Card Count</Typography>
                        <Slider
                          value={cardCount}
                          // aria-labelledby="discrete-slider"
                          // valueLabelDisplay="auto"
                          step={1}
                          onChange={this.handleCountSliderChange}
                          onChangeCommitted={this.handleSliderComittedChange}
                          min={1}
                          max={50}
                        />
                      </Grid>
                      <Grid item key={'count-text-field'} sm={3}>
                        <TextField
                          id="count-text-field"
                          className={classes.countTextField}
                          value={cardCount}
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
                      {memberPlaylists.map((member, memberIndex) => (
                        <div>
                          <ListItem button onClick={() => { this.toggleShowMemberPlaylists(memberPlaylists, memberIndex); }}>
                            <ListItemText primary={member.memberId} />
                            {member.showPlaylists ? <ExpandLess /> : <ExpandMore />}
                          </ListItem>
                          <Collapse in={member.showPlaylists} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {member.playlists.map((playlist, playlistIndex) => (
                                <ListItem button className={classes.nested} onClick={() => { this.toggleSelectPlaylist(memberPlaylists, memberIndex, playlistIndex); }}>
                                  <Checkbox
                                    checked={playlist.checked}
                                    value={playlist.name}
                                  />                  
                                  <ListItemText inset primary={playlist.name} />
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

// filter-menu Redux Container
const mapStateToProps = state => ({
    cardCount: state.cardCount,
    playlists: state.playlists,
  });

const mapDispatchToProps = dispatch => {
  return {
    AddToPlaylists: playlist => dispatch(AddToPlaylists(playlist)),
    RemoveFromPlaylists: playlist => dispatch(RemoveFromPlaylists(playlist)),
    SelectCardCount: cardCount => dispatch(SelectCardCount(cardCount)),
    SelectDisplay: display => dispatch(SelectDisplay(display)),
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

