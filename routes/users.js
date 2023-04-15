const express = require('express')
const router = express.Router()
const UsersModel = require('../models/users')
const bcrypt = require('bcrypt')
const passwordCheck = require('../utils/passwordCheck')

//routing endpoint users utama
router.get('/', async (req, res) => {
   const users = await UsersModel.findAll() 
    res.status(200).json({
        data: users,
        metadata: "test user endpoint"
    })
})

router.post('/', async (req, res) =>{
    //nip, nama, password 
    const { nip, nama, password } = req.body

    const encryptedPassword = await bcrypt.hash(password, 7)

    const users = await UsersModel.create({
        nip, nama, password: encryptedPassword
    }) 
    res.status(200).json({
        data: users,
        metadata: "test post user endpoint"
    })
})

router.put('/', async (req, res) =>{
    //nip, nama, password 
    const { nip, nama, password, passwordBaru } = req.body

    const compare = await passwordCheck(nip, password)

    const encryptedPassword = await bcrypt.hash(passwordBaru, 7)
    //password yang muncul didatabase --- password dari inputan
    if ( compare === true ) {
        const users = await UsersModel.update({
            nama, password: encryptedPassword
        },   { where : {nip: nip } })
        
        res.status(200).json({
            users: {updated: users[0]},
            metadata: "user updated!"
        })        
    } else {
        res.status(400).json({
            error: "data invalid"
        })
    }
}) 

router.post('/login', async (req, res) => {
    const { nip, password } = req.body
    const check = await passwordCheck(nip, password)
    if(check.compare === true) {
        res
            .status(200)
            .json({
                status: 200,
                data: check.userData,
                metadata: "login success"
        })
    } else {
        res.status(400).json({
            data: null,
            metadata: "data invalid"  
        })
    }
})

module.exports = router