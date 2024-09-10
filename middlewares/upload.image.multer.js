import multer from "multer";

const uploadImages = (options = {}) => {
  const {
    destination = "uploads/", // Default destination directory
    single = true, // Default to single file upload
    fieldName = "file", // Default field name
    limit = 10, // Default limit for multiple files
  } = options;

  // Set up storage engine
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination); // Use custom destination or default
    },

    filename: function (req, file, cb) {
      // Use the original name if provided, otherwise use a timestamp
      const name =
        req.body[`${file.fieldname}Name`] ||
        `${Date.now()}-${file.originalname}`;
      cb(null, name);
    },
  });

  // Initialize multer with storage engine
  const upload = multer({ storage: storage });

  // Return the appropriate middleware
  return single ? upload.single(fieldName) : upload.array(fieldName, limit);
};

// Export the function
export default uploadImages;
