const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 9000;

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.get("/data", (req, res) => {
  res.sendFile(path.join(`${__dirname}/data/data.json`));
});
app.get("/data/:id", (req, res) => {
  // console.log(req.params);
  try {
    const searchId = parseInt(req.params.id);
    // console.log(searchId);
    if (isNaN(searchId)) {
      res.status(418).send("not a number");
    } else {
      fs.readFile(`data/data.json`, (err, data) => {
        const fileData = JSON.parse(data);
        let result = null;
        // console.log(fileData);
        for (let i = 0; i < fileData.length; i++) {
          const element = fileData[i];
          if (element.id === searchId) {
            result = element.id;
          }
        }

        if (result === null) {
          res.status(404).send("nincs ilyen user wazze");
        } else {
          res.send(result);
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.send("elbenaztuk");
  }
});

app.use(`/public`, express.static(`${__dirname}/../frontend/public`));

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
