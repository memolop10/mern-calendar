const { response } = require('express')
const Event = require('../models/Event')


const getEvents = async( req, res = response ) => {

    const events = await Event.find().populate('user', 'name')

    res.json({
        ok: true,
        events
    })
}

const createEvent = async( req, res = response ) => {

    const event = new Event( req.body )

    try {
        event.user = req.uid;

        const saveEvent = await event.save()

        res.json({
            ok: true,
            event: saveEvent
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'connect serve fail'
        })
    }
}

const updateEvent = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'event doesnt exist with that id'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para editar este evento'
            })
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, {new: true} )

        res.json({
            ok: true,
            event: eventUpdated
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg:'server connect fail'
        })
    }
}

const deleteEvent = async( req, res = response ) => {

    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );

        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'event doesnt exist with that id'
            })
        }

        if (event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para eliminar este evento'
            })
        }

        const eventDeleted = await Event.findByIdAndDelete( eventId )

        res.json({
            ok: true,
            event: eventDeleted
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg:'server connect fail'
        })
    }
    
}



module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}