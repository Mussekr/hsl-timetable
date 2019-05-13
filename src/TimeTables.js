import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import moment from 'moment';
import classNames from 'classnames';
import _ from 'lodash';
import TimeCell from './TimeCell';
import SvgIcon from './components/SvgIcon';

const vehicleTypes = {
    3: 'bus',
    109: 'train',
};

export default class TimeTable extends Component {
    render() {
        const { settings } = this.props;
        const removeAfterMinutes = _.get(settings, 'removeAfterMinutes', '5');
        const filteredLines = _.get(settings, 'filteredLines', []);
        const showAfterMinutes = _.get(settings, 'showAfterMinutes', '15');
        return (
            <Query
                variables={{ stops: ["HSL:1465101","HSL:1291181","HSL:1465551", "HSL:1465102"] }}
                pollInterval={15000}
                query={gql`{
                    stops(ids: ["HSL:1465101","HSL:1291181","HSL:1465551", "HSL:1465102"]) {
                        id
                        name
                        desc
                        vehicleType
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
                            <div key={stop.id} className="destination">
                                <header className="destination__header">
                                    <SvgIcon icon={vehicleTypes[stop.vehicleType]} />
                                    <div>
                                        <h3 className="destination__name">{stop.name}</h3>
                                        <h5 className="destination__desc">{stop.desc}</h5>
                                    </div>
                                </header>
                                <table className="timetable">
                                    <tbody>
                                        {stop.stoptimesWithoutPatterns.map((stopTime, index) => {
                                            const serviceDay = moment.unix(stopTime.serviceDay);
                                            const departureTime = serviceDay.add(stopTime.realtime ? stopTime.realtimeDeparture : stopTime.scheduledDeparture, 'seconds');
                                            const departureTimeDiff = departureTime.diff(moment(), 'minutes');
                                            if (departureTimeDiff <= parseInt(removeAfterMinutes, 10)) return null;
                                            if (filteredLines.includes(_.get(stopTime, 'trip.route.shortName'))) return null;

                                            const isWithinFiteenMinutes = departureTimeDiff <= parseInt(showAfterMinutes, 10);

                                            return (
                                                <tr
                                                    key={index}
                                                    className={classNames('timetable__row', {
                                                        'timetable__row--next': isWithinFiteenMinutes,
                                                    })}
                                                >
                                                    <td className="timetable__time">
                                                        <TimeCell
                                                            departureTime={departureTime}
                                                            isRealTime={stopTime.realtime}
                                                            isWithinFiteenMinutes={isWithinFiteenMinutes}
                                                        />
                                                    </td>
                                                    <td className="timetable__route">
                                                        {stopTime.trip.route.shortName}
                                                    </td>
                                                    <td className="timetable__stop">
                                                        {stopTime.headsign}
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
