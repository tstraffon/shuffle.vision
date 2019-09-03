import axios from 'axios';


 export default async function addToCart (beatId, userId) {

	try {	  

        console.log("Adding beat ", beatId, " to user ", userId, "'s cart");

        axios.post(`/api/addToCart?beatId=` + beatId + `&userId=` + userId );
		return;

	} catch (error){
		console.log("addToCart error", error);
		return error
	}

}

