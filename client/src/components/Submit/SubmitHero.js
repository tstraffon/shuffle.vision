import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

  heroUnit: {
    backgroundColor: theme.palette.background.paper,
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4,
  },
});


function SubmitHero(props) {
  const { classes } = props;

  return (
    <React.Fragment>     
        {/* Hero unit */}
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Submit Beats
            </Typography>
          </div>
        </div>
       
    </React.Fragment>
  );
}

SubmitHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SubmitHero);