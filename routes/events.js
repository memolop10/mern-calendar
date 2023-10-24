/*
    Event Routes
    /api/events
*/

const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validateJWT } = require('../middlewares/validate.jwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');
const router = express.Router()

//para no poner el middleware en todas las rutas
// router.use(validateJWT)

router.get('/',validateJWT ,getEvents);
router.post('/',validateJWT,
    [
        check('title', 'title is required').not().isEmpty(),
        check('start','start date is required').custom(isDate),
        check('end','end date is required').custom(isDate),
        validateFields
    ]
    ,createEvent);
router.put('/:id',validateJWT,
[
        check('title', 'title is required').not().isEmpty(),
        check('start','start date is required').custom(isDate),
        check('end','end date is required').custom(isDate),
        validateFields  
] ,
updateEvent);
router.delete('/:id', validateJWT ,deleteEvent);

module.exports = router