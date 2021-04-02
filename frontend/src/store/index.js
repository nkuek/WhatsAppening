import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import chatListReducer from './chatlist';
import session from './session';
import chatroomReducer from './chatroom';
import userSearchReducer from './usersearch';

const rootReducer = combineReducers({
    session,
    chatList: chatListReducer,
    chatRoom: chatroomReducer,
    userSearch: userSearchReducer,
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = require('redux-logger').default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
