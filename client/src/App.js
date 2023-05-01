import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost'
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';


import { ApolloClient, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Create a new Apollo client instance with a request function that adds an "authorization" header to each request
// based on the "id_token" stored in localStorage, if it exists. Also set the "uri" option to specify the
// endpoint where the GraphQL server is listening.
const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {
  // Render the entire application inside an ApolloProvider component, which provides the client instance to all
  // components via the React context API.
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          {/* Render a Navbar component at the top of the application */}
          <Navbar />

          {/* Use the Switch component to render different components based on the URL path */}
          <Switch>
            {/* Render the SearchBooks component when the URL path is exactly "/" */}
            <Route exact path='/' component={SearchBooks} />

            {/* Render the SavedBooks component when the URL path is exactly "/saved" */}
            <Route exact path='/saved' component={SavedBooks} />

            {/* Render a generic "Wrong page!" message when the URL path does not match any of the specified routes */}
            <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
