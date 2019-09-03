import React from 'react';
import PropTypes from 'prop-types'; 
import { withStyles } from '@material-ui/core/styles';
import SocialMediaBanner from './SocialMediaBanner';


const styles = theme => ({
  footer: {
    // backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6,
  },
});

function Footer(props) {
  const { classes } = props;
  console.log("Footer PROPS", props);

  return (
    <React.Fragment>
      <footer className={classes.footer}>
        <SocialMediaBanner />
      </footer>
    </React.Fragment>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Footer);


