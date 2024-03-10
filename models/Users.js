const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
      username: {
        type: String,
        unique: true,
        required: true,
        trimmed: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: "Invalid email address format",
        },
      },
      thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: "thought",
        },
      ],
      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
      ],
    },
  );
  
  const Users = model("user", userSchema);
  
  module.exports = Users;