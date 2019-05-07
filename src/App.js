import React, { Component } from 'react';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo';
import './App.css';
import TimeTable from './TimeTables';
import moment from 'moment';

const client  = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

export default class App extends Component {

		state = {
				time: moment(),
		};

		componentDidMount() {
			this.timeInterval = setInterval(() => this.setState({ time: moment() }), 1000);
		}

		componentWillUnmount() {
				clearInterval(this.timeInterval);
		}

		render() {
			return (
				<ApolloProvider client={client}>
      		<div className="App">
					<h1 className="App-logo">{this.state.time.format('HH:mm')}</h1>
      		<header className="App-header">
						<TimeTable />
      			</header>
    			</div>
    		</ApolloProvider>
			)
		}
}

