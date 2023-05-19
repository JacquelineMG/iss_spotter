const request = require('request');

// retrieves IP address from ipify.org
const fetchMyIP = function(callback) {
  const url = "https://api.ipify.org?format=json";
  request(url, (error, response, body) => {
    if (error) return callback(error, null);
      
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

// uses ip to retrieve coordinates from ipwho.is
const fetchCoordsByIP = function(ip, callback) {
  const url = `http://ipwho.is/${ip}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (parsedBody.success === false) {
      const msg = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(msg), null);
      return;
    }

    const lat = parsedBody.latitude;
    const lon = parsedBody.longitude;
    const coordinates = {
      latitude: String(lat),
      longitude: String(lon)
    };
    callback(null, coordinates);
  });
};

// uses coordinates to retrieve next ISS fly over times
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
 
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const resp = JSON.parse(body).response;
    callback(null, resp);
  });
};


// chains the above functions to return fly over times
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coordinates, (error, passTimes) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, passTimes);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };