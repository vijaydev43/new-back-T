const jwt = require('jsonwebtoken');
const tokenHelper = new Object()
const secretKey = 'bjjhqsrkanmt';
const generator = require('generate-password'); 


tokenHelper.generateAccessToken = (userid,phoneNo ) => {
  const accessToken = jwt.sign({ userId: userid, phoneNo: phoneNo }, secretKey, { expiresIn: "1h" });
  return accessToken;
  }

tokenHelper.verifyAccessToken = (token) => {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null
    }
  }

tokenHelper.decodeAccessToken = (token) => {
    try {
      const decoded = jwt.decode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }


  tokenHelper.passwordGenerator = generator.generate({ 
	length: 8, 
	numbers: true, 
	symbols: false, 
	uppercase: true, 
	excludeSimilarCharacters: false, 
	strict: true, 

}); 




module.exports = tokenHelper;
