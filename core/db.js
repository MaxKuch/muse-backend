const mongoose = require('mongoose')

// const MONGO_URI = process.env.NODE_ENV == 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV
const MONGO_URI = process.env.MONGO_URI_PROD

mongoose.connect(MONGO_URI, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  },
  (e) => {
    if(e) {
        console.error(e)
        return
    }
    console.log('Database Connected')
  }
)