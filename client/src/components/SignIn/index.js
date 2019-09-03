import React, {Component} from 'react';
import SignUpForm from './SignUpForm';




class SignIn extends Component {
    
    render(){
        console.log("Submit props", this.props);
        return(
            <div style={{marginLeft: 'auto', marginRight: 'auto', paddingTop: '2em'}}>
                <SignUpForm/>
            </div>
        );

    }  

}
export default SignIn; 