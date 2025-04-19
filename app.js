if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
const express= require('express');
const app = express();
const mongoose = require('mongoose');
const path= require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session= require("express-session");
const MongoStore=require("connect-mongo");
const flash= require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const dbUrL =process.env.ATLASDB_URL;

main()
.then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrL);
}

app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.json()); // in case you need to handle JSON data in the future
app.use(methodOverride('_method'));

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.engine('ejs',ejsmate);

const store= MongoStore.create({
    mongoUrl:dbUrL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{ 
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpPnly:true,
    }
};
store.on("error",()=>{
    console.log("ERROR IN MONGO SWSSION STORE",err);
});
app.get("/",(req,res)=>{
    res.send("connection successfull");
});
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*",(req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message = "something went wrong"}=err;
res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
}); 

app.listen(8080,()=>{
    console.log("server live");
})