# literate-doodle
Node.js app that finds the closest reachable link station for a device, given it's distance and reach.

## Install
start by running 
```
npm install
```
in the root of the directory

## Usage
The app expects two parameters:

**-p** - device (point) coordinates, e.g. 15,10

**-f** - (optional) path to file with link station coordinates (in JSON format), defaults to [links-stations.json](https://github.com/mirkka/literate-doodle/blob/master/link-stations.json)

example: 
```
node main.js -p 100,100
```
or
```
node main.js -p 100,100 -f ./link-stations.json
