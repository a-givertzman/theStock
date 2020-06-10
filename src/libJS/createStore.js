export function createStore(rootReducer, initialState = {}) {
    let state = rootReducer(initialState, {type: '__INIT__'})
    const subscribers = []

    return {
        dispatch(state, action) {
            state = rootReducer(state, action)
            subscribers.forEach(sub => sub());
        },

        subscribe(calback) {
            subscribers.push(calback)
        },

        getState() {

        }
    }
}