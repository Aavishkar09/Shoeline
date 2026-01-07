const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

//Database Connection with MongoDB
mongoose.connect(process.env.MONGO_URL);

//Schema creation for admin model
const Admin = mongoose.model('Admin',{
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
})

//Seed admin user
const seedAdmin = async () => {
    try {
        const existingAdmin = await Admin.findOne({email: "admin@yopmail.com"});
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("ShoeLine@9994", 10);
            const admin = new Admin({
                name: "Admin",
                email: "admin@yopmail.com",
                password: hashedPassword
            });
            await admin.save();
            console.log("✅ Admin user seeded successfully");
            console.log("Email: admin@yopmail.com");
            console.log("Password: ShoeLine@9994");
        } else {
            console.log("❌ Admin user already exists");
        }
    } catch (error) {
        console.error("Error seeding admin:", error);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed");
    }
}

//Run seed function
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    seedAdmin();
});