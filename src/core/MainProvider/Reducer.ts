import { ClientConfiguration } from '@crystallize/js-api-client';

type Action =
    | { type: 'LOADING'; state: boolean }
    | { type: 'UPDATE_CONFIGURATION'; configuration: ClientConfiguration };

export type Actions = {
    loading: (state: boolean) => void;
    updateConfiguration: (configuration: ClientConfiguration) => void;
};

export type Dispatch = (action: Action) => void;

export type State = {
    configuration: ClientConfiguration;
    loading: boolean;
};

export function Reducer(state: State, action: Action) {
    switch (action.type) {
        case 'LOADING': {
            return {
                ...state,
                loading: action.state
            };
        }
        case 'UPDATE_CONFIGURATION': {
            return {
                ...state,
                configuration: action.configuration
            };
        }
        default: {
            throw new Error('Main Provider - Unhandled action type');
        }
    }
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {
        loading: (state: boolean) => dispatch({ type: 'LOADING', state }),
        updateConfiguration: (configuration: ClientConfiguration) =>
            dispatch({ type: 'UPDATE_CONFIGURATION', configuration })
    };
}
