import "dotenv/config";
import mongoose from "mongoose";
import Medicine from "../models/Medicine.js";

// [name, composition, category, packSize, mrp, discount%]
const data = [
  // Pain Relief
  ["Paracetamol Tablets IP 500mg", "Paracetamol 500mg", "Pain Relief", "15 tablets", 30, 60],
  ["Ibuprofen Tablets 400mg", "Ibuprofen 400mg", "Pain Relief", "15 tablets", 45, 60],
  ["Aceclofenac + Paracetamol Tablets", "Aceclofenac 100mg + Paracetamol 325mg", "Pain Relief", "10 tablets", 120, 65],
  ["Diclofenac Gel", "Diclofenac Diethylamine 1.16% w/w", "Pain Relief", "30 g tube", 110, 55],
  ["Pain Relief Spray", "Methyl Salicylate + Menthol", "Pain Relief", "55 g can", 190, 50],

  // Diabetes
  ["Metformin Tablets IP 500mg", "Metformin Hydrochloride 500mg", "Diabetes", "20 tablets", 40, 70],
  ["Glimepiride Tablets 1mg", "Glimepiride 1mg", "Diabetes", "10 tablets", 85, 70],
  ["Glimepiride + Metformin Tablets", "Glimepiride 1mg + Metformin 500mg", "Diabetes", "10 tablets", 110, 70],
  ["Sitagliptin Tablets 50mg", "Sitagliptin 50mg", "Diabetes", "10 tablets", 350, 75],
  ["Vildagliptin Tablets 50mg", "Vildagliptin 50mg", "Diabetes", "10 tablets", 280, 75],

  // Heart Care
  ["Atorvastatin Tablets 10mg", "Atorvastatin 10mg", "Heart Care", "15 tablets", 140, 70],
  ["Amlodipine Tablets 5mg", "Amlodipine 5mg", "Heart Care", "15 tablets", 60, 65],
  ["Telmisartan Tablets 40mg", "Telmisartan 40mg", "Heart Care", "15 tablets", 150, 70],
  ["Rosuvastatin Tablets 10mg", "Rosuvastatin 10mg", "Heart Care", "10 tablets", 210, 70],
  ["Aspirin Gastro-resistant Tablets 75mg", "Aspirin 75mg", "Heart Care", "14 tablets", 12, 40],

  // Digestive Care
  ["Pantoprazole Tablets 40mg", "Pantoprazole 40mg", "Digestive Care", "15 tablets", 150, 70],
  ["Omeprazole Capsules 20mg", "Omeprazole 20mg", "Digestive Care", "15 capsules", 75, 65],
  ["Domperidone Tablets 10mg", "Domperidone 10mg", "Digestive Care", "10 tablets", 50, 60],
  ["ORS Powder", "Oral Rehydration Salts IP", "Digestive Care", "21.8 g sachet", 25, 40],
  ["Antacid Suspension", "Aluminium Hydroxide + Magnesium Hydroxide", "Digestive Care", "170 ml bottle", 95, 55],

  // Cold & Allergy
  ["Cetirizine Tablets 10mg", "Cetirizine 10mg", "Cold & Allergy", "10 tablets", 25, 60],
  ["Levocetirizine Tablets 5mg", "Levocetirizine 5mg", "Cold & Allergy", "10 tablets", 70, 65],
  ["Montelukast + Levocetirizine Tablets", "Montelukast 10mg + Levocetirizine 5mg", "Cold & Allergy", "10 tablets", 220, 70],
  ["Ambroxol Syrup", "Ambroxol 15mg/5ml", "Cold & Allergy", "100 ml bottle", 85, 55],
  ["Dry Cough Syrup", "Dextromethorphan 10mg/5ml", "Cold & Allergy", "100 ml bottle", 90, 55],

  // Vitamins & Supplements
  ["Vitamin D3 Capsules 60000 IU", "Cholecalciferol 60000 IU", "Vitamins & Supplements", "4 capsules", 130, 60],
  ["Vitamin B-Complex Tablets", "Vitamin B1, B2, B3, B6, B12", "Vitamins & Supplements", "15 tablets", 45, 50],
  ["Multivitamin & Multimineral Tablets", "Multivitamins + Minerals", "Vitamins & Supplements", "15 tablets", 160, 55],
  ["Calcium + D3 Tablets", "Calcium 500mg + Vitamin D3 250 IU", "Vitamins & Supplements", "15 tablets", 120, 60],
  ["Vitamin C Chewable Tablets 500mg", "Ascorbic Acid 500mg", "Vitamins & Supplements", "15 tablets", 40, 50],

  // Skin Care
  ["Clotrimazole Cream 1%", "Clotrimazole 1% w/w", "Skin Care", "15 g tube", 75, 55],
  ["Povidone Iodine Ointment 5%", "Povidone Iodine 5% w/w", "Skin Care", "15 g tube", 60, 50],
  ["Calamine Lotion", "Calamine 8% + Zinc Oxide 8%", "Skin Care", "100 ml bottle", 85, 45],
  ["Moisturising Lotion", "Liquid Paraffin + Glycerin", "Skin Care", "200 ml bottle", 220, 50],
  ["Sunscreen Gel SPF 50", "Avobenzone + Octinoxate", "Skin Care", "50 g tube", 350, 45],

  // Health Devices
  ["Digital Thermometer", "Medical device", "Health Devices", "1 unit", 250, 50],
  ["Pulse Oximeter", "Medical device", "Health Devices", "1 unit", 1200, 50],
  ["Blood Glucose Monitor", "Medical device", "Health Devices", "1 kit", 1100, 45],
  ["Digital BP Monitor", "Medical device", "Health Devices", "1 unit", 1800, 45],
  ["Hand Sanitizer 500ml", "Isopropyl Alcohol 70%", "Health Devices", "500 ml bottle", 220, 40],
];

const medicines = data.map(([name, composition, category, packSize, mrp, discount], i) => ({
  name,
  composition,
  category,
  packSize,
  mrp,
  price: Math.round(mrp * (1 - discount / 100)),
  description: `${name} (${composition}). Pack size: ${packSize}.`,
  featured: i % 5 === 0,
}));

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Medicine.deleteMany();
    await Medicine.insertMany(medicines);
    console.log(`Seeded ${medicines.length} medicines`);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seed();