import express from 'express'
import cors from 'cors'
import env from 'dotenv'

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

app.use(cors({origin: 'http://localhost:3000'}));


const port = process.env.PORT || 8001;
app.listen(port);
console.log('Server is running at port ' + port);