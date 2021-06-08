var CryptoJS = require("crypto-js");
var clave = "uyuyuy no me adivinas"

class Token {

    CreateToken() {
        var capitalLetters = "ABCDEFGHJKMNPQRSTUVWXYZ";
        var lowercase = "abcdefghjkomnpqrstuvwxyz";
        var numbers = "23456789";

        var password = "";

        while (password.length < 8) {
            var random = Math.round(Math.random() * (2));
            switch (random) {
                case 0:
                    password += capitalLetters.charAt(Math.round(Math.random() * (capitalLetters.length)));
                    break;
                case 1:
                    password += lowercase.charAt(Math.round(Math.random() * (lowercase.length)));
                    break;
                case 2:
                    password += numbers.charAt(Math.round(Math.random() * (numbers.length)));
                    break;
            }
        }
        password = CryptoJS.AES.encrypt(String(password), clave).toString();
        while (password.indexOf("%20") != -1) {
            password = password.replace("%20", "+");
        }
        return password;
    }

}

module.exports = {
    Token
}