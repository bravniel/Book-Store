const mongoose = require("mongoose")

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((con) => {
  console.log('-> mongoose has been connected successfully to mongodb database.')
  })
  .catch((err) => {
    console.log(`-> mongoose error conection: ${err}.`)
  })