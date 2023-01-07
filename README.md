# React JS Hooks

This is the **JS API Client** wrapper for React JS using hooks.

It provides Hooks and a Provider to handle a Crystallize State.

## Installation

With NPM

```bash
npm install @crystallize/reactjs-hooks
```

With Yarn

```bash
yarn add @crystallize/reactjs-hooks
```

## Usage

```javascript
import { CrystallizeProvider } from '@crystallize/reactjs-hooks';
ReactDOM.render(
    <CrystallizeProvider language="en" tenantIdentifier="furniture">
        <App />
    </CrystallizeProvider>,
    document.getElementById('root'),
);
```

And then anywhere in the component tree:

```javascript
import { useCrystallize } from '@crystallize/reactjs-hooks';
const { state, dispatch, apiClient, helpers } = useCrystallize();

// Component A

useEffect(() => {
    (async () => {
        const caller = apiClient.catalogueApi;
        const query = `query ($language: String!, $path: String!) {
                    catalogue(language: $language, path: $path) {
                        ... on Product {
                        name
                        }
                    }
                }`;
        const response = await caller(query, {
            language: 'en',
            path: '/shop/chairs/bamboo-chair',
        });

        console.log(response.data.catalogue.name);
    })();
}, []);
```

As you can see, you get direct access to a built **apiClient**. You also get access to a helpers object that wraps the following constructors from the JS API Client:

-   catalogueFetcher
-   navigationFetcher
-   productHydrater
-   orderFetcher

But on those, in the React JS Context you don’t have to provide the language, because the context knows it.

The State holds the configuration and the language, and the Dispatch exposes:

-   loading: (state: boolean)
-   changeLanguage: (language: string)
-   updateConfiguration: (configuration: ClientConfiguration)

You can check out this live demo: https://crystallizeapi.github.io/libraries/reactjs-hooks/use-crystallize

[crystallizeobject]: crystallize_marketing|folder|62561a0b0aab13b2ea127afe
