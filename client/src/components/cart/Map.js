import React from 'react';
import {GoogleMap, withGoogleMap} from 'react-google-maps';
import Marker from 'react-google-maps/lib/components/Marker';
import { useDispatch } from 'react-redux';
import { setPickupPoint } from '../../store/actions';

const Map = ({pickupPoints,selectedPointCoordinates}) => {

  const dispatch = useDispatch()

  const GMap = () => {
    return (
      <GoogleMap defaultZoom={15} defaultCenter={selectedPointCoordinates}>
        {
          pickupPoints.map(point => (
            <Marker 
              key={point.pickup_point_id} 
              position={{lat: point.coordinates[0], lng: point.coordinates[1]}}
              onClick={() => dispatch(setPickupPoint(point))}/>
          ))
        }
      </GoogleMap>
    )
  }
  
  const WrappedMap = withGoogleMap(GMap)

  return (
    <div className="map">
      <WrappedMap 
        loadingElement={<div style={{width: "100%", height: "100%", backgroundColor: "black"}}/>}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }}/>}
      />
    </div>
  );
};

export default Map;