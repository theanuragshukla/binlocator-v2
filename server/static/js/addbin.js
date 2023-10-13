// Set constraints for the video stream
let loc, locStatus=false;
let imgObj;
let isMobile = true
const getLocation = async() => {
	await navigator.geolocation.getCurrentPosition(getCoordinates, getCoordinates);     
}
window.mobileCheck = function() {
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
	console.log("mobile")
	isMobile=true
	return
}
	console.log("not mbile")
	isMobile=false
};
const getCoordinates = async(data) => {
	let obj
	try{
		locStatus=true
		obj={
			latitude:data.coords.latitude,
			longitude:data.coords.longitude,
		}}catch(e){
			locStatus=false
			alert("please allow location permisson to proceed")
			location.href='/'
			obj={
				latitude:null,
				longitude:null
			}
		}
	loc=obj
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const uploadBin=()=>{
	fetch('/upload-new-bin', {
		method: 'POST',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( {
			loc:loc,
			img:JSON.stringify(imgObj)
		})
	})
		.then(res=>res.json())
		.then(res=>{
			if(res.status){
				alert("bin added Successfully")
				location.href='/'
			}else{
				alert('some eror occoured')
			}
		})

}


// Start the video stream when the window loads
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
	cameraOutput = document.querySelector("#camera--output"),
	cameraSensor = document.querySelector("#camera--sensor"),
	cameraTrigger = document.querySelector("#camera--trigger");

// Access the device camera and stream to cameraView
function cameraStart() {
const constraints = {
	audio:false, 
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
		facingMode:isMobile? {exact:"environment"}: 'user'
	}
};
console.log(constraints)
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function(stream) {
			track = stream.getTracks()[0];
			cameraView.srcObject = stream;
		})
		.catch(function(error) {
			console.error("Oops. Something is broken.", error);
		});
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function(e) {
	cameraSensor.width = cameraView.videoWidth;
	cameraSensor.height = cameraView.videoHeight;
	cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
	imgObj = cameraSensor.toDataURL("image/jpeg");
	cameraOutput.src = cameraSensor.toDataURL("image/jpeg");
	cameraView.classList.add("taken");
	track.stop();
	uploadBin()
};
const reset = () => {
	cameraView.classList.remove('taken')
	cameraStart()
}
window.onload=async ()=>{
	mobileCheck()
	const verify =async ()=>{
		await fetch('/checkAuth', {
			method: 'GET',
			crossdomain: true,
			withCredentials:'include'
		})
			.then(res => res.json())
			.then(res =>manageAuth(res))
	}
	const manageAuth=(val)=>{
		data=val
		if(!val.result){
			location.href='/'
		}
	}
	await verify()
	await getLocation()
	while(!locStatus)(
		await sleep(10)
	)
	cameraStart()

}

