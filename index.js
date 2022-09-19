const express = require("express");

const { connection } = require("./Config/db");
const { UserModel } = require("./Model/User.model");
const app = express();
var jwt = require('jsonwebtoken');


app.use(express.json());

app.get("/", (req, res) => {
	res.send("homepage");
});

app.post("/signup", async (req, res) => {
	console.log(req.body);
	const user = new UserModel(req.body);
	await user.save();
	res.send("signup successfull");
});

app.post("/login", async (req, res) => {
	const isValid = await UserModel.findOne(req.body);
	console.log(isValid);
	if (isValid) {
        var token = jwt.sign({ foo: 'bar' }, 'secret');
		res.send({"msg":"Login successfull","token":token});
	} else {
		res.send("Login failed,invalid Credential");
	}
});
app.get("/dashboard",(req,res)=>{
    console.log(req.headers.authorization)
    const token=req.headers.authorization.split(" ")[1 ]
    jwt.verify(token,'secret',function(err,decoded){
    if(err){
    res.send("Please login") 
    }
    else{
        res.send("Dashboard important data")
    }
});
})
app.listen(8080, async () => {
	try {
		await connection;
		console.log("connected to db successfull");
	} catch (err) {
		console.log("error connecting to db");
		console.log(err);
	}
	console.log("listening on 8080");
});
