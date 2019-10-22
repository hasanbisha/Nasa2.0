const express = require("express");
const zipcodes = require("./resources/zipcodes.json");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());

const api_key = "A19C2C82-0336-41ED-ADBB-F48856690616";

app.get("/api/states", (req, res) => {
  const cities = zipcodes;
  let zip_codes = cities[req.query.state].cities;
  let new_zipcodes = {};
  Object.keys(zip_codes).map(city => {
    if (zip_codes[city].toString().includes("/")) {
      const codeRange = zip_codes[city].split("/");
      const numberRange = codeRange.map(num => {
        return parseInt(num);
      });
      new_zipcodes[city] = [];
      for (let i = numberRange[0]; i <= numberRange[1]; i++) {
        // console.log(i);
        new_zipcodes[city].push(i);
      }
    } else {
      new_zipcodes[city] = parseInt(zip_codes[city]);
    }
  });
  // res.send(cities[req.query.state]);
  res.send({ data: new_zipcodes });
});

app.get("/api/data/single", (req, res) => {
  const zip_code = req.query.zipcode;
  axios({
    method: "GET",
    url: `http://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zip_code}&distance=125&API_KEY=${api_key}`
  })
    .then(response => {
      res.send({ data: response.data });
    })
    .catch(error => {
      res.send({ message: error });
    });
});

// app.get("/api/data/multiple", async (req, res) => {
//   const zip_codes_str = req.query.zipcodes;
//   const zip_codes = JSON.parse(zip_codes_str);

//   let data = [];
//   zip_codes.map(zip_code => {
//     axios({
//       method: "GET",
//       url: `http://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zip_code.code}&distance=125&API_KEY=${api_key}`
//     }).then(response => {
//       data.push({ country: zip_code.city, data: response.data });
//       console.log(data);
//     });
//   });
//   if (data.length === 0) {
//     res.send({ message: "Could not get any data" });
//   } else {
//     res.send({ data });
//   }
// });

app.get("/api/data/single/historic", (req, res) => {
  const zip_code = req.query.zipcode;
  const starting_date = req.query.starting_date;

  // 2019-10-18 date format
  console.log(url);
  axios({
    method: "GET",
    url: `http://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zip_code}&date=${starting_date}&distance=125&API_KEY=${api_key}`
  })
    .then(response => {
      res.send({ data: response.data });
    })
    .catch(error => {
      res.send({ message: error });
    });
});

app.listen(5000, () => console.log("App started on port 5000"));
