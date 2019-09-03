import React, {Component} from 'react';
import PhraseCardGrid from './PhraseCardGrid';
import Settings from './Settings';
import axios from 'axios';
import { connect } from 'react-redux';


const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

const getRandomPhrases = (allData = null, count) => {
    let randomPhrases=[], used=[];

    if(!allData){
        allData = this.state.allData;
    }

    for(var i=0; i < count; i++){
        
        let randomIndex = getRandomInt(allData.length - 1);
        
        if(used.includes(randomIndex)){
            i--;
        } else {
            used.push(randomIndex);
            randomPhrases.push(allData[randomIndex]);
        }
    }
    return randomPhrases
}



class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
                memberId: "582731e4-cccb-11e9-bea0-88e9fe785c3a",
                playlists: sessionPlaylists,
            }
        }); 
        console.log('[home] shuffle new data', {data})
  
        const displayData = getRandomPhrases(data, sessionCount)
        this.setState({ displayData });
    }



    async componentDidMount() {
        try{
            const {sessionCount, sessionPlaylists }= this.props;
            console.log("[home]", sessionCount, sessionPlaylists)
            let { data:phrases } = await axios.get('/api/sessionplaylistphrases', {
                params: {
                    memberId: "582731e4-cccb-11e9-bea0-88e9fe785c3a",
                    playlists: sessionPlaylists,
                }
            });            
            console.log("[home] phrase data", phrases);

            let { data:allPlaylists } = await axios.get('/api/allplaylists', {
                params: {
                    memberId: "582731e4-cccb-11e9-bea0-88e9fe785c3a",
                }
            });             
            console.log("[home] allPlaylists", allPlaylists);
            const displayData = getRandomPhrases(phrases, sessionCount); 
            console.log("[home] displayData", displayData);
            const sessionSettings = {
                sessionCount,
                sessionPlaylists,
                allPlaylists,
            }
            console.log("[home] sessionSettings", sessionSettings);
            this.setState({ displayData, sessionSettings });
        } catch (err) {
            throw Error (err);
        }
    }
    
    render(){
        const { displayData, sessionSettings } = this.state
        return(
            <div >
                <Settings shuffle={this.shuffle} sessionSettings={sessionSettings}/>
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

export default HomeContainer; 