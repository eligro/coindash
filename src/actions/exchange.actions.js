import * as types from './action.const';

export function createExchange(exchange) {
    return {type: types.CREATE_EXCHANGE, exchange};
}

export function deleteExchange(index) {
    return {type: types.DELETE_EXCHANGE, index};
}