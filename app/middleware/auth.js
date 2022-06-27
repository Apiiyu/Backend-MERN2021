const config = require('../../config/env')
const jwt = require('jsonwebtoken')
const Player = require('../player/model')

module.exports = {
  isLoginAdmin: (request, response, next) => {
    if(request.session.user === null || request.session.user === undefined) {
      request.flash('message', `Sorry, your session is expired!`)
      request.flash('status', 'danger')
      response.redirect('/')
    } else {
      next()
    }
  },

  isLoginPlayer: async (request, response, next) => {
    try {
      const access_token = request.headers.authorization ? request.headers.authorization.replace('Bearer ', '') : null
      const resultToken = jwt.verify(access_token, config.jwtKey)
      const data = await Player.findOne({_id: resultToken.data.id})

      if(!data) {
        throw new Error()
      }

      request.player = data
      request.access_token = access_token
      next()
    } catch(error) {
      response.status(401).json({
        error: 'Unauthorized to access this resource'
      })
    }
  }
}