import React, {Component} from 'react';


class SocialMediaBanner extends Component {

    render(){
        return(
            <div className= "social-media-banner-container">
                <div className="social-media-banner" >
                    <ul style={{padding: 0}}>
                        <li>
                            <a href="http://facebook.com/somecoolbeats"><img src={require('./icons/facebook.png')} alt="facebook icon"></img></a>
                        </li>
                        <li>
                            <a href="http://twitter.com/somecoolbeats"><img src={require('./icons/twitter.png')} alt="twitter icon"></img></a>
                        </li>
                        <li>
                            <a href="http://instagram.com/somecoolbeats"><img src={require('./icons/instagram.png')} alt="instagram icon"></img></a>
                        </li>
                        <li>
                            <a href="http://soundcloud.com/somecoolbeats"><img src={require('./icons/soundcloud.png')} alt="soundcloud icon"></img></a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/channel/UCqbHyc-tEsVg1R6mg6wdFRQ"><img src={require('./icons/youtube.png')} alt="youtube icon"></img></a>
                        </li>                  
                    </ul>
                </div>
            </div>
        );

    }  

}
export default SocialMediaBanner; 
