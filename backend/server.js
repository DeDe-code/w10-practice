const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 9000;

app.use(fileUpload());

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
      fs.readFile(`${__dirname}/data/data.json`, (err, data) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          const fileData = JSON.parse(data);
          let result = null;
          // console.log(fileData);
          for (let i = 0; i < fileData.length; i++) {
            const element = fileData[i];
            if (element.id === searchId) {
              result = element;
            }
          }

          if (result === null) {
            res.status(404).send("nincs ilyen user wazze");
          } else {
            res.send(result);
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.send("elbenaztuk");
  }
});

app.use(`/public`, express.static(`${__dirname}/../frontend/public`));

// default options

app.post("/upload", (req, res) => {
  let uploadedFile;
  let savePath;
  let imageName;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  uploadedFile = req.files.image;
  imageName = req.body.name;
  savePath = `${__dirname}/../frontend/public/${imageName}.jpg`;

  // Use the mv() method to place the file somewhere on your server
  uploadedFile.mv(savePath, (err) => {
    if (err) return res.status(500).send(err);

    res.json(imageName); //imgName = "pelda"
  });
});

app.listen(port, () => {
  console.log(`http://127.0.0.1:${port}`);
});
