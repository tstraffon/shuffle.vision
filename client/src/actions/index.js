export const AddToSessionPlaylists = playlistId =>({
    type: 'ADD_TO_SESSION_PLAYLISTS',
    playlistId
});

export const SelectCount = count =>({
    type: 'SELECT_COUNT',
    count
});