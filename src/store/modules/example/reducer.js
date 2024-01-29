import * as types from '../types';

const initialState = {
  buttonClicked: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.BUTTON_CLICKED_SUCCESS: {
      console.log('Request SUCCESS');
      const newState = { ...state };
      newState.buttonClicked = !newState.buttonClicked;
      return newState;
    }

    case types.BUTTON_CLICKED_FAILURE: {
      console.log('Request ERROR');
      return state;
    }

    case types.BUTTON_CLICKED_REQUEST: {
      console.log('Making a request...');
      return state;
    }

    default: {
      return state;
    }
  }
}
