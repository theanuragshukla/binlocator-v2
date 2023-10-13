require("dotenv").config();
const port = process.env.PORT || 3000;
const db = require("./config/database");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;
const cookieParser = require("cookie-parser");

app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookieParser());

const generateUid = () => {
    var pass = "";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (i = 1; i <= 16; i++) {
        var char = Math.floor(Math.random() * str.length + 1);
        pass += str.charAt(char);
    }
    return pass;
};

const verifyToken = async (authToken) => {
    try {
        const payload = jwt.verify(authToken, secret);
        const query = `SELECT * FROM users WHERE uid = $1;`;
        const values = [payload.data];
        const { rows } = await db.query(query, values);
        if (rows.length == 0) {
            return { status: false };
        } else {
            return { status: true, data: rows[0], uid: payload.data };
        }
    } catch (e) {
        return { status: false };
    }
};

app.post("/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const emailquery = `
	SELECT * FROM users WHERE email = $1;
	`;
    const emailvalues = [email];
    const dupEmail = await db.query(emailquery, emailvalues);
    if (dupEmail.rows.length != 0) {
        res.json({ status: false, email: true, msg: "email exists" });
        return;
    }
    const query = `
	INSERT INTO users (name,email,pass,uid)
	VALUES($1,$2,$3,$4)
	RETURNING *;
	`;
    const passhash = await bcrypt.hash(password, saltRounds);
    const uid = generateUid();
    const values = [`${firstName} ${lastName}`, email, passhash, uid];
    const { rows } = await db.query(query, values);
    const token = jwt.sign({ data: uid }, secret, { expiresIn: "7d" });
    const expiryDate = new Date(Number(new Date()) + 7 * 24 * 3600000);
    res.setHeader(
        "Set-Cookie",
        `token=${token};expires=${expiryDate}; Path=/;HttpOnly`
    );
    res.status(200).json({ status: true, token: token, msg: "Signup Success" });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const query = `
	SELECT * FROM users WHERE email = $1;
	`;
    const values = [email];
    const { rows } = await db.query(query, values);
    if (rows.length == 0) {
        res.json({ status: false, msg: "wrong email or password" });
    } else {
        const match = await bcrypt.compare(password, rows[0].pass);
        if (match) {
            const token = jwt.sign(
                {
                    data: rows[0].uid,
                },
                secret,
                { expiresIn: "7d" }
            );
            var expiryDate = new Date(Number(new Date()) + 7 * 24 * 3600000);
            res.setHeader(
                "Set-Cookie",
                `token=${token};expires=${expiryDate}; Path=/;HttpOnly`
            );

            res.status(200).json({
                status: true,
                token: token,
                msg: "Login Success",
            });
        } else {
            res.json({ status: false, msg: "wrong email or password" });
        }
    }
});

app.get("/checkAuth", async (req, res) => {
    const token = req.cookies.token;
    const authData = await verifyToken(token);
    res.status(200).json({
        status: authData.status,
        data: authData.status
            ? {
                  name: authData.data.name,
                  email: authData.data.email,
              }
            : {},
    });
});

const server = http.listen(port, () => {
    console.log(`running on port ${port}`);
});
