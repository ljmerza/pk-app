const express = require('express');
const request = require('request');
const querystring = require('querystring');

const router = express.Router();



const base_url = 'https://chapelhill.monsterhunt.info/raw_data?';

const params = {
	pokemon: false,
	pokestops: false,
	luredonly: false,
	scanned: false,
	spawnpoints: false,

	swLat: 35.784409064968216,
	swLng: -79.36981615051269,
	neLat: 36.04078129794946,
	neLng: -78.71063646301269,

	reids: '',
	eids: '10,13,16,19,21,23,41,46,48,54,79,98,102,116,118,161,163,165,167,177,187,194,198,223'
}

const headers = {
	'Host': 'chapelhill.monsterhunt.info',
	'Accept': 'application/json, text/javascript, */*; q=0.01',
	'Referer': 'https://chapelhill.monsterhunt.info/',
	'Connection': 'keep-alive'
}





router.get('/pogo/:type', function(req, res, next) {
	// copy object
	let params_copy = Object.assign({}, params);
	const get_type = req.params.type;

	// assign params
	params_copy[get_type == 'gyms' ? get_type : 'pokemon'] = true;
	params_copy._ = (new Date()).getTime();

	// create request options
	const options = {
		url: base_url + querystring.stringify(params_copy),
		headers: headers
	};

	// make request and send back
	request(options, function (error, response, body) {
		console.log(error)
		if(error) { next(error); }
		res.end(body);
	});
});

module.exports = router;
