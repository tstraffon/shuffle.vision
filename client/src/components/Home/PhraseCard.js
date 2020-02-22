import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import DeleteIcon from '@material-ui/icons/Delete';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
  },
  cardContent: {
    flexGrow: 1,
    margin: 'auto',
    paddingBottom: theme.spacing.unit,
  },
  hoverCardContent: {
    flexGrow: 1,
    margin: 'auto',
    height: '50%',
  },
  label: {
    textAlign: 'center',
    opacity: 1,
    fontSize: '2em',
  },
  hoverLabel: {
    textAlign: 'center',
    opacity: 1,
    fontSize: '2em',
    paddingTop: 0,
  },
  actionContainer:{
    // paddingBottom: theme.spacing.unit * 2,
    // paddingRight: theme.spacing.unit * 8,
    // paddingLeft: theme.spacing.unit * 8,
    // width: '50%'
  },

  actionIcon:{
    color: '#FFF',
    display: 'block',
    margin: 'auto',
    width: '100%',
    paddingTop: theme.spacing.unit * 2,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    }
  },
  editIcon:{
    color: '#FFF',
    display: 'block',
    float: 'left',
    // width: '100%',
  },
  deleteIcon:{
    color: '#FFF',
    display: 'block',
    float: 'right',
    // width: '100%',
  }
});


class PhraseCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showActions: false,
    };
  }

  async componentDidMount() {
    this.setState({loading: false})
  }

  editPhrase = (phrase) => {
    console.log('[edit-phrase]', phrase)
  }

  movePhrase = (phrase) => {
    console.log('[move-phrase]', phrase)
  }
  
  deletePhrase = (phrase) => {
    console.log('[delete-phrase]', phrase)
  }

  mouseEnter = () => {
    this.setState({ showActions: true });
  };

  mouseLeave = () => {
    this.setState({ showActions: false });
  };

  render() {
    const { classes, phrase } = this.props;
    const { loading, showActions } = this.state;

    if(loading){
      return(<div></div>);
    }

    return (
      <React.Fragment>
        <CssBaseline />
          <Card className={classes.card}color="primary" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
            <CardContent className={classes.cardContent} >
              <Typography className={classes.label}>{phrase.phrase}</Typography>
            </CardContent>
          </Card>
      </React.Fragment>
    );
  }
}


PhraseCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PhraseCard);
