const mongoose = require('mongoose')

const MONGO_URI = process.env.MONGO_URI || ''

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