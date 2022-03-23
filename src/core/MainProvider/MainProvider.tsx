import * as React from 'react';
import {
    State,
    Dispatch,
    Actions,
    Reducer,
    mapToReducerActions
} from './Reducer';
import { FunctionComponent } from 'react';
import {
    ClientConfiguration,
    createClient,
    ClientInterface
} from '@crystallize/js-api-client';

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState = (configuration: ClientConfiguration): State => {
    return {
        loading: false,
        configuration: configuration
    };
};

const CrystallizeProvider: FunctionComponent<{
    tenantIdentifier: string;
    accessTokenId?: string;
    accessTokenSecret?: string;
}> = ({ tenantIdentifier, accessTokenId, accessTokenSecret, children }) => {
    const [state, dispatch] = React.useReducer(
        Reducer,
        initialState({ tenantIdentifier, accessTokenId, accessTokenSecret })
    );
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {children}
            </DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useCrystallizeState() {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useCrystallizeState must be used within an App.');
    }
    return context;
}

function useCrystallizeDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useCrystallizeDispatch must be used within an App.');
    }
    return context;
}

function useCrystallize(): {
    apiClient: ClientInterface;
    state: State;
    dispatch: Actions;
} {
    const actions = mapToReducerActions(useCrystallizeDispatch());
    const state = useCrystallizeState();
    return {
        apiClient: createClient({
            tenantIdentifier: state.configuration.tenantIdentifier
        }),
        state,
        dispatch: actions
    };
}

export { CrystallizeProvider, useCrystallize };
