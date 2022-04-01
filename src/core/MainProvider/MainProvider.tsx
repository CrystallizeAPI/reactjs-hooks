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
    ClientInterface,
    createNavigationByFoldersFetcher,
    createNavigationByTopicsFetcher,
    createProductHydraterByPaths,
    createProductHydraterBySkus
} from '@crystallize/js-api-client';

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState = (
    configuration: ClientConfiguration,
    language: string
): State => {
    return {
        loading: false,
        language: language,
        configuration: configuration
    };
};

const CrystallizeProvider: FunctionComponent<{
    language: string;
    tenantIdentifier: string;
    accessTokenId?: string;
    accessTokenSecret?: string;
}> = ({
    tenantIdentifier,
    accessTokenId,
    accessTokenSecret,
    language,
    children
}) => {
    const [state, dispatch] = React.useReducer(
        Reducer,
        initialState(
            { tenantIdentifier, accessTokenId, accessTokenSecret },
            language
        )
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
        throw new Error(
            'useCrystallizeState must be used within the MainProvider.'
        );
    }
    return context;
}

function useCrystallizeDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error(
            'useCrystallizeDispatch must be used within the MainProvider.'
        );
    }
    return context;
}

export type LanguageAwareTreeFetcher = (
    path: string,
    depth: number,
    extraQuery?: any,
    perLevel?: (currentLevel: number) => any
) => Promise<any>;

export type LanguageAwareHydrater = (
    items: string[],
    extraQuery?: any,
    perProduct?: (item: string, index: number) => any
) => Promise<any>;

function useCrystallize(): {
    helpers: {
        createNavigationByFoldersFetcher: LanguageAwareTreeFetcher;
        createNavigationByTopicsFetcher: LanguageAwareTreeFetcher;
        createProductHydraterByPaths: LanguageAwareHydrater;
        createProductHydraterBySkus: LanguageAwareHydrater;
    };
    apiClient: ClientInterface;
    state: State;
    dispatch: Actions;
} {
    const actions = mapToReducerActions(useCrystallizeDispatch());
    const state = useCrystallizeState();

    const apiClient = createClient({
        tenantIdentifier: state.configuration.tenantIdentifier
    });

    const helpers = {
        createNavigationByFoldersFetcher: (
            path: string,
            depth: number = 1,
            extraQuery?: any,
            perLevel?: (currentLevel: number) => any
        ) =>
            createNavigationByFoldersFetcher(apiClient)(
                path,
                state.language,
                depth,
                extraQuery,
                perLevel
            ),
        createNavigationByTopicsFetcher: (
            path: string,
            depth: number = 1,
            extraQuery?: any,
            perLevel?: (currentLevel: number) => any
        ) =>
            createNavigationByTopicsFetcher(apiClient)(
                path,
                state.language,
                depth,
                extraQuery,
                perLevel
            ),
        createProductHydraterByPaths: (
            paths: string[],
            extraQuery?: any,
            perProduct?: (item: string, index: number) => any
        ) =>
            createProductHydraterByPaths(apiClient)(
                paths,
                state.language,
                extraQuery,
                perProduct
            ),
        createProductHydraterBySkus: (
            skus: string[],
            extraQuery?: any,
            perProduct?: (item: string, index: number) => any
        ) =>
            createProductHydraterBySkus(apiClient)(
                skus,
                state.language,
                extraQuery,
                perProduct
            )
    };

    return {
        helpers,
        apiClient,
        state,
        dispatch: actions
    };
}

export { CrystallizeProvider, useCrystallize };
