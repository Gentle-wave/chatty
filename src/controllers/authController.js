const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { generateToken } = require('../utils/jwt');
const authService = require('../services/authService');

const male = [
  'https://res.cloudinary.com/dsdlvalkh/image/upload/v1733734850/androgynous-avatar-non-binary-queer-person_7_kc2hap.jpg',
  'https://res.cloudinary.com/dsdlvalkh/image/upload/v1733734832/androgynous-avatar-non-binary-queer-person_cla2ko.jpg',
  'https://res.cloudinary.com/dsdlvalkh/image/upload/v1733734830/androgynous-avatar-non-binary-queer-person_5_z2g4nw.jpg',
  'https://res.cloudinary.com/dsdlvalkh/image/upload/v1733734829/androgynous-avatar-non-binary-queer-person_6_e1s1go.jpg',
];

const female = [
  'https://res.cloudinary.com/dsdlvalkh/image/upload/v1733734630/androgynous-avatar-non-binary-queer-person_2_krfzx1.jpg',
  'https://res.cloudinary.com/dsdlvalkh/image/upload/v1733734623/androgynous-avatar-non-binary-queer-person_1_uw7aue.jpg',
  'https://res.cloudinary.com/dsdlvalkh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1733734622/androgynous-avatar-non-binary-queer-person_4_v92o7j.jpg',
  'https://res.cloudinary.com/dsdlvalkh/image/upload/v1733734611/androgynous-avatar-non-binary-queer-person_3_bj8h74.jpg',
];

exports.signup = catchAsync(async (req, res, next) => {
  const { email, username, password, dateOfBirth, gender } = req.body;

  try {
    // Determine default profile picture based on gender
    let profilePicture = null;
    if (gender === 'male') {
      profilePicture = male[Math.floor(Math.random() * male.length)];
    } else if (gender === 'female') {
      profilePicture = female[Math.floor(Math.random() * female.length)];
    }

    // Create user with auth service
    const user = {
      email,
      username,
      password,
      dateOfBirth,
      gender,
      profilePicture,
    };

    await authService.registerUser(user);

    // Generate JWT token
    const token = generateToken({ id: user._id });

    // Respond with user data and token
    res.status(201).json({
      status: 'success',
      token,
      data: { user },
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