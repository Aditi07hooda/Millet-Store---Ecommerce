import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import Loader from '../UI/Loader';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 12.7998628616333,
  lng: 77.52685546875,
};

const GeoLocation = () => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      loadingElement={<Loader/>}
    >
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
        <MarkerF position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GeoLocation;
