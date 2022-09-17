import { Box, Text } from 'native-base'
import React from 'react'

export default function PlaceOpen({ openNow, periods, ...props }) {
    // const dayOfTheWeek = (new Date()).getDay();

    // const getNextOpenDay = () => {
    //     let openDates = periods.map(period => period.open.day);
    //     let daysTillOpen = -1;
    //     let nextDayOpen = -1;
    //     periods.array.forEach(element => {
    //         if (element > dayOfTheWeek) {
    //             daysTillOpen = element - dayOfTheWeek;
    //             nextDayOpen = element;
    //         }
    //     });
    //     if (daysTillOpen > -1) {
    //         if (daysTillOpen === 0) {
    //             return 'today';
    //         }
    //     }
    // }
    if (openNow) {
        return (
            <Box {...props}>
                <Text color="green.400">Open</Text>
            </Box>
        );
    } else {
        return (
            <Box {...props}>
                <Text color="red.400">Closed</Text>
            </Box>
        );
    }
}