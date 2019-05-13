import React from 'react';
import moment from 'moment';
import 'moment/locale/fi';

moment.locale('fi');

const TimeCell = ({ departureTime, isRealTime, isWithinFiteenMinutes = false }) => {
    const departureTimeDiff = departureTime.diff(moment(), 'minutes');

    return (
        <span>
            {isWithinFiteenMinutes ? `${departureTimeDiff} min` : departureTime.format('HH:mm')}
            {isRealTime && <span className="realtime-indicator">*</span>}
        </span>
    )
}


export default TimeCell;
