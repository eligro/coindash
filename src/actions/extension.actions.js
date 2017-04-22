import * as types from './action.const';
import ExtensionAPI from '../api/ExtensionApi';

export function getExtensionVersionSuccess(version) {
    return {type: types.GET_EXTENSION_VERSION_SUCCESS, version};
}

export function getExtensionVersion() {
    return (dispatch) => {
        return ExtensionAPI.getVersion().then(version => {
            dispatch(getExtensionVersionSuccess(version));
        }).catch(error => {
            throw(error);
        })
    }
}