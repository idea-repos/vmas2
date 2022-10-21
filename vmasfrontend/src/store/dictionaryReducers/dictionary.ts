import { combineReducers } from '@reduxjs/toolkit';
import sourcesReducer from './sources';
import speakersReducer from './speakers';
import precedencesReducer from './precedences';
import keywordsReducer from './keywords';
import receiversReducer from './receivers';
import categoryReducer from './category';
import languagesReducer from './langauges';
import regionsReducer from './regions';

export default combineReducers({
    sources : sourcesReducer,
    speakers: speakersReducer,
    precedences: precedencesReducer,
    keywords : keywordsReducer,
    receivers: receiversReducer,
    category: categoryReducer,
    languages: languagesReducer,
    regions: regionsReducer,
});