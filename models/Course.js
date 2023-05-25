const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: String,
    number: String,
    hours: String,
    level: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
    },
    Student: [
      {
        type: Schema.Types.ObjectId,
        ref: "student",
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Course = mongoose.model("course", CourseSchema);

module.exports = Course;
