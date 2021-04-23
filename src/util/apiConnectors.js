import { API, graphqlOperation, Auth } from 'aws-amplify';
import { listPlaylists, listItems } from '../graphql/queries';
import { sortObjectsAlphabetically } from './helperFunctions.js';

import { 
  createPlaylist as createPlaylistMutation, 
  updateItem as updateItemMutation, 
  deletePlaylist as deletePlaylistMutation, 
  createItem as createItemMutation, 
  updatePlaylist as updatePlaylistMutation, 
  deleteItem as deleteItemMutation,
} from '../graphql/mutations';

export const getPlaylistsConnector = async () => {
  try {
    const { username } = await Auth.currentUserInfo() 
    const  { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: { owner:  {eq: username} }}));
    const playlists = sortObjectsAlphabetically(data.listPlaylists.items, "title");
    return playlists;
  } catch(error) {
    console.error('[api-connector] error', { error });
  }
}

export const getPlaylistItemsConnector = async (playlist) => {
  try {
    const playlistId = playlist.id;
    const  { data } = await API.graphql(graphqlOperation(listItems, { filter: { itemPlaylistId: { eq: playlistId }}}));
    return data.listItems.items
  } catch(error) {
    console.error('[api-connector] getPlaylistItemsConnector error', { error });
  }
}


export const createPlaylistConnector = async (playlistTitle, userPlaylists) => {
  try {
    const { username } = await Auth.currentUserInfo() 
    const createPlaylistInput = {title: playlistTitle.title, public: true, followers: [username] }
    playlistTitle.followers = [username]
    const { data } = await API.graphql({ query: createPlaylistMutation, variables: { input: createPlaylistInput } });
    let newPlaylist = data.createPlaylist
    newPlaylist['followers'] = [username];
    const newUserPlaylists = sortObjectsAlphabetically([ ...userPlaylists, newPlaylist ], "title");
    return { newPlaylist, newUserPlaylists };
  } catch (error) {
    console.error('[api-connector] createPlaylistConnector error', { error });
  }
}

export const createItemConnector = async (itemContent, playlist) => {
  try {
    const createItemInput = { content: itemContent, itemPlaylistId: playlist.id }
    const { data } = await API.graphql({ query: createItemMutation, variables: { input: createItemInput}});
    return data;
  } catch (error) {
    console.error('[api-connector] createItemConnector error', { error });
  }
}

export const updatePlaylistConnector = async (playlist, updates) => {
  try {
    const updatePlaylistInput ={ id: playlist.id, title: updates.title, public: updates.public }
    await API.graphql({ query: updatePlaylistMutation, variables: { input: updatePlaylistInput}});
  } catch (error) {
    console.error('[api-connector] updatePlaylistConnector error', { error });
  } 
}

export const deletePlaylistConnector = async (playlist) => {
  try {
    const { id } = playlist;
    await API.graphql({ query: deletePlaylistMutation, variables: { input: { id } }});
  } catch (error){
    console.error('[api-connector] deletePlaylistConnector error', { error });
  }
}

export const updateItemConnector = async (item) => {
  try {
    const updateItemInput = { id: item.id, content: item.content }
    await API.graphql({ query: updateItemMutation, variables: { input: updateItemInput}});
  } catch (error) {
    console.error('[api-connector] updateItemConnector error', { error });
  }
}


export const deleteItemConnector = async (id) => {
  try {
    await API.graphql({ query: deleteItemMutation, variables: { input: { id } }});
  } catch (error) {
    console.error('[api-connector] deleteItemConnector error', { error });
  }
}

export const getFollowedPlaylistsConnector = async () => {
  try {
    const { username } = await Auth.currentUserInfo() 
    const  { data } = await API.graphql(graphqlOperation(listPlaylists, {filter: { followers:  {contains: username}, owner: {ne: username} }}));
    const followedPlaylists = sortObjectsAlphabetically(data.listPlaylists.items, "title");
    return followedPlaylists
  } catch(error) {
    console.error('[api-connector] getFollowedPlaylistsConnector error', { error });
  }
}

export const getFollowedPlaylistItemsConnector = async (playlist) => {
  try {
    const playlistId = playlist.id;
    const { data } = await API.graphql(graphqlOperation(listItems, { filter: { itemPlaylistId: { eq: playlistId }}}));
    return data.listItems.items
  } catch(error) {
    console.error('[api-connector] getFollowedPlaylistItemsConnector error', { error });
  }
}

export const unfollowPlaylistConnector = async (playlist, followedPlaylists) => {
  try{
    const { username } = await Auth.currentUserInfo() 
    if(!playlist.followers.includes(username)){
      return;
    }
    let followersInput = playlist.followers.filter(p => p!== username);
    const unfollowPlaylistInput = { id: playlist.id, followers: followersInput }
    await API.graphql({ query: updatePlaylistMutation, variables: { input: unfollowPlaylistInput }});
    const newFollowedPlaylistsArray = followedPlaylists.filter(p => p.id !== playlist.id);
    return newFollowedPlaylistsArray;
  } catch (error){
    console.error('[api-connector] unfollowPlaylistConnector error', { error });
  }
}

