import React, {Component} from 'react';
import ProducerProfile from './ProducerProfile';
import axios from 'axios';
import { connect } from 'react-redux';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profileData: [],
            loading: true,
        }
    }

    async componentDidMount() {
        try {   
            const { producerId } = this.props.currentProducerId;
            const query = `/api/producers/one`;
            const { data:producerData } = await axios.post(query, { params: { producerId } });
            console.log('[profile] producerData', producerData);

            this.setState({ profileData: producerData, loading: false });
        } catch (err) {
            throw Error (err);
        }
    }
    
    render(){
        const { loading, profileData } = this.state;

        if (loading) {
            return (null);
        }

        return(
            <div>
                <ProducerProfile  profileData={profileData} />
            </div>
        );

    }  

}

// ProfileContainer
const mapStateToProps = state => ({
    currentProducerId: state.currentProducerId,
  });


const ProfileContainer = connect(
    mapStateToProps
)(Profile);

export default ProfileContainer; 