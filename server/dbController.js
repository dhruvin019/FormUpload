const express = require('express');
const multer = require('multer');
const path = require('path');
const FormData = require('./dbModel');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedFiletypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
      const extname = allowedFiletypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedFiletypes.test(file.mimetype);
      
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only images and documents are allowed'));
      }
    }
  }).single('file');


router.post('/submit', upload, async (req, res) => {
    const { firstName, lastName, email, phoneNumber, hobbies, gender } = req.body;
  
    try {
      const existingFirstName = await FormData.findOne({ firstName });
      if (existingFirstName) {
        return res.status(409).json({ message: 'Name already exists.' });
      }
  
      const existingEmail = await FormData.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists.' });
      }
  
      const newFormData = new FormData({
        firstName,
        lastName,
        email,
        phoneNumber,
        hobbies: Array.isArray(hobbies) ? hobbies : hobbies.split(','), 
        gender,
        filePath: req.file ? req.file.path : null
      });
  
      await newFormData.save();
      res.status(200).json(newFormData);
    } catch (error) {
      console.error('Error in submitting form data:', error.message);
      res.status(400).json({ message: error.message });
    }
  });
router.get('/allusers', async (req, res) => {
    try {
      const allUsers = await FormData.find();
  
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  router.put('/edit/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Multer error: ' + err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error occurred: ' + err.message });
        }

        const { firstName, lastName, email, phoneNumber, hobbies, gender } = req.body;
        const { id } = req.params;
        
        try {
            const updatedFields = { firstName, lastName, email, phoneNumber, hobbies, gender };
            
            if (req.file) {
                updatedFields.filePath = req.file.path;
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                updatedFields,
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
});
  

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; 
  
    try {    
      const deletedUser = await FormData.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


router.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await FormData.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;
