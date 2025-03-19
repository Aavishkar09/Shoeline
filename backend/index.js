const port = 4000;
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

//Database Connection with MongoDB
mongoose.connect(process.env.MONGO_URL);

//API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

const storage = multer.memoryStorage();
const upload = multer({ storage });


const uploadImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: "No image uploaded!" });
    }

    console.log("File received, uploading to Cloudinary...");

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "ShoelineProducts" }, // Specify your desired folder in Cloudinary
        (error, result) => {
            if (error) {
                console.error("Error uploading to Cloudinary:", error);
                return res.status(500).json({ message: "Image upload failed!", error });
            }
            console.log("Cloudinary Upload Success:", result.secure_url);
            req.imageUrl = result.secure_url; // Store the uploaded URL for further use
            next();
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

app.post("/upload", upload.single('product'), uploadImage, (req, res) => {
    res.json({
        success: 1,
        image_url: req.imageUrl
    });
});

//Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    new_price:{
        type: String,
        required: true,
    },
    old_price:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    available:{
        type: Boolean,
        default: true,
    }
})

app.post('/addproduct', async (req, res) => {
    console.log("Received Data:", req.body);
    let products = await Product.find({});
    let id = products.length > 0 ? products.slice(-1)[0].id + 1 : 1;

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,  // Cloudinary image URL
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    await product.save()
        .then(() => {
            console.log("Saved");
            res.json({ success: true, name: req.body.name });
        })
        .catch((err) => {
            console.error("Error saving product:", err);  // Log exact error
            res.status(400).json({ success: false, error: err.message });
        });
});



//Creating API for Deleting Products

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name,
    })
})


//Creating API for getting all products
app.get('/allproducts',async (req,res) =>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})


//Schema creation for user model
const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})  

//Creating endpoint for registering user
app.post('/signup',async (req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same email-id"})
    }

    let cart = {};
    for(let i=0;i<300;i++){
        cart[i] = 0;
    }

    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = {
        user:{
            id:user.id,
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//Creating Endpoints for user Login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            } 
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});    
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email-id"})
    }
})

//creating endpoint for newcollection data
app.get('/newcollection',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.send(newcollection);
})

//creating endpoint in mwn category
app.get('/popularinmen',async(req,res)=>{
    let products = await Product.find({category:"men"});
    let popular_in_men = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_men);
})

//creating middleware to fetch user
const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please autehnticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        }catch(error){
            res.status(401).send({errors:"Please authenticate usig a valid token "})
        }
    }
}

//creating endpoint for adding endpoint in cartdata
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
})

//creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added");
})

//creating endpoint to get cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server Running on port: "+port);
    }
    else{
        console.log("Error: "+error);
    }
})