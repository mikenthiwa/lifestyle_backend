export default () => ({
  JWTSecretKey: process.env.JWT_SECRET,
  JWTExpirationTime: process.env.JWT_EXPIRATION_TIME,
});
