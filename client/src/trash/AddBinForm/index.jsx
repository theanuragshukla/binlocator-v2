import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './AddBinForm.css'
const AddBinForm = ({camStatus, setCamStatus, locStatus, setLocStatus , setLoc}) => {

	const getLocation = () => {
		navigator.geolocation.getCurrentPosition(getCoordinates, getCoordinates);     
	}

	const getCoordinates = (data) => {
		let obj
		try{
			setLocStatus(true)
			obj={
				latitude:data.coords.latitude,
				longitude:data.coords.longitude,
			}}catch(e){
				setLocStatus(false)
				obj={
					latitude:null,
					longitude:null
				}
			}
		setLoc(obj)

	}

	const handleToggle = (value="both") => () => {
		try{
			if(value=="both"){
				handleToggle("camera")
				handleToggle("location")
			}
			if(value==="camera"){
				if(camStatus){
					setCamStatus(false)
					return
				}

				const constraints = {
					video: {
						width: {
							min: 1280,
							ideal: window.innerWidth,
							max: 2560,
						},
						height: {
							min: 720,
							ideal: window.innerHeight,
							max: 1440
						},
						facingMode: {
					//		exact: 'environment'
						}
					}
				};
				navigator.mediaDevices.getUserMedia(constraints).then(function(stream){
					setCamStatus(true)
					stream.getVideoTracks().forEach(function(track) {
						track.stop();
					});
				}).catch(function(err){
					setCamStatus(false)
					if(err.name=="OverconstrainedError"){
						alert("device not supported! please switch to a mobile device to use this feature")
					}

					console.log("There's an error! " + err.message);
				})
			}
			else if(value==="location"){
				if(locStatus){
					setLocStatus(false)	
				}else{
					getLocation()
				}
			}

		}catch(e){
			console.log(e);
		}
	}

React.useEffect(handleToggle(), [])
	return (
		<div className="formWrapper">
		<List
		sx={{ width: '100%', maxWidth: 600, }}
		subheader={<ListSubheader>Required Permissions</ListSubheader>}
		>
		<ListItem>
		<ListItemIcon>
		<PhotoCameraIcon/>
		</ListItemIcon>
		<ListItemText id="switch-list-label-camera" primary="camera" />
		<Switch
		edge="end"
		onChange={handleToggle("camera")}
		checked={camStatus}
		inputProps={{
			'aria-labelledby': 'switch-list-label-camera',
		}}
		/>
		</ListItem>
		<ListItem>
		<ListItemIcon>
		<LocationOnIcon />
		</ListItemIcon>
		<ListItemText id="switch-list-label-location" primary="location" />
		<Switch
		edge="end"
		onChange={handleToggle("location")}
		checked={locStatus}
		inputProps={{
			'aria-labelledby': 'switch-list-label-location',
		}}
		/>
		</ListItem>
		</List>
		</div>  );
}

export default AddBinForm
