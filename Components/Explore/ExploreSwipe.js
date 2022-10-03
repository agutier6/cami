import React, { useEffect, useMemo } from 'react'
import { ExploreCard } from './ExploreCard';
import { useSelector, useDispatch } from 'react-redux';
import { undoAmount, bufferSize, fetchPlaceIds, selectPlaceIdStatus, selectPlaceIdError, selectNeedMoreData, selectExploreBuffer, concatBuffer, selectNearbySearchEndReached, fetchPlaceDetails, selectExploreLocationStatus, undo, increasePhotoCount } from './exploreSlice';
import CardSkeleton from './CardSkeleton';
import { Ionicons, Fontisto } from '@expo/vector-icons';
import { Fab, Icon, useToast } from 'native-base';
import { useHeaderHeight } from '@react-navigation/elements';
import { useWindowDimensions } from 'react-native';

const ExploreSwipe = () => {
    const placeIdStatus = useSelector(selectPlaceIdStatus);
    const placeIdError = useSelector(selectPlaceIdError);
    const dispatch = useDispatch();
    const needMoreData = useSelector(selectNeedMoreData);
    const buffer = useSelector(selectExploreBuffer);
    const nearbySearchEndReached = useSelector(selectNearbySearchEndReached);
    const locationStatus = useSelector(selectExploreLocationStatus);
    const layout = useWindowDimensions();
    const headerHeight = useHeaderHeight();
    const cardRefs = useMemo(() => Array(undoAmount + bufferSize).fill(0).map(i => React.createRef()), [])
    const toast = useToast();

    useEffect(() => {
        let isSubscribed = true;
        if (locationStatus === 'succeeded' && isSubscribed) {
            if (placeIdStatus === 'idle') {
                dispatch(fetchPlaceIds());
            }
            if (placeIdStatus === 'succeeded' && buffer.length === 0) {
                dispatch(concatBuffer());
                dispatch(fetchPlaceDetails());
            }
        }
        return () => isSubscribed = false;
    }, [placeIdStatus, locationStatus, dispatch,]);

    useEffect(() => {
        let isSubscribed = true;
        if (needMoreData && placeIdStatus != 'loading' && !nearbySearchEndReached && isSubscribed) {
            dispatch(fetchPlaceIds());
        }
        return () => isSubscribed = false;
    }, [needMoreData]);

    if (placeIdStatus === 'failed') {
        console.log(placeIdError);
    }

    if (buffer.length > 0) {
        return (
            <>
                {buffer.map((item, i) => {
                    if (item) {
                        return <ExploreCard place={item} ref={cardRefs[i]} index={i} key={item.place_id} />
                    }
                })}
                <Fab renderInPortal={false}
                    shadow={2} size="sm" bottom={layout.height * 0.305 - headerHeight - 1}
                    icon={<Icon color="white" as={Ionicons} name="arrow-undo" size="sm" />}
                    onPress={() => {
                        if (buffer[bufferSize]) {
                            dispatch(undo())
                            cardRefs[bufferSize].current.restoreCard();
                            dispatch(fetchPlaceDetails());
                        } else {
                            toast.show({
                                description: "Cannot undo, sorry!",
                                placement: "top"
                            })
                        }
                    }} />
                <Fab renderInPortal={false}
                    shadow={2} size="sm" bottom={layout.height * 0.375 - headerHeight - 1}
                    icon={<Icon color="white" as={Fontisto} name="photograph" size="sm" />}
                    onPress={() => {
                        dispatch(increasePhotoCount());
                    }} />
            </>
        );
    }

    return (
        <CardSkeleton />
    )
}

export default ExploreSwipe