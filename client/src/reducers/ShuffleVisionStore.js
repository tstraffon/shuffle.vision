//define the initial state
const initialState = {
    cardCount: 3,   
    playlists: [],
    display: 'cards'
}

//define a reducer with an initialized state action
function ShuffleVisionStore(state = initialState, action) {  

    switch (action.type){
        case 'ADD_TO_PLAYLISTS':
            console.log('[shuffle-vision-store] adding new playlist(s) to store', action.playlist, state.playlists)
            return Object.assign({}, state, {
                playlists: state.playlists.concat(action.playlist)
            });
        case 'REMOVE_FROM_PLAYLISTS':
            console.log('[shuffle-vision-store] removing playlist from store', action.playlist, state.playlists)
            return Object.assign({}, state, {
                playlists: state.playlists.filter((value) => {
                    return value.id !== action.playlist.id
                })
            });
        case 'SELECT_CARD_COUNT':
            console.log('[shuffle-vision-store] updating card count', action.cardCount)
            return Object.assign({}, state, {
                cardCount: action.cardCount
            });
        case 'SELECT_DISPLAY':
            console.log('[shuffle-vision-store] updating display', action.display)
            return Object.assign({}, state, {
                display: action.display
            });
        default:
            console.log('[reducer] Action not recognized', action);
    }

    return state
}

export default ShuffleVisionStore