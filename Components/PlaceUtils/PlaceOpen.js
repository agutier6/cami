import { HStack, Text } from 'native-base'
import React, { useState, useEffect } from 'react'

export default function PlaceOpen({ openNow, periods, ...props }) {
    const date = new Date();
    const [info, setInfo] = useState('');

    const getDateReadable = (day, time) => {
        let dayReadable;
        let timeReadable;
        if (parseInt(time) >= 1300) {
            timeReadable = String(parseInt(time.slice(0, 2)) - 12) + ':' + time.slice(2, 4) + ' pm'
        } else {
            timeReadable = time.slice(0, 2) + ':' + time.slice(2, 4) + ' am'
        }
        if (day === date.getDay()) {
            return timeReadable;
        } else if (day - date.getDay() === 1 || day - date.getDay() === -6) {
            return 'Tomorrow ' + timeReadable;
        }
        switch (day) {
            case 0:
                dayReadable = "Sunday";
                break;
            case 1:
                dayReadable = "Monday";
                break;
            case 2:
                dayReadable = "Tuesday";
                break;
            case 3:
                dayReadable = "Wednesday";
                break;
            case 4:
                dayReadable = "Thursday";
                break;
            case 5:
                dayReadable = "Friday";
                break;
            case 6:
                dayReadable = "Saturday";
                break;
        }
        return dayReadable + ' ' + timeReadable;
    }

    const getNextOpen = () => {
        for (let i = 0; i < periods.length; i++) {
            if (periods[i].open.day >= date.getDay()) {
                return getDateReadable(periods[i].open.day, periods[i].open.time);
            }
        }
    }

    const getNextClose = () => {
        for (let i = 0; i < periods.length; i++) {
            if (periods[i].open.day >= date.getDay()) {
                return getDateReadable(periods[i].close.day, periods[i].close.time);
            }
        }
    }

    useEffect(() => {
        if (openNow) {
            setInfo(getNextClose());
        } else {
            setInfo(getNextOpen());
        }
    }, [])

    if (openNow) {
        return (
            <HStack space="2" {...props} >
                <Text color="green.400">Open</Text>
                <Text>·</Text>
                <Text>Closes {info}</Text>
            </HStack >
        );
    } else {
        return (
            <HStack space="2" {...props}>
                <Text color="red.400">Closed</Text>
                <Text>·</Text>
                <Text>Opens {info}</Text>
            </HStack>
        );
    }
}