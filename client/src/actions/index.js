export const AddToPlaylists = playlist =>({
    type: 'ADD_TO_PLAYLISTS',
    playlist
});

export const RemoveFromPlaylists = playlist =>({
    type: 'REMOVE_FROM_PLAYLISTS',
    playlist
});

export const SelectCardCount = cardCount =>({
    type: 'SELECT_CARD_COUNT',
    cardCount
});

export const SelectDisplay = display =>({
    type: 'SELECT_DISPLAY',
    display
});