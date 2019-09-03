import React, {Component} from 'react';
import SubmitHero from './SubmitHero.js';



class Submit extends Component {
    componentDidMount(){
        console.log(this.props);

    }
    render(){
        return(
            <div>
                <SubmitHero/>
            </div>        );

    }  

}
export default Submit; 