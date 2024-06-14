import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log('connected to mongodb')
    } catch (err) {
        console.log(err)
    }
}

export default connectDB