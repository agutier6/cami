import React, { useEffect, useMemo } from 'react'
import { ExploreCard } from './ExploreCard';
import { useSelector, useDispatch } from 'react-redux';
import { undoAmount, bufferSize, selectNeedMoreData, selectExploreBuffer, concatBuffer, selectNearbySearchEndReached, fetchPlaceDetails, selectExploreLocationStatus, undo, selectPlaceStatus, selectPlaceError, selectRestaurantLength, selectBarLength, selectNightclubLength, selectCafeLength, fetchRestaurants, fetchBars, fetchCafes, fetchNightclubs } from './exploreSlice';
import CardSkeleton from './CardSkeleton';
import { Ionicons } from '@expo/vector-icons';
import { Fab, Icon, useToast } from 'native-base';
import { useHeaderHeight } from '@react-navigation/elements';
import { useWindowDimensions } from 'react-native';

const ExploreSwipe = () => {
    const placeStatus = useSelector(selectPlaceStatus);
    const placeError = useSelector(selectPlaceError);
    const dispatch = useDispatch();
    const needMoreData = useSelector(selectNeedMoreData);
    const buffer = useSelector(selectExploreBuffer);
    const nearbySearchEndReached = useSelector(selectNearbySearchEndReached);
    const locationStatus = useSelector(selectExploreLocationStatus);
    const restaurantLength = useSelector(selectRestaurantLength);
    const barLength = useSelector(selectBarLength);
    const cafeLength = useSelector(selectCafeLength);
    const nightclubLength = useSelector(selectNightclubLength);
    const layout = useWindowDimensions();
    const headerHeight = useHeaderHeight();
    const cardRefs = useMemo(() => Array(undoAmount + bufferSize).fill(0).map(i => React.createRef()), [])
    const toast = useToast();

    useEffect(() => {
        if (locationStatus === 'succeeded') {
            if (placeStatus.restaurant === 'idle') {
                dispatch(fetchRestaurants());
            }
            if (placeStatus.bar === 'idle') {
                dispatch(fetchBars());
            }
            if (placeStatus.cafe === 'idle') {
                dispatch(fetchCafes());
            }
            if (placeStatus.nightclub === 'idle') {
                dispatch(fetchNightclubs());
            }
            if (placeStatus.restaurant === 'succeeded'
                && placeStatus.bar === 'succeeded'
                && placeStatus.cafe === 'succeeded'
                && placeStatus.nightclub === 'succeeded'
                && buffer.length === 0) {
                dispatch(concatBuffer());
                dispatch(fetchPlaceDetails());
            }
        }
    }, [placeStatus, locationStatus, dispatch,]);

    useEffect(() => {
        if (needMoreData.restaurant && placeStatus.restaurant != 'loading' && !nearbySearchEndReached.restaurant) {
            dispatch(fetchRestaurants());
        }
        if (needMoreData.bar && placeStatus.bar != 'loading' && !nearbySearchEndReached.bar) {
            dispatch(fetchBars());
        }
        if (needMoreData.cafe && placeStatus.cafe != 'loading' && !nearbySearchEndReached.cafe) {
            console.log("cafe needs more data")
            dispatch(fetchCafes());
        }
        if (needMoreData.nightclub && placeStatus.nightclub != 'loading' && !nearbySearchEndReached.nightclub) {
            dispatch(fetchNightclubs());
        }
    }, [needMoreData]);

    if (placeStatus.restaurant === 'failed') {
        console.log("Error fetching restaurants: ", placeError.restaurant);
    }
    if (placeStatus.bar === 'failed') {
        console.log("Error fetching bars: ", placeError.bar);
    }
    if (placeStatus.cafe === 'failed') {
        console.log("Error fetching cafes: ", placeError.cafe);
    }
    if (placeStatus.nightclub === 'failed') {
        console.log("Error fetching nightclubs: ", placeError.nightclub);
    }

    if (buffer.length > 0) {
        return (
            <>
                {buffer.map((item, i) => {
                    if (item) {
                        return <ExploreCard place={item} ref={cardRefs[i]} key={item.place_id} />
                    }
                })}
                <Fab renderInPortal={false}
                    shadow={2} size="sm" bottom={layout.height * 0.305 - headerHeight - 1}
                    icon={<Icon color="white" as={Ionicons} name="arrow-undo" size="sm" />}
                    onPress={() => {
                        const pointer = restaurantLength > 0 && barLength > 0 && cafeLength > 0 && nightclubLength > 0 ? bufferSize : buffer.length - undoAmount;
                        if (pointer > 0 && buffer[pointer]) {
                            dispatch(undo())
                            cardRefs[pointer].current.restoreCard();
                        } else {
                            toast.show({
                                description: "Cannot undo, sorry!",
                                placement: "top"
                            })
                        }
                    }} />
            </>
        );
    }

    return (
        <CardSkeleton />
    )
}

export default ExploreSwipe