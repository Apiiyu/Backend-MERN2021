const Player = require('../player/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config/env')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  signUp: async (request, response, next) => {
    try {
      const payload = request.body

      if(request.file) {
        console.log(request)
        let tmp_path = request.file.path
        let originalExt = request.file.originalname.split('.')[request.file.originalname.split('.').length - 1]
        let filename = request.file.filename + '.' + originalExt
        let target_path = path.resolve(config.rootPath, `public/uploads/players/${filename}`) 
        
        const src = fs.createReadStream(tmp_path)
        const destination = fs.createWriteStream(target_path)
        
        src.pipe(destination)
        src.on('end', async ()=> {
          try {
            console.log(src, 'filename')
            const player = new Player({
              ...payload,
              avatar: filename
            })

            await player.save()
            delete player._doc.password

            response.status(201).json({
              message: 'Successfully create new account!',
              data: player
            })
          } catch (error) {
            if(error && error.name == 'ValidationError') {
              return response.status(422).json({
                error: 1,
                message: error.message,
                fields: error.errors
              })
            }

            next(error)
          }
        })
      } else {
        let player = new Player(payload)
        
        await player.save()
        delete player._doc.password

        response.status(201).json({
          message: 'Successfully create new account!',
          data: player
        })
      }
    } catch (error) {
      if(error && error.name == 'ValidationError') {
        return response.status(422).json({
          error: 1,
          message: error.message,
          fields: error.errors
        })
      }
      next(error)
    }
  },

  signIn: async(request, response, next) => {
    const { email, password } = request.body

    try {
      const data = await Player.findOne({ email })
        
      if(data) {
        const checkPassword = bcrypt.compare(password, data.password)
        console.log(data)

        if(checkPassword) {
          const token = jwt.sign({
            data: {
              id: data.id,
              name: data.name,
              email: data.email,
              phoneNumber: data.phoneNumber,
              avatar: data.avatar
            }
          }, config.jwtKey)

            response.status(200).json({
              message: 'Successfully sign in into your account!',
              data: { 
                access_token: token
              }
            })
          } else {
            response.status(403).json({
              message: 'Your password is invalid!'
            })
          }
      } else {
        response.status(403).json({
          message: 'Unauthorized!'
        })
      }
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
    next()
  }
}