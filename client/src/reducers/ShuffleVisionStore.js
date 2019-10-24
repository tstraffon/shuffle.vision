//define the initial state
const initialState = {
    cardCount: 3,   
    playlists: [],
}

//define a reducer with an initialized state action
function ShuffleVisionStore(state = initialState, action) {  

    switch (action.type){
        case 'ADD_TO_PLAYLISTS':
            console.log('[shuffle-vision-store] adding new playlist(s) to store', action.playlist, state.playlists)
            return Object.assign({}, state, {
                playlists: state.playlists.concat(action.playlist)
            });
        case 'SELECT_CARD_COUNT':
            console.log('[shuffle-vision-store] updating card count', action.cardCount)
            return Object.assign({}, state, {
                cardCount: action.cardCount
            });
        default:
            console.log('[reducer] Action not recognized', action);
    }

    return state
}

export default ShuffleVisionStore