import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import moment from 'moment';
import _ from 'lodash';
import TimeCell from './TimeCell';

export default class TimeTable extends Component {
    render() {
        const { settings } = this.props;
        const removeAfterMinutes = _.get(settings, 'removeAfterMinutes', '5');
        const filteredLines = _.get(settings, 'filteredLines', []);
        const showAfterMinutes = _.get(settings, 'showAfterMinutes', '15');
        return (
            <Query
                variables={{ stops: ["HSL:1465551","HSL:1291181","HSL:1465102", "HSL:1465101"] }}
                pollInterval={15000}
                query={gql`{
                    stops(ids: ["HSL:1465551","HSL:1291181","HSL:1465102", "HSL:1465101"]) {
                        id
                        name
                        desc
                        stoptimesWithoutPatterns(numberOfDepartures: 10) {
                            serviceDay
                            scheduledDeparture
                            realtime
                            realtimeDeparture
                            realtimeArrival
                            realtimeState
                            headsign
                            trip {
                                route {
                                    longName
                                    shortName
                                }
                            }
                        }
                    }
                }`}
                >
                    {({ loading, error, data }) => {
                        if (loading) return <div>loading...</div>
                        if (error) return <div>error: {JSON.stringify(error)}</div>
                        return data.stops.map((stop) => (
                            <div key={stop.id}>
                            <h3>{stop.name}</h3>
                            <h5>{stop.desc}</h5>
                            <table className="timetable">
                                <tbody>
                                    {stop.stoptimesWithoutPatterns.map((stopTime, index) => {
                                        const serviceDay = moment.unix(stopTime.serviceDay);
                                        const departureTime = serviceDay.add(stopTime.realtime ? stopTime.realtimeDeparture : stopTime.scheduledDeparture, 'seconds');
                                        const departureTimeDiff = departureTime.diff(moment(), 'minutes');
                                        if (departureTimeDiff <= parseInt(removeAfterMinutes, 10)) return null;
                                        if (filteredLines.includes(_.get(stopTime, 'trip.route.shortName'))) return null;
                                        return (
                                            <tr key={index}>
                                                <td>{stopTime.headsign} ({stopTime.trip.route.shortName})</td>
                                                <td>
                                                    <TimeCell
                                                        showAfterMinutes={showAfterMinutes}
                                                        departureTime={departureTime}
                                                        isRealTime={stopTime.realtime}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            </div>
                        ))
                    }}
                </Query>
        )
    }
}
