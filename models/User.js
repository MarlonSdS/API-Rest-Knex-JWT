var knex = require('../database/connection');
var bcrypt = require('bcrypt');
const PasswordToken = require('./PasswordToken');

class User{

    async finfAll(){
        try{
            var results = await knex.select(["id", "nome", "email", "role"]).from("users");
            return results;
        }catch(err){
            console.log(err);
            return [];
        }
    }

    async findById(id){
        try{
            var results = await knex.select(["id", "nome", "email", "role"]).where({id: id}).from("users");
            if(results.length > 0){
                return results[0];
            }else{
                return undefined;
            }
        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async findByEmail(email){
        try{
            var results = await knex.select(["id", "nome", "email", "password", "role"]).where({email: email}).from("users");
            if(results.length > 0){
                return results[0];
            }else{
                return undefined;
            }
        }catch(err){
            console.log(err);
            return undefined;
        }
    }

    async new(email, password, nome){
        try{
            var hash = await bcrypt.hash(password, 10);
            await knex.insert({email, password: hash, nome, role: 0}).table("users");
        }catch(err){
            console.log(err);
        }
    }

    async findEmail(email){
        try{
            var result = await knex.select("*").from("users").where({email: email});
            if(result.length > 0){
                return true;
            }else{
                return false;
            }
        }catch(err){
            console.log(err);
            return false;
        }
    }

    async update(id, nome, email, role){
        var user = await this.findById(id);
        if(user != undefined){
            var editUser = {};
            if(email != undefined){
               if(email != user.email){
                var result = await this.findEmail(email);
                if(!result){
                    editUser.email = email;
                    return {status: true}
                    }else{
                        return {status: false, err: "O e-mail já existe"}
                    }
                } 
            }
            
            if(nome != undefined){
                editUser.nome = nome;
            }

            if(role != undefined){
                editUser.role = role;
            }

            try{
                await knex.update(editUser).where({id: id}).table("users");
            }catch(err){
                return  {status: false, err: err}
            }
            

        }else{
            return {status: false, err: "O usuário não existe"}
        }
        return {status: true};
    }

    async delete(id){
        var user = await this.findById(id);
        if(user != undefined){
            try{
                await knex.delete().where({id: id}).table("users");
                return {status: true}
            }catch(err){
                return {status: false, err: err}
            }
        }else{
            return {status: false, err: "O usuário não existe"}
        }
    }

    async changePassword(newPassword, id, token){
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update({password: hash}).where({id: id}).table("users");
        await PasswordToken.setUsed(token);
    }

}

module.exports = new User;