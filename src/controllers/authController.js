const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { generateToken } = require('../utils/jwt');
const authService = require('../services/authService');
const upload = require('../config/multer');

exports.signup = catchAsync(async (req, res, next) => {

    const { email, username, password, dateOfBirth, gender } = req.body;

    console.log('Request Body:', req.body);
    console.log('Request File:', req.file); 
    try {
      // Use Multer middleware to handle the file upload
      upload.single('profilePicture')(req, res, async (err) => {
        if (err) {
          return next(new AppError('Error uploading file ' + err, 400));
        }
  
        // Extract uploaded file URL and user data
        const profilePictureUrl = req.file ? req.file.path : null;  
        // Create user with auth service
        const user = {
          email,
          username,
          password,
          dateOfBirth,
          gender,
          profilePicture: profilePictureUrl, // Save Cloudinary URL
        };

        await authService.registerUser(user)
  
        // Generate JWT token
        const token = generateToken({ id: user._id });
  
        // Respond with user data and token
        res.status(201).json({
          status: 'success',
          token,
          data: { user },
        });
      });
    } catch (error) {
      next(error);
    }
  });

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await authService.authenticateUser(email, password);
    if (!user) {
        return next(new AppError('Invalid email or password', 401));
    }
    const token = generateToken({ id: user._id });
    res.status(200).json({
        status: 'success',
        token,
        data: { user },
    });
});
