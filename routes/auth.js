    /* 
        Rutas de Usuario / Auth
        host + /api/auth 
    */

const express = require('express');
const { createUser, userLogin, revalidToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate.jwt');
const router = express.Router()

router.post(
'/new',
[//middlewares
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password','El password debe tener al menos 6 caracteres').isLength({min: 6}),
    validateFields
] ,createUser);

router.post(
    '/',
    [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password','El password debe tener al menos 6 caracteres').isLength({min: 6}),
        validateFields
    ]
 ,userLogin);

router.get('/renew',validateJWT ,revalidToken);

module.exports = router