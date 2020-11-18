import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const Client = new ApolloClient({
    link: new HttpLink({
        uri: '/.netlify/functions/todo',
        fetch,
    }),
    cache: new InMemoryCache()
});