const error = document.getElementById('error')
let querystring,rescue

/* Main Login Function */

const login=(e)=>{
	e.innerText="wait..."
	const user = document.getElementById('user')
	const pass = document.getElementById('pass')

	const data = {
		pass:pass.value,
		email:user.value
	}

	fetch('/let-me-in', {
		method: 'POST',
		headers: {
			'Accept': 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( {
			pass:pass.value,
			email:user.value
		})
	})
		.then(res=>res.json())
		.then(res=>loginStatus(res.status,e))

}

/* Function runs on Window Load */

window.onload=()=>{
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
		if(val.result){

			location.href=`/dashboard`
		}
	}
	verify()

}

/* Check the status of the previous Login Process */

const loginStatus =(status,btn)=>{
	error.style.display=!status ? "initial" :"none"
	if(status){
		btn.innerText="redirecting..."
		location.href=`/dashboard`

	}
	else{
		btn.innerText="try again"
	}
}
