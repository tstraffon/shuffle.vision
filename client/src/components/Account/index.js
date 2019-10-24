import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PhraseCardGrid from './PhraseCardGrid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';
import { connect } from 'react-redux';


const styles = theme => ({
    shuffleButton: {
        display: 'block',
        // marginLeft: '10%',
        fontSize: '1.25em',
    },
});

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const getRandomPhrases = (allData = null, count) => {
    // let randomPhrases=[], used=[];

    // if(!allData){
    //     allData = this.state.allData;
    // }

    // for(var i=0; i < count; i++){
        
    //     let randomIndex = getRandomInt(allData.length - 1);
        
    //     if(used.includes(randomIndex)){
    //         i--;
    //     } else {
    //         used.push(randomIndex);
    //         randomPhrases.push(allData[randomIndex]);
    //     }
    // }
    // return randomPhrases
}



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

    shuffle = async (settings) => {
        const { sessionCount, sessionPlaylists } = settings;
        console.log('[account] shuffle inputs', {settings})
        let { data } = await axios.get('/api/sessionplaylistphrases', {
            params: {
                memberId: "582731e4-cccb-11e9-bea0-88e9fe785c3a",
                playlists: sessionPlaylists,
            }
        }); 
        console.log('[account] shuffle new data', {data})
  
        const displayData = getRandomPhrases(data, sessionCount)
        this.setState({ displayData });
    }



    async componentDidMount() {
        try{
            // const { sessionCount, sessionPlaylists }= this.props;
            // console.log("[account]", sessionCount, sessionPlaylists)
            // let { data:phrases } = await axios.get('/api/sessionplaylistphrases', {
            //     params: {
            //         memberId: "582731e4-cccb-11e9-bea0-88e9fe785c3a",
            //         playlists: sessionPlaylists,
            //     }
            // });            
            // console.log("[account] phrase data", phrases);

            // let { data:allPlaylists } = await axios.get('/api/allplaylists', {
            //     params: {
            //         memberId: "582731e4-cccb-11e9-bea0-88e9fe785c3a",
            //     }
            // });             
            // console.log("[account] allPlaylists", allPlaylists);
            // const displayData = getRandomPhrases(phrases, sessionCount); 
            // console.log("[account] displayData", displayData);
            // const sessionSettings = {
            //     sessionCount,
            //     sessionPlaylists,
            //     allPlaylists,
            // }
            // console.log("[account] sessionSettings", sessionSettings);
            // this.setState({ displayData, sessionSettings, loading: false });
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
                <Grid container spacing={2} justify="center"  className={classes.buttonContainer}>
                    <Grid item xs={2}>
                        <Button variant="contained" className={classes.shuffleButton} color="primary" onClick={() => { this.shuffle(sessionSettings); }} >
                            Account
                        </Button>
                    </Grid>
                </Grid>
                <PhraseCardGrid data={displayData} />
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