import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoute from "./routes/user.routes.js"
import gigRoute from "./routes/gig.route.js"
import orderRoutes from "./routes/order.route.js"
import conversationRoute from "./routes/conversation.route.js"
import messageRoute from "./routes/message.route.js"
import reviewRoute from "./routes/review.route.js"
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
dotenv.config()


app.use(
  cors({
    origin: ["https://fiver-app-6xat.vercel.app"], // frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })

);
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const connect = async () =>{
    try{
        await mongoose.connect(process.env.MONGO)
        console.log("connected to mongoDb");
        
    }catch(error){
        console.log(error);
        
    }
}
connect();

app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/gigs",gigRoute)
app.use("/api/reviews",reviewRoute)
app.use("/api/orders",orderRoutes)
app.use("/api/conversations",conversationRoute)
app.use("/api/messages",messageRoute)

app.use((err, req, res, next)=>{
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"

    return res.status(errorStatus).send(errorMessage);
})



// if (process.env.NODE_ENV !== 'production') {
//     const port = process.env.PORT || 8000;
//     app.listen(port, () => {
//         console.log(`Server is running on port ${port}`);
//     });
// }

export default app;