var jwt = require('jsonwebtoken')
var secret = "KS10ç"

module.exports = function(req, res, next){
    const authToken = req.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split(' ')
        var token = bearer[1];
        var decoded = jwt.verify(token, secret)
        if(decoded.role == 1){
            next();
        }else{
            res.status(403)
            res.send("não autorizao")
            return
        }
    }else{
        res.status(403)
        res.send("não autorizao")
        return
    }
} 