const {response} = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');


const createUser = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })

        if (user) {
            return res.status(400).json({
                ok: false,
                msg: "There is already a user with that email"
            })
        }

        user = new User( req.body )

        //Encriptar Contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt )


        await user.save();

        //Generar token
        const token = await generateJWT( user.id, user.name )
    
        res.status(201).json({
            ok: true,
            uid:user.id,
            name:user.name,
            token

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg:'Server Error call the Admin'
        })
    }
 
}

const userLogin = async(req, res = response) => {
    const { email, password } = req.body

    try {

        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: "There is already a user with that email"
            })
        }

        //Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, user.password)
        
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg:'Incorret Password'
            })
        }

        //Generar JWT
        const token = await generateJWT( user.id, user.name )

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg:'Server Error call the Admin'
        })
    }

}

const revalidToken = async( req, res = response ) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generateJWT( uid, name )

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    userLogin,
    revalidToken
}