const express = require("express");
const mustacheExpress = require("mustache-express");
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
app.set("views", __dirname + "/views");

app.use(express.urlencoded({ extended: true }));

app.route("/predictions").get((req, res) => {
  const randomIndex = Math.floor(Math.random() * predictions.length);
  const prediction = predictions[randomIndex];
  res.render("", prediction);
});

app
  .route("/submit-prediction")
  .get((req, res) => {
    res.render("form");
  })
  .post((req, res) => {
    const { prediction } = req.body;
    const isValid = !containsProfanity(prediction);

    if (!prediction) {
      res.render("error", {
        error: "Invalid input. Please provide a prediction.",
      });
    } else if (isValid) {
      predictions.push(prediction);
      res.render("success", { message: "Prediction submitted successfully." });
    } else {
      res.render("error", { error: "Prediction contains profanity." });
    }
  });

app.listen(port, () => console.log(`Server is listening on port: ${port}`));
