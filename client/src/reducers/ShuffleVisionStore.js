//define the initial state
const initialState = {
    sessionCount: 3,   
    sessionPlaylists: ["numero uno"],
}

//define a reducer with an initialized state action
function ShuffleVisionStore(state = initialState, action) {  

    switch (action.type){
        case 'ADD_TO_SESSION_PLAYLISTS':
            return Object.assign({}, state, {
                sessionPlaylists: state.sessionPlaylists.concat(action.playlist)
            });
        case 'SELECT_COUNT':
            return Object.assign({}, state, {
                count: action.count
            });
        default:
            console.log('[reducer] Action not recognized', action);
    }

    return state
}

export default ShuffleVisionStore