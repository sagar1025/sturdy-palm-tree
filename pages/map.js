import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap, useMapEvents } from 'react-leaflet/hooks'
import { Icon } from 'leaflet';
import { useState, useEffect } from 'react';

const myIcon = new Icon({
 iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Simple_icon_location.svg',
 iconSize: [32,32]
})

const Map = () => {

  const [position, setPosition] = useState([]);
  const [done, setDone] = useState(false);


  function LocationMarker() {
    const map = useMap();
    map.locate();

    useMapEvents({
      locationChanged: (e) => {
        console.log(e);
        setDone(true);
      },
      locationfound: (e) => {
        setPosition(e.latlng);
        setDone(true);
      },
      locationerror: (e) => {
        console.error(e);
        console.log("ffffff");
        setDone(true);
      },
    })
  
    return position === null ? null : (
      <Marker position={position} icon={myIcon}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  return (
    <MapContainer zoom={13} scrollWheelZoom={false} style={{height: 400, width: "100%"}}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  )
}

export default Map
