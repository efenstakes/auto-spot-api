import mongoose from 'mongoose'


// set mongoose promise
mongoose.Promise = Promise

// log on connect when it occurs
mongoose.connection.on('connection', (_)=> {
    console.log('connected to db')
})

// log error when it occurs
mongoose.connection.on('error', (_)=> {
    console.log('connected to db')
})

// allow debugging
mongoose.set('debug', true)

export const connectToDb = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, { autoIndex: false, })
        console.log('connected to db')
    } catch (e) {
        console.log('error connecting to db ', e)
    }
}
