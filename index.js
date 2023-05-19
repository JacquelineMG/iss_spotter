const { nextISSTimesForMyLocation } = require('./iss');

// console logs ISS fly over times in an easily readable format
const printPassTimes = function(passTimes) {
  for (const p of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(p.risetime);
    const duration = p.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

// calls function chain from iss.js and uses printPassTimes function to print times
nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});

module.exports = { printPassTimes };



// Additional test functions:

/*
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  return ip;
});

const myIP = "70.66.168.54";

fetchCoordsByIP(myIP, (error, coordinates) => {
  console.log("Error Output:", error);
  console.log("Data Output:", coordinates);
});

const myCoords = { latitude: '48.435842', longitude: '-123.4112341' };

fetchISSFlyOverTimes(myCoords, (error, response) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
  console.log("It worked!", response);
});
*/



