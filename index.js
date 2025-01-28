var ical2json = require("ical2json");
const http = require('http');

const icalURL = "https://calendar.google.com/calendar/ical/opensource%40oxy.edu/public/basic.ics";

let currentData;
let lastUpdate = 0;

async function getIcalData() {
  await fetch(icalURL)
    .then(response => response.text())
    .then(data => {
      currentData = ical2json.convert(data);
    });
}

async function request() {
    if (Date.now() - lastUpdate > 1000 * 60 * 5) {
        console.log("Fetching new data");
        await getIcalData();
        lastUpdate = Date.now();
    } else {
        console.log("Using cached data");
    }
}

const server = http.createServer((req, res) => {
    request().then(() => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify(currentData));
    });
  });


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});