const express=require('express');
const bodyparser=require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex=require('knex');


const database=knex({
	client: 'pg',
	connection: {
	host : '127.0.0.1',
	user : 'postgres',
	password : 'ak007',
	database : 'myapp1'
	}
});


const app=express();

app.use(bodyparser.json());
app.use(cors());


app.get('/',(req,res)=>{
	res.send(db.user);
})

app.post('/signin',(req,res)=>{
	const {email,password}=req.body;
	database
		.select('email','hash').from('login')
			.where('email','=',email)
				.then(data => {
					const isValid=bcrypt.compareSync(password, data[0].hash);
					console.log(isValid);
					if(isValid){
						return database('users')
							.select('*').where('email','=',email)
								.then(our_response => {
									res.json(our_response[0])
								})
								.catch(err => {
									res.status(400).json('jani na kiser error')
								})
					}
					else{
						res.status(400).json('wrong password buddy')
					}
				})
				.catch(err => {
					res.status(400).json('who the fuck are you')
				})
})

app.post('/register',(req,res)=>{
	const {name,email,password}=req.body;
	const hash = bcrypt.hashSync(password, 2);
	database.transaction(trx => {
		trx('login')
			.insert({
				hash:hash,
				email:email
			})
			.returning('email')
			.then(loginemail => {
				return trx('users')
					.returning('*')
					.insert({									
						name:name,
						email:loginemail[0],
						joined:new Date()		
					})
					.then(our_response => {
						res.json(our_response[0])
					})
			})
			.then(trx.commit)
			.catch(err => {
				trx.rollback
				res.json('sorry buddy, try again')
			})
	})
})

app.put('/:id',(req,res)=>{
	res.send('profile success');
})

app.get('/players',(req,res)=>{
	res.send('players success');
})

app.listen(process.env.PORT || 3002);