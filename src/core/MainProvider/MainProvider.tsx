'use client';
import * as React from 'react';
import { State, Dispatch, Actions, Reducer, mapToReducerActions } from './Reducer';
import { FunctionComponent } from 'react';
import {
    ClientConfiguration,
    createClient,
    ClientInterface,
    createNavigationFetcher,
    createProductHydrater,
    createOrderFetcher,
    createCatalogueFetcher,
} from '@crystallize/js-api-client';

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState = (configuration: ClientConfiguration, language: string): State => {
    return {
        loading: false,
        language: language,
        configuration: configuration,
    };
};

const CrystallizeProvider: FunctionComponent<{
    children: React.ReactNode;
    language: string;
    tenantIdentifier: string;
    accessTokenId?: string;
    accessTokenSecret?: string;
}> = ({ tenantIdentifier, accessTokenId, accessTokenSecret, language, children }) => {
    const [state, dispatch] = React.useReducer(
        Reducer,
        initialState({ tenantIdentifier, accessTokenId, accessTokenSecret }, language),
    );
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useCrystallizeState() {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useCrystallizeState must be used within the MainProvider.');
    }
    return context;
}

function useCrystallizeDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useCrystallizeDispatch must be used within the MainProvider.');
    }
    return context;
}

export type LanguageAwareTreeFetcher = (
    path: string,
    depth: number,
    extraQuery?: any,
    perLevel?: (currentLevel: number) => any,
) => Promise<any>;

export type LanguageAwareHydrater = (
    items: string[],
    extraQuery?: any,
    perProduct?: (item: string, index: number) => any,
) => Promise<any>;

type helpers = {
    catalogueFetcher: ReturnType<typeof createCatalogueFetcher>;
    navigationFetcher: {
        byFolders: LanguageAwareTreeFetcher;
        byTopics: LanguageAwareTreeFetcher;
    };
    productHydrater: {
        byPaths: LanguageAwareHydrater;
        bySkus: LanguageAwareHydrater;
    };
    orderFetcher: ReturnType<typeof createOrderFetcher>;
};

function useCrystallize(): {
    helpers: helpers;
    apiClient: ClientInterface;
    state: State;
    dispatch: Actions;
} {
    const actions = mapToReducerActions(useCrystallizeDispatch());
    const state = useCrystallizeState();

    const apiClient = createClient({
        tenantIdentifier: state.configuration.tenantIdentifier,
    });

    const helpers: helpers = React.useMemo(() => {
        return {
            catalogueFetcher: createCatalogueFetcher(apiClient),
            navigationFetcher: {
                byFolders: (
                    path: string,
                    depth: number = 1,
                    extraQuery?: any,
                    perLevel?: (currentLevel: number) => any,
                ) => createNavigationFetcher(apiClient).byFolders(path, state.language, depth, extraQuery, perLevel),
                byTopics: (
                    path: string,
                    depth: number = 1,
                    extraQuery?: any,
                    perLevel?: (currentLevel: number) => any,
                ) => createNavigationFetcher(apiClient).byTopics(path, state.language, depth, extraQuery, perLevel),
            },
            productHydrater: {
                byPaths: (paths: string[], extraQuery?: any, perProduct?: (item: string, index: number) => any) =>
                    createProductHydrater(apiClient).byPaths(paths, state.language, extraQuery, perProduct),
                bySkus: (skus: string[], extraQuery?: any, perProduct?: (item: string, index: number) => any) =>
                    createProductHydrater(apiClient).bySkus(skus, state.language, extraQuery, perProduct),
            },
            orderFetcher: createOrderFetcher(apiClient),
        };
    }, [apiClient, state.language]);
    return {
        helpers,
        apiClient,
        state,
        dispatch: actions,
    };
}

export { CrystallizeProvider, useCrystallize };
