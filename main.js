const cli = require('cli');

const params = cli.parse({
    file: [ 'f', 'A list of link stations', 'string', './link-stations.json' ],
    point: [ 'p', 'Device coordinates (e.g. 10,15)', 'string', '0,0'],
});

const parseDeviceCoords = point => {
	const coords = point.split(',');
	return {
		x: parseInt(coords[0], 10),
		y: parseInt(coords[1], 10)
	}
};

const pythagorean = (sideA, sideB) => {
	return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
};

const parseLinkStationParameters = linkStation => {
	return {
		x: linkStation[0],
		y: linkStation[1],
		reach: linkStation[2]
	};
};

const getSide = (linkCoord, deviceCoord) => {
	return Math.abs(linkCoord - deviceCoord);
};

const getLinkStationsPowers = (linkStations, device) => {
	if (!linkStations || !device) return;

	return linkStations.map(station => {
		const parsedLinkStation = parseLinkStationParameters(station);

		const sideA = getSide(parsedLinkStation.x, device.x);
		const sideB = getSide(parsedLinkStation.y, device.y);

		const distance = pythagorean(sideA, sideB);
		const power = Math.max(0, parsedLinkStation.reach - distance);

		return {
			x: parsedLinkStation.x,
			y: parsedLinkStation.y,
			power: power
		}
	});
};

const sortLinkStationsByPower = linkStationsWithPower => {
	const linkStationsWithPowerCopy = [...linkStationsWithPower];
	return linkStationsWithPowerCopy.sort((a, b) => {
    	return b.power - a.power;
	});
};

const printResult = (linkStations, device) => {
	const linkStationsWithPowers = getLinkStationsPowers(linkStations, device);
	const sortedLinkStations = sortLinkStationsByPower(linkStationsWithPowers);
	const stationsInReach = sortedLinkStations.filter(station => station.power > 0);

	if(stationsInReach.length > 0) {
		const station = sortedLinkStations[0];
		console.log(`Best link station for point ${device.x},${device.y} is ${station.x},${station.y} with power ${station.power}`);
	} else {
		console.log(`No link station within reach for point ${device.x},${device.y}`);
	}
};

const linkStations = require(params.file);
const device = parseDeviceCoords(params.point);

printResult(linkStations, device);
