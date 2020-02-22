import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import PlaylistPhraseCard from './PlaylistPhraseCard';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  appBar: {
    position: 'relative',
  },
  icon: {
    marginRight: theme.spacing.unit * 2,
  },
  layout: {
    width: 'auto',
  },
  cardGrid: {
      paddingTop: theme.spacing.unit * 8,
    // padding: `${theme.spacing.unit * 8}px`,
  },
});



class PlaylistPhraseCardGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      phrases: [],
    };
  }


  async componentDidMount() {
    const { phrases } = this.props;
    console.log('[cardGrid] props', this.props);
    this.setState({ loading: false, phrases });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.phrases !== this.state.phrases) {
      const { phrases } = this.state;
      this.setState({ phrases });
    }
  }
  
  static getDerivedStateFromProps(nextProps, prevState){

    if(nextProps.phrases!==prevState.phrases){      
      return { phrases : nextProps.phrases };
    }
    else return null;
  }


  // async componentWillReceiveProps(nextProps) {
  //   const { phrases } = nextProps;
  //   // console.log('[cardGrid] nextProps', phrases);
  //   this.setState({ loading: false, phrases });
  // }

  refreshPlaylists= (currentPlaylistId) => {
    this.props.refreshPlaylists(currentPlaylistId);
  }

  render() {
    const { classes } = this.props;
    const { loading, phrases } = this.state;


    if(loading){
      return(<div></div>);
    }

    return (
      
      <React.Fragment>
        <CssBaseline />
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40}>
              {phrases.map(phrase => (
                
                // <Slide in={!loading} direction="up" key={`slide-${phrase.id}`}style={{ transitionDelay: !loading ? '1000ms' : '0ms' }}>
                    <Grid item key={phrase.id} sm={6} md={4} lg={4}>
                      <PlaylistPhraseCard phrase={phrase} refreshPlaylists={this.refreshPlaylists}/>
                    </Grid>
                // </Slide>
              ))}
            </Grid>
          </div>
      </React.Fragment>
    );
  }
}

PlaylistPhraseCardGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PlaylistPhraseCardGrid);
