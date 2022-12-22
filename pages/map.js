import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap, useMapEvents } from 'react-leaflet/hooks'
import { Icon } from 'leaflet';
import { useState } from 'react';
import L from 'leaflet'

const myIcon = new Icon({
 iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Simple_icon_location.svg',
 iconSize: [32,32]
})

const Map = () => {
  const zoom = 26;
  const [position, setPosition] = useState(null);
  const [done, setDone] = useState(false);

  const LocationMarker = () => {
    const map = useMap();
    if(!done) {
      map.locate();
      useMapEvents({
        locationfound: (e) => {
          setDone(true);
          const lat = e.latlng.lat;
          const lng =  e.latlng.lng; 
          setPosition([lat, lng]);
          map.setView(new L.LatLng(lat, lng), zoom);
        },
        locationerror: (e) => {
          console.error(e);
          setDone(true);
        },
      });
    };
  
    return position === null ? null : (
      <Marker position={position} icon={myIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{height: 500, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  )
}

export default Map
