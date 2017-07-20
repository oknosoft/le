/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 *
 * @module handlers
 *
 * Created by Evgeniy Malyarov on 15.07.2017.
 */

import {META_LOADED, PRM_CHANGE} from './actions_base';
import {DATA_LOADED, DATA_PAGE, DATA_ERROR, LOAD_START, NO_DATA, SYNC_START, SYNC_DATA} from './actions_pouch';
import {DEFINED, LOG_IN, TRY_LOG_IN, LOG_OUT, LOG_ERROR} from './actions_auth';
import {ADD, CHANGE} from './actions_obj';


export default {

  [META_LOADED]: (state, action) => {
    const {wsql, job_prm} = action.payload;
    const {user} = state;
    let has_login;
    if (wsql.get_user_param('zone') == job_prm.zone_demo && !wsql.get_user_param('user_name') && job_prm.guests.length) {
      wsql.set_user_param('enable_save_pwd', true);
      wsql.set_user_param('user_name', job_prm.guests[0].username);
      wsql.set_user_param('user_pwd', job_prm.guests[0].password);
      has_login = true;
    }
    else if (wsql.get_user_param('enable_save_pwd') && wsql.get_user_param('user_name') && wsql.get_user_param('user_pwd')) {
      has_login = true;
    }
    else {
      has_login = false;
    }

    return Object.assign({}, state, {
      couch_direct: wsql.get_user_param('couch_direct', 'boolean'),
      meta_loaded: true,
      user: Object.assign({}, user, {has_login}),
    });
  },

  [PRM_CHANGE]: (state, action) => state,

  [DATA_LOADED]: (state, action) => Object.assign({}, state, {data_loaded: true, fetch: false}),

  [DATA_PAGE]: (state, action) => Object.assign({}, state, {page: action.payload}),

  [DATA_ERROR]: (state, action) => Object.assign({}, state, {err: action.payload, fetch: false}),

  [LOAD_START]: (state, action) => Object.assign({}, state, {sync_started: true, data_empty: false, fetch: true}),

  [NO_DATA]: (state, action) => Object.assign({}, state, {data_empty: true, fetch: false}),

  [SYNC_START]: (state, action) => Object.assign({}, state, {sync_started: true}),

  [SYNC_DATA]: (state, action) => Object.assign({}, state, {fetch: !!action.payload}),

  [DEFINED]: (state, action) => Object.assign({}, state, {
    user: {
      name: action.payload,
      logged_in: state.user.logged_in,
    },
  }),

  [LOG_IN]: (state, action) => Object.assign({}, state, {
    user: {
      name: action.payload,
      logged_in: true,
      try_log_in: false,
    },
  }),

  [TRY_LOG_IN]: (state, action) => Object.assign({}, state, {
    user: {
      name: action.payload.name,
      try_log_in: true,
      logged_in: state.user.logged_in,
    },
  }),

  [LOG_OUT]: (state, action) => Object.assign({}, state, {
    user: {
      name: state.user.name,
      logged_in: false,
      has_login: false,
      try_log_in: false,
    },
    sync_started: false,
  }),

  [LOG_ERROR]: (state, action) => Object.assign({}, state, {
    user: {
      name: state.user.name,
      logged_in: false,
      has_login: false,
      try_log_in: false,
    },
    sync_started: false,
  }),

  [ADD]: (state, action) => state,

  [CHANGE]: (state, action) => Object.assign({}, state, {obj_change: action.payload}),

};