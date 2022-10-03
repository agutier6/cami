import MapView, { Marker } from 'react-native-maps';
import { Box } from 'native-base';
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useWindowDimensions } from 'react-native';
import { selectExploreLocation, selectExploreMapMarker, selectExploreRegion, setRegion, setMapMarker, openFilterModal } from './exploreSlice';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants'
import Geocoder from 'react-native-geocoding';

export default function ExploreChangeLocation() {
    const dispatch = useDispatch();
    const location = useSelector(selectExploreLocation);
    const region = useSelector(selectExploreRegion);
    const mapMarker = useSelector(selectExploreMapMarker);
    const [mapReady, setMapReady] = useState(false);
    const layout = useWindowDimensions();
    Geocoder.init(Constants.manifest?.extra?.placesApiKey);

    return (
        <Box>
            <Box h={layout.height * 0.85} w={layout.width}>
                {location &&
                    <>
                        <MapView style={{
                            flex: 1
                        }}
                            region={region}
                            onRegionChangeComplete={(region) => dispatch(setRegion(region))}
                            onMapReady={() => {
                                setMapReady(true);
                            }}
                            showsUserLocation={true}
                        >
                            {mapReady && <Marker draggable
                                coordinate={mapMarker}
                                onDragEnd={(coords) => {
                                    dispatch(setMapMarker(coords.nativeEvent.coordinate));
                                    dispatch(setRegion({
                                        ...coords.nativeEvent.coordinate,
                                        latitudeDelta: region.latitudeDelta,
                                        longitudeDelta: region.longitudeDelta
                                    }));
                                }}
                            />}
                        </MapView>
                    </>
                }
            </Box>
            <Box position="absolute" top={layout.height * 0.01} left={layout.width * 0.025} width={layout.width * 0.825}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    nearbyPlacesAPI='GoogleReverseGeocoding'
                    filterReverseGeocodingByTypes={['geocode']}
                    minLength={3}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        let delta = 0.01;
                        if (data.types.find(element => element === 'sublocality')) {
                            delta = 0.1
                        } else if (data.types.find(element => element === 'locality')) {
                            delta = 0.5
                        } else if (data.types.find(element => element === 'administrative_area_level_1')) {
                            delta = 5
                        } else if (data.types.find(element => element === 'country')) {
                            delta = 30
                        }
                        Geocoder.from(data.description)
                            .then(json => {
                                var loc = json.results[0].geometry.location;

                                dispatch(setMapMarker({
                                    latitude: loc.lat,
                                    longitude: loc.lng
                                }));
                                dispatch(setRegion({
                                    latitude: loc.lat,
                                    longitude: loc.lng,
                                    latitudeDelta: delta,
                                    longitudeDelta: delta
                                }))
                            })
                            .catch(error => console.warn(error));
                    }}
                    query={{
                        key: Constants.manifest?.extra?.placesApiKey,
                        language: 'en',
                    }}
                />
            </Box>
        </Box>
    )
}