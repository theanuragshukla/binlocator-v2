import { Marker, Popup } from "react-leaflet"

const Mark = ({position, text, eventHandlers}) => {
  return (
    <Marker position={position} eventHandlers={eventHandlers?eventHandlers:null}>
      <Popup>{text?text:`${position[0]}, ${position[1]}`}</Popup>
    </Marker>
  )
}

export default Mark
