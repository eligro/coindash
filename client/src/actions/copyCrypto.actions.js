import * as types from './action.const';
import firebase from '../utils/database.react.js';

export function getUsersData() {
  return (dispatch, getState) => {
    dispatch(getUsersDataRequestedAction());
    return firebase.database().ref('/users').once('value', snap => {
      const userData = snap.val();
      var data = [];
      snap.forEach(function(d) {
        data.push( d.val() );
      });
      console.log(data);
      dispatch(getUsersDataFulfilledAction(data));
    })
    .catch((error) => {
      console.log(error);
      dispatch(getUsersDataRejectedAction());
    });
  }
}

export function getUsersDataRequestedAction() {
  console.log("getUsersDataRequestedAction");
  return {type: types.GET_INVITE_REQUESTED};
}

export function getUsersDataRejectedAction() {
  console.log("getUsersDataRejectedAction");
  return {type: types.GET_INVITE_REJECTED}
}

export function getUsersDataFulfilledAction(data) {
  console.log("getUsersDataFulfilledAction: " + data);
  return {type: types.GET_INVITE_SUCCESS, data};
}