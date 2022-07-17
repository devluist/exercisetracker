const express = require('express')
const controllers = express.Router()

let UserModel = require('./database/userModel');
let ExerciseModel = require('./database/exerciseModel');

/* ------- USER CONTROLLERS -------- */

controllers.post('/', async (req, res) => {
	try {
		const user = new UserModel({ username: req.body.username })
		await user.save()

		res.json(user)
	} catch (err) {
		res.json(err)
	}
})

controllers.get('/', async (req, res) => {
	try {
		const users = await UserModel.find({})

		res.json(users)
	} catch (err) {
		res.json(err)
	}
})


/* ------- EXERCISE CONTROLLERS -------- */

controllers.post('/:_id/exercises', async (req, res) => {
	let { description, duration, date } = req.body

	if(!date) {
		date = Date.now()
	}
	date = new Date(date)
	let dateStr = date.toDateString()

	const newExc = { description, date, duration: parseInt(duration) }

	try {
		const user = await UserModel.findOne({_id: req.params._id})
		newExc.username = user.username

		let exc = new ExerciseModel(newExc)
		exc = await exc.save()

		let response = {
			...newExc,
			_id: user._id,
			date: dateStr
		}

		res.json(response)
	} catch (err) {
		res.json(err)
	}
})

controllers.get('/:_id/logs', async (req, res) => {
	try {
		let {from, to, limit} = req.query

		if(from) {
			from = new Date(from)
		}
		if(to) {
			to = new Date(to)
		}

		const user = await UserModel.findOne({_id: req.params._id}).lean()
		let excs;

		if(from && !to){
			excs = await ExerciseModel.find({username: user.username})
				.gte("date", from)
				.limit(limit)
				.lean()
		}
		else if(!from && to){
			excs = await ExerciseModel.find({username: user.username})
				.lte("date", to)
				.limit(limit)
				.lean()
		}
		else if(from && to){
			excs = await ExerciseModel.find({username: user.username})
				.gte("date", from)
				.lte("date", to)
				.limit(limit)
				.lean()
		}
		else {
			excs = await ExerciseModel.find({username: user.username}).limit(limit).lean()
		}

		excs = excs.map(elm => {
			delete elm._id;
			delete elm.__v;

			elm.date = elm.date.toDateString();

			return elm
		})

		user.count = excs.length;
		user.log = excs;

		res.json(user)
	} catch (err) {
		res.json(err)
	}
})

module.exports = controllers
