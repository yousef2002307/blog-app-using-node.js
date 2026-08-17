require('dotenv').config()

const express = require("express");


const logger = require("./app/Http/Middleware/logger");
const app = express();
const errMiddleware    = require("./app/Http/Middleware/errMiddleware");
const notFoundMiddleware = require("./app/Http/Middleware/notFoundMiddleware");
const verifyJWT = require("./app/Http/Middleware/VerifyJwt");
const prisma = require("./prisma/client");
const cookieParser = require("cookie-parser");
app.use(cookieParser()); 
app.use(express.json())
// app.use("/",require("./routes/tes"))

app.use("/api",require("./routes/api/Auth"))
app.use("/api",require("./routes/api/post"))
// app.use(verifyJWT)
// app.get("/tt",(req,res)=>{
//   res.json({message:"tt"})
// })

app.use(notFoundMiddleware);

app.use(errMiddleware);


app.listen(3000, () => {
    logger.success("Server is running on port 3000");
})

