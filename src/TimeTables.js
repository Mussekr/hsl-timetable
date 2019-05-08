import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import TimeCell from './TimeCell';

export default class TimeTable extends Component {
    render() {
        return (
            <Query
                pollInterval={30000}
                query={gql`{
                    stops(ids:["HSL:1465551","HSL:1291181","HSL:1465102", "HSL:1465101"]) {
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
                        if (error) return <div>error: {error}</div>
                        return data.stops.map((stop) => (
                            <div key={stop.id}>
                            <h3>{stop.name}</h3>
                            <h5>{stop.desc}</h5>
                            <table className="timetable">
                                <tbody>
                                    {stop.stoptimesWithoutPatterns.map((stopTime, index) => (
                                        <tr key={index}>
                                            <td>{stopTime.headsign} ({stopTime.trip.route.shortName})</td>
                                            <td>
                                                <TimeCell
                                                    departureTimeUnix={stopTime.realtime ? stopTime.realtimeDeparture : stopTime.scheduledDeparture}
                                                    serviceDayUnix={stopTime.serviceDay}
                                                    isRealTime={stopTime.realtime}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        ))
                    }}
                </Query>
        )
    }
}
