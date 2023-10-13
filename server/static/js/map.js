var map = L.map('map').setView([51.505, -0.09], 18);
let locStatus=false
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '© OpenStreetMap'
}).addTo(map);

const html = (obj) => {
	console.log(obj)
	const url = "https://www.google.com/maps?q="+obj.loc.x+','+obj.loc.y
	return( `
	<div class="info">
				<div class="coords">X: <span id="xcoord">${obj.loc.x}</span></div>
				<div class="coords">Y: <span id="ycoord">${obj.loc.y}</span></div>
				<div class="img" id="img">
				<h3>Dustbin image: </h3>
					<img src="/getImage?uid=${obj.uid}.jpeg" id="imgHere" alt="">
				</div>
			<div class="btns">
	<div id="dir" onclick="(()=>{document.getElementById('popup').classList.add('hidden')})()" class="dir">back</div>
				<div id="dir" onclick="(()=>{location.href='${url}'})()" class="dir">Directions</div>
		</div>	</div>
	`)
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
var popup = L.popup();
function onLocationFound(e) {
    var radius = e.accuracy;
	locStatus=true
    L.circle(e.latlng, radius).addTo(map);
			map.flyTo(e.latlng, map.getZoom())

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();


}
function onMapClick(e) {
 map.locate();
}

map.on('click', onMapClick);
map.on('locationfound', onLocationFound);
L.marker([51.5, -0.09]).on('click', markerOnClick).addTo(map);

const getBinInfo = async (uid) => {
		await fetch('/get-bin-info?uid='+uid)
	.then(res=> res.json())
	.then(res=> {
		setBinInfo(res)
	})
	

}

function markerOnClick(e){
	document.getElementById('popup').classList.remove('hidden')
	getBinInfo(e)
}

function getLongAndLat() {
	return new Promise((resolve, reject) =>
		navigator.geolocation.getCurrentPosition(resolve, reject)
	);
}
const getBins = () => {
	fetch('/get-all-bins')
	.then(res=> res.json())
	.then(res=> {
		res.map(point=>{
			L.marker([point.loc.x, point.loc.y]).on('click', ()=>{markerOnClick(point.uid)}).addTo(map);
		})
	})
}
const locateMe =async () => {
	document.getElementById('map').click()
	while(!locStatus){
		await sleep(10)
	}
	getBins()
}

const setBinInfo = (obj) => {
	document.getElementById("popup").innerHTML=html(obj);
}

window.onload=()=>{
	locateMe()
}
