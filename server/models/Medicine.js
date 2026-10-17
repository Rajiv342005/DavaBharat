import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    composition: { type: String, required: true },   // e.g. "Paracetamol 500mg"
    category: { type: String, required: true },      // e.g. "Pain Relief"
    manufacturer: { type: String, default: "DavaIndia" },
    packSize: { type: String },                      // e.g. "10 tablets"
    mrp: { type: Number, required: true },           // brand/market price
    price: { type: Number, required: true },         // our selling price
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    stock: { type: Number, default: 100 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Enables text search on name and composition
medicineSchema.index({ name: "text", composition: "text" });

export default mongoose.model("Medicine", medicineSchema);