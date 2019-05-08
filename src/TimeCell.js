import React from 'react';
import moment from 'moment';
import 'moment/locale/fi';

moment.locale('fi');

const TimeCell = ({ departureTimeUnix, serviceDayUnix, isRealTime }) => {
    const serviceDay = moment.unix(serviceDayUnix);
    const departureTime = serviceDay.add(departureTimeUnix, 'seconds');
    const departureTimeDiff = departureTime.diff(moment(), 'minutes');
    const isWithinFiveMinutes = departureTimeDiff <= 10;
    return (
        <span>
            {isWithinFiveMinutes ? `${departureTimeDiff} mins` : departureTime.format('HH:mm')}
            {isRealTime && <i style={{color: 'red'}}>*</i>}
        </span>
    )
}


export default TimeCell;
