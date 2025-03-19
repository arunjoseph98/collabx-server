const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true, required: true },
    content: { type: Buffer ,default: null}, 
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

documentSchema.pre("validate", async function (next) {
  if (!this.title) {
    let count = await mongoose.model("Document").countDocuments();
    let newTitle = `Document${count + 1}`;
    
    // Ensure title is unique by checking the database
    while (await mongoose.model("Document").exists({ title: newTitle })) {
      count++;
      newTitle = `Document${count + 1}`;
    }

    this.title = newTitle;
  }
  next();
});

module.exports = mongoose.model("Document", documentSchema);
