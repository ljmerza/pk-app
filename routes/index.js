const express = require('express');
const router = express.Router();
const request = require('request');
const querystring = require('querystring');

const base_url = 'https://chapelhill.monsterhunt.info/raw_data?';
const params = {
	pokemon: false,
	pokestops: false,
	luredonly: false,
	gyms: false,
	scanned: false,
	spawnpoints: false,
	lastgyms: false,

	swLat: 35.784409064968216,
	swLng: -79.36981615051269,
	neLat: 36.04078129794946,
	neLng: -78.71063646301269,
	oSwLat: 35.792485482365514,
	oSwLng: -79.35848649963378,
	oNeLat: 36.04883158326668,
	oNeLng: -78.69930681213378,

	reids: '',
	eids: '',
	timestamp: new Date().getTime(),
	_: (new Date().getTime())
}

let options = {};



router.get('/raids', function(req, res, next) {

	params.gyms= true;
	params.lastgyms= true;
	options.url = base_url + querystring.stringify(params);

	request(options, function (error, response, body) {
		if(error) { next(error); }
		res.end(body);
	});

});



router.get('/pokemon', function(req, res, next) {

	params.pokemon= true;
	params.lastpokemon= true;
	options.url = base_url + querystring.stringify(params);

	request(options, function (error, response, body) {
		if(error) { next(error); }
		res.end(body);
	});

});

module.exports = router;
