# Crystallize React JS Hooks

---

This repository is what we call a "subtree split": a read-only copy of one directory of the main repository.

If you want to report or contribute, you should do it on the main repository: https://github.com/CrystallizeAPI/libraries

---

## Description

This is a simple base for Crystallize React JS Hooks

It provides a `CrystallizeProvider` on which you can get:

-   apiClient
-   a state
-   some actions

## Usage

```javascript
import { CrystallizeProvider } from '@crystallize/reactjs-hooks';
ReactDOM.render(
    <React.StrictMode>
        <CrystallizeProvider language="en" tenantIdentifier="furniture">
            <App />
        </CrystallizeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
```

And then anywhere in the tree:

```javascript
import { useCrystallize } from '@crystallize/reactjs-hooks';
const { state, dispacth, apiClient } = useCrystallize();

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
            path: '/shop/chairs/bamboo-chair'
        });

        console.log(response.data.catalogue.name);
    })();
}, []);
```
