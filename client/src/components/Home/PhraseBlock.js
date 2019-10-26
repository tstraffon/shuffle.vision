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
    marginTop: theme.spacing.unit * 8,
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
      phraseBlock: [],
    };
  }

  async componentDidMount() {
    const { data } = this.props;
    // console.log('[phrase-block] data', {data})

    let phraseBlock = '';
    for(const d of data){
      phraseBlock = phraseBlock + ' ' + d.phrase
    }
    this.setState({loading: false, phraseBlock})
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    // console.log('[phrase-block] data', {data})

    let phraseBlock = '';
    for(const d of data){
      phraseBlock = phraseBlock + ' ' + d.phrase
    }
    this.setState({phraseBlock})
  }

  render() {
    const { classes} = this.props;
    const { loading, phraseBlock } = this.state;
    if(loading){
      return(<div></div>);
    }
    // console.log('[phrase-block] phraseblock', {phraseBlock})
    return (
      
      <React.Fragment>
        <CssBaseline />
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography className={classes.label}>
                      {phraseBlock}
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
