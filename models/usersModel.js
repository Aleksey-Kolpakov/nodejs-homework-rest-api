const { model, Schema } = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
});

// Mongoose pre-save hook. Fires when run create and save methods.
// In case of using this keyword, don't use arrow functions as callback!!
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    // Passwords auto-hashing
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
    next();
  });
  
  // Mongoose custom method
  userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = model("User", userSchema);
module.exports = User;
