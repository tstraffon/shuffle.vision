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
        displayData: [], 
        sessionSettings: {}, 
        phrases:[],
    },
});

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const getRandomPhrases = (phrases = null, count) => {
    let randomPhrases=[], usedPhrases=[];

    if(!phrases){
        phrases = this.state.phrases;
    }

    if(phrases.length < 1){
        console.error('No phrases found');
        return;
    }
    
    for(var i=0; i < count;){
        // console.log('[home] randomPhrases count, i', count, i)

        let randomIndex = getRandomInt(phrases.length - 1);
        
        if(usedPhrases.includes(randomIndex)){
            // console.log('[home] phrase already usedPhrases', usedPhrases, randomIndex)
        } else {
            // console.log('[home] pushing new phrase', phrases[randomIndex])
            usedPhrases.push(randomIndex);
            randomPhrases.push(phrases[randomIndex]);
        }
        i = randomPhrases.length;
    }
    // console.log('[home] randomPhrases', {randomPhrases})

    return randomPhrases
}



class Home extends Component {

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
        console.log('[home] shuffle inputs', {settings})
        let { data } = await axios.get('/api/sessionplaylistphrases', {
            params: {
                memberId: "sly",
                playlists: sessionPlaylists,
            }
        }); 
        console.log('[home] shuffle new data', {data})
  
        const displayData = getRandomPhrases(data, sessionCount)
        // const displayData = data

        this.setState({ displayData });
    }



    async componentDidMount() {
        try{
            const { sessionCount, sessionPlaylists }= this.props;
            console.log("[home]", sessionCount, sessionPlaylists)

            let { data:phrases } = await axios.get('/api/sessionplaylistphrases', {
                params: {
                    memberId: "sly",
                    playlists: sessionPlaylists,
                }
            });            
            console.log("[home] phrase data", phrases);

            let { data:allPlaylists } = await axios.get('/api/allplaylists', {
                params: {
                    memberId: "sly",
                }
            });  
                       
            console.log("[home] allPlaylists", allPlaylists);
            const displayData = getRandomPhrases(phrases, sessionCount)
            // const displayData = phrases            
            console.log("[home] displayData", displayData);
            const sessionSettings = {
                sessionCount,
                sessionPlaylists,
                allPlaylists,
            }
            console.log("[home] sessionSettings", sessionSettings);
            this.setState({ displayData, sessionSettings, phrases, loading: false });
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
                <Grid container spacing={8} justify="center"  className={classes.buttonContainer}>
                    <Grid item xs={2}>
                        <Button variant="contained" className={classes.shuffleButton} color="primary" onClick={() => { this.shuffle(sessionSettings); }} >
                            Shuffle
                        </Button>
                    </Grid>
                </Grid>
                <PhraseCardGrid data={displayData} />
            </div>
        );

    }  

}


// Home Redux Container
const mapStateToProps = state => ({
    sessionCount: state.sessionCount,
    sessionPlaylists: state.sessionPlaylists,
  });

// const mapDispatchToProps = dispatch => {
//   return {
//     AddToCart: beatId => dispatch(AddToCart(beatId))
//   };
// }

const HomeContainer = connect(
    mapStateToProps,
    // mapDispatchToProps,
)(Home);

// apply class stylings
Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(HomeContainer); 