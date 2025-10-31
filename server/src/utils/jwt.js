// creating token and saving in cookie


const jwt =  require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const cookieExpires = process.env.COOKIE_EXPIRES;
const secretKey = process.env.JWT_SECRET;

exports.sendToken = (user, statusCode, res) => {
  // making token to be stored in the cookie
  let infoObj = {
    id: user._id,
  };
  // console.log(infoObj);

  let expireInfo = {
    expiresIn: '3d',
  };

  const token = jwt.sign(infoObj, secretKey, expireInfo);
  // console.log(token);

  // Default cookie expiration if not defined
  const expiresInDays = cookieExpires || 30;

  // Options for cookie
  const options = {
    expires: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'Strict', // Prevent CSRF attacks
  };

  // Exclude sensitive fields from the user object
  const { password, ...safeUser } = user._doc;

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user: safeUser,
    token,
  });
};
export default sendToken;
