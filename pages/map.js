import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap, useMapEvents } from 'react-leaflet/hooks';
import { Icon } from 'leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

const myIcon = new Icon({
 iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Simple_icon_location.svg',
 iconSize: [32,32]
});


const Map = () => {
  const zoom = 26;
  const [position, setPosition] = useState(null);
  const [done, setDone] = useState(false);
  const [vote, setVote] = useState(false);
  const [hid, setHid] = useState('');
  const [voteCount, setVoteCount] = useState(0);

  const updateVote = (data) => {
      fetch("/api/item", {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then((r) => {
        if(r.success) {
          setVote(true);
          setVoteCount(parseInt(voteCount) + 1);
        }
      })
      .catch(error => console.error('Error', error))
  };

  const getVotes = (locHash) => {
    fetch(`/api/item?id=${encodeURIComponent(locHash)}`)
    .then(res => res.json())
    .then((data) => {
      if(data.Item && data.Item !== undefined) {
        setVoteCount(data.Item.votes.S);
      }
      
    })
    .catch(error => console.error('Error', error))
  };

  const setAsArrived = (e) => {
    updateVote({
      Hid: hid,
      lat: position[0],
      lng: position[1],
      votes: parseInt(voteCount) + 1
    });
  };

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
          const locHash = Base64.stringify(sha256(e.latlng.lat + e.latlng.lng));
          setHid(locHash);
          getVotes(locHash);
        },
        locationerror: (e) => {
          console.error(e);
          setDone(true);
        },
      });
    };
  
    return position === null ? null : (
      <Marker position={position} icon={myIcon}>
        <Popup>
          {
            !vote ?
              <button onClick={(e) =>setAsArrived(e)} className="btn btn-primary">
                It's here + {voteCount}
              </button>
              :
              <p>
                {voteCount}
              </p>
          }
        </Popup>
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
