import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import morgan from 'morgan'

// to fix __dirname undefined after compiling
import * as url from 'url'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

import { connectToDb } from './services/database.js'


// create app
const app = express()


// middlewares

// get environment variables
dotenv.config({ path: path.join(__dirname, '.env')})

// serialize body
app.use(express.json())

// allow cross origin requests
app.use(cors())

// show dev logs
app.use(morgan('dev'))


// start database
connectToDb()


console.log("env", process.env.DB_URL)


// handle index endpoint
app.get("/", async(req, res)=> {

    res.json({
        status: "RUNNING",
        api: "Auto",
    })
})


export const server = app
