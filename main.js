const cli = require('cli');

const params = cli.parse({
    file: [ 'f', 'A list of link stations', 'string', './link-stations.json' ],
    point: [ 'p', 'Device coordinates (e.g. 10,15)', 'string', '0,0'],
});

const parseDeviceCoords = point => {
	const [ x, y ] = point.split(',');
	return {
		x: parseInt(x, 10),
		y: parseInt(y, 10)
	}
};

const pythagorean = (sideA, sideB) => {
	return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
};

const getSide = (linkCoord, deviceCoord) => {
	return Math.abs(linkCoord - deviceCoord);
};

const getLinkStationsPowers = (linkStations, device) => {
	return linkStations.map(station => {
		const [ x, y, reach ] = station;

		const sideA = getSide(x, device.x);
		const sideB = getSide(y, device.y);

		const distance = pythagorean(sideA, sideB);
		const power = Math.max(0, reach - distance);

		return { x, y, power };
	});
};

const sortLinkStationsByPower = linkStationsWithPower => {
	//spread the original array so it doesn't get mutated by sort
	const linkStationsWithPowerCopy = [...linkStationsWithPower];
	return linkStationsWithPowerCopy.sort((a, b) => b.power - a.power);
};

const printResult = (linkStations, device) => {
	if (!linkStations || !device) return;
	const linkStationsWithPowers = getLinkStationsPowers(linkStations, device);
	const sortedLinkStations = sortLinkStationsByPower(linkStationsWithPowers);
	const stationsInReach = sortedLinkStations.filter(station => station.power > 0);

	if(stationsInReach.length > 0) {
		// after the sort, the first item in array is the one with most power
		const station = sortedLinkStations[0];
		console.log(`Best link station for point ${device.x},${device.y} is ${station.x},${station.y} with power ${station.power}`);
	} else {
		console.log(`No link station within reach for point ${device.x},${device.y}`);
	}
};

let linkStations;
const device = parseDeviceCoords(params.point);

try {
	linkStations = require(params.file);
} catch (err) {
	console.log(`Failed to parse file ${params.file}`);
	return;
}

printResult(linkStations, device);
