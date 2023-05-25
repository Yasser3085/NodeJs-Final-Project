const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema(
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

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
