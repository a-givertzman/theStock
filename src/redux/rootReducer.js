import {combineReducers} from 'redux'
import { 
    ACTION_CODE_CHANGED, 
    ACTION_NAME_CHANGED, 
    ACTION_SELECTED_ID_CHANGED,
    ACTION_ROTATION
} from './types'



const initialSearchState = {
    selecdetId: 0
}

function searchReducer(state = initialSearchState, action) {

    switch(action.type) {
        case ACTION_SELECTED_ID_CHANGED:
            return {...state, selecdetId: action.payload}
        default: return state
        }
}


const initialRotationState = {
    positionIndex: 0
}

function rotationReducer(state = initialRotationState, action) {

    switch(action.type) {
        case ACTION_ROTATION:
            return {...state, positionIndex: state.payload}
        default: return state
    }
}

export const rootReducer = combineReducers({
    search: searchReducer,
    rotation: rotationReducer
})