import React from 'react';
import PropTypes from 'prop-types'; 
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  NowPlaying: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

function NowPlaying(props) {
  const { classes } = props;
  console.log("NowPlaying PROPS", props);

  return (
    <React.Fragment>
      <NowPlaying className={classes.NowPlaying}>
      </NowPlaying>
    </React.Fragment>
  );
}

NowPlaying.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NowPlaying);


