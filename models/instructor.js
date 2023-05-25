const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InstructorSchema = new Schema(
  {
    name: String,
    id: String,
    password: String,
    course: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Instructor = mongoose.model("instructor", InstructorSchema);

module.exports = Instructor;
