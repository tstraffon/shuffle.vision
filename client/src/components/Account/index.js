import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';


const styles = theme => ({
    shuffleButton: {
        display: 'block',
        // marginLeft: '10%',
        fontSize: '1.25em',
    },
});




class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            displayData: [],
            sessionSettings: {},
        }
    }



    async componentDidMount() {
        try{

        } catch (err) {
            throw Error (err);
        }
    }
    
    render(){
        const { classes } = this.props;
        const { loading, displayData, sessionSettings } = this.state

        if(loading){
            return(<div></div>);
        }
        
        return(
            <div >
            </div>
        );

    }  

}


// Account Redux Container
const mapStateToProps = state => ({
    sessionCount: state.sessionCount,
    sessionPlaylists: state.sessionPlaylists,
  });

// const mapDispatchToProps = dispatch => {
//   return {
//     AddToCart: beatId => dispatch(AddToCart(beatId))
//   };
// }

const AccountContainer = connect(
    mapStateToProps,
    // mapDispatchToProps,
)(Account);

// apply class stylings
Account.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(AccountContainer); 