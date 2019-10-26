import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
  },
  label: {
    textAlign: 'center',
    opacity: 1,
    fontSize: '2em',
  },
});



class PhraseCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    this.setState({loading: false})
  }

  render() {
    const { classes, phrase, cartCount } = this.props;
    const { loading } = this.state;
    if(loading){
      return(<div></div>);
    }
    // console.log('[phrase-card] phrase', {phrase})
    return (
      
      <React.Fragment>
        <CssBaseline />
            <Card className={classes.card}color="primary">
                <CardContent className={classes.cardContent} >
                  <Typography className={classes.label}>
                      {phrase.phrase}
                  </Typography>
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
