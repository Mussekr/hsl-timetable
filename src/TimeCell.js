import React from 'react';
import moment from 'moment';
import 'moment/locale/fi';

moment.locale('fi');

const TimeCell = ({ departureTime, isRealTime, showAfterMinutes }) => {
    const departureTimeDiff = departureTime.diff(moment(), 'minutes');
    const isWithinFithteenMinutes = departureTimeDiff <= parseInt(showAfterMinutes, 10);
    return (
        <span>
            {isWithinFithteenMinutes ? `${departureTimeDiff} mins` : departureTime.format('HH:mm')}
            {isRealTime && <i style={{color: 'red'}}>*</i>}
        </span>
    )
}


export default TimeCell;
