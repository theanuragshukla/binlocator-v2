
/* Importing all the dependencies */

require('dotenv').config()
const port = process.env.PORT || 3000
const db = require("./config/database");
const express = require('express')
const fs = require('fs')
const app = express()
const http = require('http').Server(app)
const bcrypt = require("bcryptjs")
const saltRounds=10
const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET_KEY
const cookieParser=require('cookie-parser')

/* middlewares */

app.use('/static',express.static(__dirname + "/static"))
if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());


const resolveToken = async (req, res, next) => {
	const url = req.originalUrl.split("?")[0]
	if(1==2){
		next()
	}else{
		const token = req.cookies.token
		const authData = await verifyToken(token)
		if (!authData.result){
			if(req.method=="GET"){
				res.redirect(`http://${req.header('host')}/login`)
			} else{
				res.status(401).json({status:false,msg:"unauthorised access"})
			}
			return
		}
		else{
			req.usrProf = authData.data
			next()
		}
	}}


/* Signup Endpoint */

app.post("/add-new-user",async (req,res)=>{
	const emailquery = `
	SELECT * FROM users WHERE email = $1;
	`;
	const emailvalues = [req.body.email];
	const dupEmail = await db.query(emailquery, emailvalues);
	if( dupEmail.rows.length!=0){
		res.send({status:false,email:true,result:"email exists"})
		return
	}
	const query = `
	INSERT INTO users (name,email,pass,uid) 
	VALUES($1,$2,$3,$4)
	RETURNING *;
	`;
	var passhash
	await bcrypt.hash(req.body.pass, saltRounds).then(function(hash) {
		passhash=hash
	});
	const uid = generateUid();
	const values = [`${req.body.fname} ${req.body.lname}`,req.body.email,passhash,uid];
	const { rows } = await db.query(query, values)
	const token = jwt.sign({data:uid}, secret, { expiresIn: '7d' })
	const expiryDate = new Date(Number(new Date()) + (7*24*3600000));
	res.setHeader("Set-Cookie", `token=${token};expires=${expiryDate}; Path=/;HttpOnly`)
	res.status(200).json({"status":true, "token":token})
})

/* Login Endpoint */

app.post("/let-me-in",async (req,res)=>{
	const query = `
	SELECT * FROM users WHERE email = $1;
	`;
	const values = [req.body.email];
	const { rows } = await db.query(query, values);
	if(rows.length==0){
		res.send({status:false,result:"wrong email or password"})
	}else{
		const match = await bcrypt.compare(req.body.pass, rows[0].pass)
		if(match){
			const token = jwt.sign({
				data:rows[0].uid
			}, secret, { expiresIn: '7d' })
			var expiryDate = new Date(Number(new Date()) + (7*24*3600000));
			res.setHeader("Set-Cookie", `token=${token};expires=${expiryDate}; Path=/;HttpOnly`)

			res.status(200).json({"status":true, "token":token})
		}
		else{
			res.send({status:false,result:"wrong email or password"})
		}
	}
})



/* Express server stuff*/

app.get('/login',(req,res)=>{
	res.sendFile(__dirname+'/login.html')
})
app.get('/new-user',(req,res)=>{
	res.sendFile(__dirname+'/signup.html')
})
app.get('/', (req, res)=> {
	res.sendFile(__dirname+'/map.html')
})


app.get('/map', (req, res)=> {
	res.sendFile(__dirname+'/map.html')
})


app.get('/get-all-bins', async(req, res)=> {
	const query = `SELECT uid, loc FROM bins`;
	const bins = await db.query(query, []);
	res.status(200).json(bins.rows)

})

app.get('/get-bin-info', async (req, res)=> {
	const query = `SELECT * FROM bins where uid = $1`;
	const bins = await db.query(query, [req.query.uid]);
	const ret = {
		loc:bins.rows[0].loc,
		uid:req.query.uid
	}
	res.status(200).json(ret)

})

app.get('/getImage', (req, res)=> {
	res.sendFile(__dirname+'/binImages/'+req.query.uid)
})

app.use(resolveToken)

app.get('/addbin', (req, res)=>{
	res.status(200).sendFile(__dirname+'/addbin.html')
})

app.get('/dashboard',(req,res)=>{
	res.sendFile(__dirname+'/index.html')
})

app.post("/upload-new-bin",async (req,res)=>{
	const {loc, img} = req.body
	const query = `
	INSERT INTO bins (loc, uid, added_by) 
	VALUES($1,$2, $3)
	RETURNING *;
	`;
	const uid = generateUid()
	const values = [`(${loc.latitude},${loc.longitude})`, uid, req.usrProf.uid];
	const { rows } = await db.query(query, values)
	var base64Data = JSON.parse(img).replace(/^data:image\/jpeg;base64,/, "");
	const path = __dirname+'/binImages/'+uid+'.jpeg'
	fs.writeFile(path, base64Data, 'base64', function(err) {

});
	//const imgq = `insert into imgs(image, uid) VALUES($1, $2)`;
	//const imgv = [`bytea('${path}')`, uid]
	//const ret = await db.query(imgq, imgv)
	res.status(200).json({status:true})
})

/* Logout Endpoint */

app.get('/log-me-out',(req,res)=>{
	res.clearCookie("token")
	res.json({status:true})
})

/* Verifies that the current user is valid and logged in Successfully */

app.get('/checkAuth',async (req,res)=>{
	const token = req.cookies.token
	const authData = await verifyToken(token)
	res.status(200).json({result:authData.result,data:
		authData.result ? 
		{
			name:authData.data.name,
			email:authData.data.email
		}
		:{}
	})
})

/* Check duplicate entries during Signup Process and tells Users that email/user exists */

app.post('/checkDup', async (req,res)=>{
	const toCheck=req.body.email ? "email" : "username"
	const query = `SELECT * FROM users WHERE ${toCheck} = $1;`;
	const value = [req.body.data];
	const dups = await db.query(query, value);
	if( dups.rows.length!=0){
		res.status(200).send({status:false})
		return
	}else 
		res.status(200).send({status:true})
})
/* Endpoint to delete the User account */

app.post('/delete-account',async(req,res)=>{
	const email = req.body.email
	const query = `DELETE FROM users WHERE email = $1;`
	const value = [email] 
	const {rows} = await db.query(query, value)
	if(rows.length>=0){
		res.json({result:true})
	}else{
		res.json({result:false})
	}

})

const server = http.listen(port,()=>{
	console.log(`running on port ${port}`)
})


/* utils */

/* Generate an 16 characters Unique UID */

const generateUid =()=> {
	var pass = '';
	var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (i = 1; i <= 16; i++) {
		var char = Math.floor(Math.random()
				* str.length + 1);
		pass += str.charAt(char)
	}
	return pass;
}

/* verify the Integrity and AuthStatus of a User */

const verifyToken = async (authToken)=>{
	try{
		const payload = jwt.verify(authToken, secret)
		const query = `SELECT * FROM users WHERE uid = $1;`;
		const values = [payload.data];
		const { rows } = await db.query(query, values)
		if(rows.length==0){
			return {result:false}
		}else{
			return {result:true,data:rows[0],uid:payload.data}
		}
	}catch(e){
		return {result:false}
	}
}
	/* Returns the Current Timestamp in a format */

	const getTimeStamp =() => {
		const now = new Date()
		return ((now.getDate()) + '/' +
			(now.getMonth()+1) + '/' +
			now.getFullYear() + " " +
			now.getHours() + ':' +
			((now.getMinutes() < 10)
				? ("0" + now.getMinutes())
				: (now.getMinutes())) + ':' +
			((now.getSeconds() < 10)
				? ("0" + now.getSeconds())
				: (now.getSeconds())))
	}
function dataURItoBlob(dataURI) {
    var byteStr;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteStr = atob(dataURI.split(',')[1]);
    else
        byteStr = unescape(dataURI.split(',')[1]);

    var mimeStr = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var arr= new Uint8Array(byteStr.length);
    for (var i = 0; i < byteStr.length; i++) {
        arr[i] = byteStr.charCodeAt(i);
    }

    return new Blob([arr], {type:mimeStr});
}
