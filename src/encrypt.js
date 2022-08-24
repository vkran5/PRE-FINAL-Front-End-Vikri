const Crypto = require('crypto');

module.exports = {
    hashPassword : (pass) => {
        return Crypto.createHmac("sha256", "POSTY115").update(pass).digest("hex");
    }
}