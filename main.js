const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerConfig = require("./src/config/swagger.config");
const AllRouter = require("./src/app.routes");
const AllExceptionHandler = require("./src/common/exception/all-exception.handler");
const NotFoundHandler = require("./src/common/exception/not-found.handler");

dotenv.config();
async function main() {
  const app = express();
  port = process.env.PORT;
  require("./src/config/mongoose.config");
  require("./src/config/initRedis");
  app.use(cors({origin: true,exposedHeaders: true}));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(express.static("public"));
  app.get("/",(req,res)=>{
    res.status(200).json({
        message: "TaxiPay HomePage Test"
    })
  })
  swaggerConfig(app);
  app.use(AllRouter);
  AllExceptionHandler(app);
  NotFoundHandler(app);
  app.listen(port,()=>{
    console.log(`server on http://localhost:${port}`)
  })
}

main();
