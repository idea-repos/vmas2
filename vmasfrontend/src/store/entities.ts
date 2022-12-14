import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './users';
import rolesReducer from './roles';
import sectionsReducer from './sections';
import targetsReducer from './targets';
import dictionaryReducer from './dictionaryReducers/dictionary';

export default combineReducers({
    users: usersReducer,
    roles: rolesReducer,
    sections: sectionsReducer,
    targets: targetsReducer,
    dictionary: dictionaryReducer
})