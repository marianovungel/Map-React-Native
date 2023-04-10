import { View } from 'react-native';
import { styles } from './style';
import { useEffect, useState, useRef } from 'react';
import MapView, {Marker} from 'react-native-maps'
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy
} from 'expo-location';

export default function App() {

  const [location, setLocation] = useState(null)
  const mapRef = useRef(null)
  async function permition(){
    const { granted } = await requestForegroundPermissionsAsync()
    if(granted){
      const current = await getCurrentPositionAsync();
      setLocation(current)
    }
  }

  useEffect(()=>{
    permition()
  }, [])

  useEffect(()=>{
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1
    }, (response)=>{
      setLocation(response)
      mapRef.current?.animateCamera({
        pitch:70,
        center: response.coords
      })
    })
  }, [])
  
  return (
    <View style={styles.container}>
      {
        location && (
        <MapView 
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        
        >
          <Marker 
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
          />
        </MapView>
        )
      }
    </View>
  );
}
