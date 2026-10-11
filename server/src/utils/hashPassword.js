//function to return the hashed password without
const bcrypt = require('bcryptjs');

module.exports = async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}