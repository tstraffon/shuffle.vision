import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PhraseCardGrid from './PhraseCardGrid';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { AddToPlaylists } from '../../actions/index.js';
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
    let randomPhrases=[], usedPhrases=[], loopCount;

    if(!phrases){
        phrases = this.state.phrases;
    }

    if(phrases.length < 1){
        console.error('[get-random-phrases] No phrases found');
        return [];
    }

    if(phrases.length < count){
        loopCount = phrases.length - 1;
    } else {
        loopCount = count;
    }
    
    // loops through phrases and creates a random array with a length equal to card count
    for(var i=0; i <= loopCount;){
        let randomIndex = getRandomInt(phrases.length);
        
        if(!usedPhrases.includes(randomIndex)){
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
            playlists: [],
            cardCount: 3,
        }
    }

    async componentDidMount() {
        try{
            const { cardCount }= this.props;
            console.log("[home]", cardCount)

            // on initial load retrieve all playlists created by signed in member
            let { data:memberPlaylists } = await axios.get('/api/memberPlaylists', {
                params: {
                    memberId: "sly",
                }
            });  
            this.props.AddToPlaylists(memberPlaylists);


            // function retrieves phrases from memberPlaylists and sets state
            this.getPhrases(memberPlaylists, cardCount);

        } catch (err) {
            throw Error (err);
        }
    }


    componentWillReceiveProps(nextProps) {
        const { cardCount:newCardCount, playlists:newPlaylists } = nextProps;
        const { cardCount:oldCardCount, selectedPlaylists:oldPlaylists, allPhrases} = this.state;

        console.log('[home] nextProps', {nextProps});
        if (newPlaylists !== oldPlaylists && newCardCount !== oldCardCount) {
            console.log('[home] new playlist, new cardCount');
            this.getPhrases(newPlaylists, newCardCount);
        } else if (newPlaylists !== oldPlaylists && newCardCount === oldCardCount) {
            console.log('[home] new playlist, old cardCount');
            this.getPhrases(newPlaylists, oldCardCount);
        } else if (newPlaylists === oldPlaylists && newCardCount !== oldCardCount) {
            console.log('[home] old playlist, new cardCount');
            const displayedPhrases =  getRandomPhrases(allPhrases, newCardCount);
            console.log('[home] new cardCount phrases');
            this.setState({ displayedPhrases, cardCount: newCardCount });
        } else {
            console.log('[home] old playlist, old cardCount', newCardCount, newPlaylists, oldCardCount, oldPlaylists);
        }
    }


    shuffle = (cardCount, phrases) => {
        console.log('[home] shuffle inputs', {cardCount, phrases})
        // create a new array of random phrases with a length matching store card count
        const displayedPhrases = getRandomPhrases(phrases, cardCount)
        this.setState({ displayedPhrases });
    }

    getPhrases = async (selectedPlaylists, cardCount) =>{

            // create an array of just playlist Ids and add each playlist to the store
            let memberIds = [], playlists = [];
            for(const p of selectedPlaylists){
                !memberIds.includes(p.memberId)? memberIds.push(p.memberId) : null
                playlists.push(p.id);
            }

            // get all phrases from selected playlists
            let { data:allPhrases } = await axios.get('/api/playlistPhrases', {
                params: {
                    memberIds: memberIds,
                    playlists: playlists,
                }
            });            
            console.log("[home] all phrase data", allPhrases);

            // create array of random phrases with a length matching store card count
            const displayedPhrases = getRandomPhrases(allPhrases, cardCount)
            console.log("[home] displayed phrases", displayedPhrases);

            this.setState({ displayedPhrases, cardCount, selectedPlaylists, playlists, allPhrases, loading: false });
    }
    
    render(){
        const { classes } = this.props;
        const { loading, displayedPhrases, cardCount, allPhrases } = this.state

        if(loading){
            return(<div></div>);
        }
        
        return(
            <div >
                <Grid container spacing={8} justify="center"  className={classes.buttonContainer}>
                    <Grid item xs={2}>
                        <Button variant="contained" className={classes.shuffleButton} color="primary" onClick={() => { this.shuffle(cardCount, allPhrases); }} >
                            Shuffle
                        </Button>
                    </Grid>
                </Grid>
                <PhraseCardGrid data={displayedPhrases} />
            </div>
        );

    }  

}


// Home Redux Container
const mapStateToProps = state => ({
    cardCount: state.cardCount,
    playlists: state.playlists,
  });

const mapDispatchToProps = dispatch => {
  return {
    AddToPlaylists: playlist => dispatch(AddToPlaylists(playlist))
  };
}

const HomeContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Home);

// apply class stylings
Home.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(HomeContainer); 