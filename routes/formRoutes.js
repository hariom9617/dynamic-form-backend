const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Form = require("../models/FormModel");

const router = express.Router();

// ✅ Set up Multer to use Cloudinary storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/submit", upload.single("resume"), async (req, res) => {
  try {
    let resumeUrl = "";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "resumes" },
        async (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ error: "Cloudinary upload failed" });
          }

          resumeUrl = result.secure_url;

          // Save to MongoDB
          const formData = new Form({
            ...req.body,
            resume: resumeUrl, // Save Cloudinary URL instead of local path
          });

          await formData.save();
          res.status(201).json({ message: "Form submitted successfully" });
        }
      );

      uploadResult.end(req.file.buffer);
    } else {
      res.status(400).json({ error: "No file uploaded" });
    }
  } catch (error) {
    console.error("❌ Error in form submission:", error);
    res.status(500).json({ error: "Form submission failed" });
  }
});

module.exports = router;
