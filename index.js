const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParse = require("body-parser");
const Filter = require("bad-words");

const app = express();
const port = 3000;

const filter = new Filter();
function containsProfanity(str) {
  return filter.isProfane(str);
}

const predictions = [
  "A surprising opportunity will knock on your door. Say yes.",
  "A long-lost connection will re-enter your life, bringing with it a wave of nostalgia and valuable lessons.",
  "Take a leap of faith in pursuing your dreams. The universe is aligning in your favor.",
  "Your creativity will soar to new heights.",
];

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", "./views");

app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json({ extended: true }));
app.use(express.static("public"));

app.route("/").get((req, res) => {
  res.render("home.mustache");
});

app.route("/prediction").get((req, res) => {
  const randomIndex = Math.floor(Math.random() * predictions.length);
  const prediction = predictions[randomIndex];
  res.render("prediction.mustache", { prediction: prediction });
});

app.route("/download").get((req, res) => {
  res.download("./public/fortune-teller.png");
});

app
  .route("/submit-prediction")
  .get((req, res) => {
    res.render("form.mustache");
  })
  .post((req, res) => {
    const { prediction } = req.body;
    const isValid = !containsProfanity(prediction);

    if (!prediction) {
      res.render("form.mustache", {
        alert: "Invalid input. Please provide a prediction.",
      });
    } else if (isValid) {
      predictions.push(prediction);
      res.render("form.mustache", {
        alert: "Prediction submitted successfully. Want to submit another?",
      });
    } else {
      res.render("form.mustache", {
        alert: "Invalid input. Predictions cannot contain profanity.",
      });
    }
  });

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
