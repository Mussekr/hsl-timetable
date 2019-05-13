import React, {Component, Fragment} from 'react';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo';
import './App.scss';
import TimeTable from './TimeTables';
import Clock from './Clock';
import SvgIcon from './components/SvgIcon';

const client  = new ApolloClient({
  uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

export default class App extends Component {

	state = {
		isSettingsFormOpen: false,
		settings: JSON.parse(localStorage.getItem('settings')) || {},
	};

	saveSettings = (ev) => {
		ev.preventDefault();
		localStorage.setItem('settings', JSON.stringify(this.state.settings));
		this.setState({ isSettingsFormOpen: false });
	};

	renderTimeTables() {
		return (
			<div className="App">
				<Clock />
				<button
					className="settings-button"
					onClick={() => this.setState({ isSettingsFormOpen: true })}
				>
					<SvgIcon icon="settings" fill="#fff" size={24} />
				</button>
      			<div className="destination-list">
					<TimeTable settings={{ ...this.state.settings }} />
      			</div>
    		</div>
		)
	}

	renderSettings() {
		const { settings } = this.state;
		return (
			<Fragment>
				<button
					className="settings-button"
					onClick={() => this.setState({ isSettingsFormOpen: false })}
				>
					<SvgIcon icon="close" fill="#fff" size={24} />
				</button>
				<div className="settings">
					<form onSubmit={(model) => console.log(model)}>
						<input
							type="number"
							value={settings.removeAfterMinutes}
							onChange={(ev) => this.setState({ settings: { ...settings, removeAfterMinutes: ev.target.value } })}
							placeholder="removeAfterMinutes"
						/>
						<br />
						<input
							type="text"
							value={settings.filteredLines}
							onChange={(ev) => this.setState({ settings: { ...settings, filteredLines: ev.target.value.split(',') } })}
							placeholder="filteredLines (comma separated)"
						/>
						<br />
						<input
							type="number"
							value={settings.showAfterMinutes}
							onChange={(ev) => this.setState({ settings: { ...settings, showAfterMinutes: ev.target.value } })}
							placeholder="showAfterMinutes"
						/>
						<br />
						<input onClick={this.saveSettings} type="submit" value="Save" />
					</form>
				</div>
			</Fragment>
		)
	}
	
	render() {
		return (
			<ApolloProvider client={client}>
    			{this.state.isSettingsFormOpen ? this.renderSettings() : this.renderTimeTables()}
    		</ApolloProvider>
		)
	}
}

