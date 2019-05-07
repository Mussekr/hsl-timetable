import React, { Component } from 'react';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo';
import './App.css';
import TimeTable from './TimeTables';

const client  = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

export default class App extends Component {
		render() {
			return (
				<ApolloProvider client={client}>
      		<div className="App">
      		<header className="App-header">
						<TimeTable />
      			</header>
    			</div>
    		</ApolloProvider>
			)
		}
}

