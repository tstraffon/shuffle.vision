import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import PhraseCard from './PhraseCard';
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



class PhraseCardGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }


  async componentDidMount() {
    this.setState({loading: false});
  }

  render() {
    console.log('[cardGrid] props', this.props);
    const { classes, data } = this.props;
    const { loading } = this.state;

    if(loading){
      return(<div></div>);
    }

    return (
      
      <React.Fragment>
        <CssBaseline />
          <div className={classNames(classes.layout, classes.cardGrid)}>
            <Grid container spacing={40}>
              {data.map(phrase => (
                <Slide in={!loading} direction="up" style={{ transitionDelay: !loading ? '1000ms' : '0ms' }}>
                    <Grid item key={phrase.phraseId} sm={6} md={4} lg={4}>
                    <PhraseCard phrase={phrase} />
                    </Grid>
                </Slide>
              ))}
            </Grid>
          </div>
      </React.Fragment>
    );
  }
}

PhraseCardGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PhraseCardGrid);
