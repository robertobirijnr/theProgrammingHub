const mongoose = require("mongoose");
const app = require("./app");
const { mongoDbConnector } = require("./config/db");

mongoose
  .connect(mongoDbConnector, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
