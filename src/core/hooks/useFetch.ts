const fetchResult = async (url: RequestInfo, init?: RequestInit): Promise<any> => {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            Accept: 'application/json',
        },
        ...init,
    });

    if (!response.ok) {
        throw new Error(`Could not fetch ${url}. Response NOT OK.`);
    }
    const json = await response.json();
    if (json.errors) {
        throw new Error(`Could not fetch ${url}. Response contains errors.`);
    }
    return json;
};

const jsonRequest = async <T>(input: RequestInfo, method: string, init?: RequestInit): Promise<T> => {
    return fetchResult(input, {
        method: method,
        ...init,
    });
};

export const getJson = async <T>(input: RequestInfo, init?: RequestInit): Promise<T> => jsonRequest(input, 'GET', init);

export const postJson = async <T>(input: RequestInfo, body: any, init?: RequestInit): Promise<T> =>
    jsonRequest(input, 'POST', {
        body: JSON.stringify(body),
        ...init,
    });

export const useFetchResult = () => {
    const abortController = new AbortController();
    const abort = () => {
        abortController.abort();
    };

    const signalInit = {
        signal: abortController.signal,
    };

    const get = async <T>(url: string, init?: RequestInit): Promise<T> => {
        return await getJson(url, {
            ...signalInit,
            ...init,
        });
    };

    const post = async <T>(url: string, body: any, init?: RequestInit): Promise<T> => {
        return await postJson(url, body, {
            ...signalInit,
            ...init,
        });
    };

    return { get, post, abort };
};
