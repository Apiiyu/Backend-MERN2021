const Users = require('./model')
const bcrypt = require('bcryptjs')
module.exports = {
  /**
   * @description Handle view Sign In
   * @return {view}
  */
  viewSignIn: async (request, response) => {
    try {
      const message = request.flash('message')
      const status = request.flash('status')
      const alert = { message, status } 
    
      if(request.session.user === null || request.session.user === undefined) {
        response.render('admin/users/v_signin', {
          alert,
          title: 'Sign In - PVPStore'
        })
      } else {
        response.redirect('/dashboard')
      }
    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/')
    }
  },

  /**
  * @description Handle Sign In
  * @param {*} request
  * @return {void} 
  */
  SignIn: async(request, response) => {
    try {
      const { email, password } = request.body
      const user = await Users.findOne({ email })

      if(user) {
        if(user.status === 'Active') {
          const validationPassword = await bcrypt.compare(password, user.password)

          if(validationPassword) {
            request.session.user = {
              id: user._id,
              email: user.email,
              status: user.status,
              name: user.name
            }

            response.redirect('/dashboard')
          } else {
            request.flash('message', `Your password is invalid!`)
            request.flash('status', 'danger')
            response.redirect('/')
          }
        } else {
          request.flash('message', `Sorry, your account is non active!`)
          request.flash('status', 'danger')
          response.redirect('/')
        }
      } else {
        request.flash('message', `Your email is invalid!`)
        request.flash('status', 'danger')
        response.redirect('/')
      }
    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/')
    }
  },
  logout: async(request, response) => {
    request.session.destroy()
    response.redirect('/')
  }
}