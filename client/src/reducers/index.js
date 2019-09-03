import { createStore } from 'redux';
import ShuffleVisionStore from './reducers/ShuffleVisionStore';

//initialize store
let store = createStore(ShuffleVisionStore)
console.log(store.getState());