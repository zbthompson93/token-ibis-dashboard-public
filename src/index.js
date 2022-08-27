import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

// GraphQL packages
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
//import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
//import { setContext } from 'apollo-link-context';
import axios from "axios";

const config = require('./config.json');

axios.defaults.baseURL = config.ibis.api
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// ReactDOM.render(<App />, document.getElementById('root'));
//
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: `${config.ibis.api}/graphql/`,
  credentials: 'include',
})

const client = new ApolloClient({
  cache,
  link
})


// const httpLink = new createHttpLink({
//   uri: 'https://dev.api.tokenibis.org/graphql',
// })
//
// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   //const token = localStorage.getItem('token');
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: "",
//     }
//   }
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache()
// });

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));

serviceWorker.unregister();
