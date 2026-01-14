import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import twilio from "twilio";
import fs from "fs";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ dest: 'uploads/' });
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const uploadFields = upload.fields([
    { name: 'mockup', maxCount: 1 }, 
    { name: 'logo', maxCount: 1 }
]);

router.post("/send-whatsapp", uploadFields, async (req, res) => {
  const uploadedPaths = []; 

  try {
    const files = req.files;
    // Extract text fields sent via FormData
    const { customerName, customerPhone } = req.body; 

    if (!files || !files.mockup) {
        return res.status(400).json({ success: false, message: 'Mockup image is missing.' });
    }

    // 1. Upload Mockup
    const mockupPath = files.mockup[0].path;
    uploadedPaths.push(mockupPath);
    const mockupResult = await cloudinary.uploader.upload(mockupPath, { folder: "tshirt_orders" });

    // 2. Upload Logo (if exists)
    let logoUrl = null;
    if (files.logo) {
        const logoPath = files.logo[0].path;
        uploadedPaths.push(logoPath);
        const logoResult = await cloudinary.uploader.upload(logoPath, { folder: "tshirt_orders" });
        logoUrl = logoResult.secure_url;
    }

    // 3. Send WhatsApp (Mockup + Details)
    await client.messages.create({
      body: `🎨 *New T-Shirt Design Order*\n\n👤 *Customer:* ${customerName || "Guest"}\n📱 *Phone:* ${customerPhone}\n\nHere is the T-Shirt Preview:`,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:+${process.env.ADMIN_WHATSAPP_NUMBER}`, 
      mediaUrl: [mockupResult.secure_url]
    });

    // 4. Send Logo separately (if exists)
    if (logoUrl) {
        await client.messages.create({
            body: `📂 *Original Logo File* (For Printing)`,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:+${process.env.ADMIN_WHATSAPP_NUMBER}`, 
            mediaUrl: [logoUrl]
        });
    }

    uploadedPaths.forEach(path => { if (fs.existsSync(path)) fs.unlinkSync(path); });
    res.status(200).json({ success: true, message: 'Order sent!' });

  } catch (error) {
    console.error("WhatsApp Error:", error);
    uploadedPaths.forEach(path => { if (fs.existsSync(path)) fs.unlinkSync(path); });
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;