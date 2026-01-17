import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error:", err));

// User schema (same as your existing one)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { 
    type: String, 
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" 
  },
  role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function setupAdmin() {
  try {
    // Step 1: Add role field to all existing users
    console.log("Adding role field to existing users...");
    await User.updateMany(
      { role: { $exists: false } }, 
      { $set: { role: "user" } }
    );
    console.log("✅ Updated existing users with 'user' role");

    // Step 2: Create admin user
    const adminExists = await User.findOne({ email: "admin@realestate.com" });
    
    if (!adminExists) {
      const hashedPassword = bcryptjs.hashSync("admin123", 10);
      
      const adminUser = new User({
        username: "admin",
        email: "admin@realestate.com",
        password: hashedPassword,
        role: "admin"
      });

      await adminUser.save();
      console.log("✅ Admin user created successfully!");
      console.log("📧 Email: admin@realestate.com");
      console.log("🔑 Password: admin123");
    } else {
      console.log("⚠️ Admin user already exists");
    }

    console.log("🎉 Database setup completed!");
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error setting up admin:", error);
    process.exit(1);
  }
}

setupAdmin();