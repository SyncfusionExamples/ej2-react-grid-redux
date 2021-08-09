import {createStore} from 'redux';
import reducer from "../reducer/reducer" ;// import the your reducer
const store = new createStore(reducer );//give your reducer name
export default store;