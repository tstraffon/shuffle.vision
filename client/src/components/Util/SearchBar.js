import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';


const styles = theme => ({
    searchForm:{
        width: '100%',
    },
    searchField: {
      textAlign: 'center',
      color: theme.palette.text.secondary,
      margin:'auto',
      width: '100%',
    },
  });

class SearchBar extends Component {

    render(){
        const { classes } = this.props;

        return(
            <div>
                <FormControl className={classes.searchForm}>
                    <TextField className={classes.searchField}
                        id="producers-search"
                        label="Search by Song Title, Producer, or Genre"
                        type="search"
                    />
                </FormControl>
            </div>
        );

    }  

}

SearchBar.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(SearchBar);