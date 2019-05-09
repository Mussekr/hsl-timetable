import React, { Component } from 'react';
import moment from 'moment';

export default class Clock extends Component {

    state = {
        time: moment(),
    };

    componentDidMount() {
        this.clockInterval = setInterval(() => this.setState({ time: moment() }), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.clockInterval);
    }

    render() {
        return (
            <h1 className="App-logo">{this.state.time.format('HH:mm:ss')}</h1>
        )
    }
}
