"use strict";
const simple = require("./handlers/simple");
const configured = require("./handlers/configured");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fs = require("fs");
const path = require('path')

const logPath = path.resolve("../persisted-logs")

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.get("/", simple);
  app.get("/configured", configured(opts));

  app.post("/log.json", jsonParser, (req, res) => {
    const { name = `log at ${new Date().toUTCString()}`, content } = req.body;
    let filepath = `${logPath}/${name}.json`;
    let n = 1;
    while (fs.existsSync(filepath)) filepath = `${logPath}/${name} ${n++}.json`;

    fs.writeFile(filepath, JSON.stringify(content), {encoding:'utf-8'}, (err) => {
      console.error(err)
      if(err)
        res.sendStatus(500)
      else
        res.sendStatus(200)
    });
  });
};
