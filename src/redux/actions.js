import { ACTION_CODE_CHANGED, ACTION_NAME_CHANGED, ACTION_SELECTED_ID_CHANGED } from './types'


export function codeChanged() {
    return {
        type: ACTION_CODE_CHANGED
    }
}


export function nameChanged() {
    return {
        type: ACTION_NAME_CHANGED
    }
}


export function selectedIdChanged(value) {
    return {
        type: ACTION_SELECTED_ID_CHANGED,
        payload: value
    }
}