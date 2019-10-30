import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
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
  label: {
    textAlign: 'center',
    opacity: 1,
    fontSize: '2em',
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
  }
});

const editPhrase = (phrase) => {
  console.log('[edit-phrase]', phrase)
}

const deletePhrase = (phrase) => {
  console.log('[delete-phrase]', phrase)
}

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
                  <Typography className={classes.label}>
                      {phrase.phrase}
                  </Typography>
                </CardContent>
                {showActions ? 
                  <Grid container spacing={0}>
                    <Grid item key={`edit-${phrase.id}`} sm={6} className={classes.actionContainer}>
                      <Button size="small" color="secondary" className={classes.actionIcon} onClick={editPhrase()}>
                        <EditIcon />
                      </Button>
                    </Grid>
                    <Grid item key={`delete-${phrase.id}`} sm={6}>
                      <Button size="small" color="secondary" className={classes.actionIcon} onClick={deletePhrase()}>
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  </Grid>
                : null}
            </Card>
      </React.Fragment>
    );
  }
}


PhraseCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PhraseCard);
