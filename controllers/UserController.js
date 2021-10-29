var User = require('../models/User');
var PassworToken = require('../models/PasswordToken');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var secret = "KS10ç"

class UserController{

    async index(req, res){
        var users = await User.finfAll();
        res.json(users);
    }

    async findUser(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.status(200);
            res.json(user);
        }
    }

    async create(req, res){
        var {email, nome, password} = req.body;

        if(email == undefined){
            res.status(400);
            res.json({err: "O e-mail é inválido"});
            return;
        }

        var emailExist = await User.findEmail(email);

        if(emailExist){
            res.status(406);
            res.json({err: "O e-mail enviado já está cadastrado"})
        }

        await User.new(email, password, nome);

        res.status(200);
        res.send("pegando a requisição");
    }

    async edit(req, res){
        var {id, nome, email, role} = req.body;
        var result = await User.update(id, nome, email, role);
        if(result != undefined){
            if(result.status){
            res.send("tudo ok")
            }else{
                res.status(406)
                res.send(result.err)
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro")
        }
        
    }

    async remove(req, res){
        var id = req.params.id;
        var result = await User.delete(id);

        if(result.status){
            res.status(200)
            res.send("Tudo ok")
        }else{
            res.status(406);
            res.send(result.err);
        }
    }

    async passwordRecover(req, res){
        var email = req.body.email;

        var result = await PassworToken.create(email);

        if(result.status){
            res.status(200)
            res.send(""+result.token)
        }else{
            res.status(406)
            console.log(result.err)
        }
    }

    async changePassword(req, res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PassworToken.validate(token);
        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200)
            res.send("Senha alterada")
        }else{
            res.status(406);
            res.send("Token Inválido");
        }
    }

    async login(req, res){
        var {email, password} = req.body;
        var user = await User.findByEmail(email);

        if(user != undefined){
            var result = await bcrypt.compare(password, user.password);

            if(result){
                var token = jwt.sign({email: user.email, role: user.role}, secret)

                res.status(200);
                res.json({token: token})
            }else{
                res.status(406);
                res.send("Senha incorreta")
            }
        }else{
            res.json({status: false});
        }
    }

}

module.exports = new UserController;