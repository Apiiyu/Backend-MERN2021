const Bank = require('./model')

module.exports = {
  /**
   * @description Handle page Bank
   * @return {view}
  */
  index: async(request, response) => {
    try {
      const message = request.flash('message')
      const status = request.flash('status')
      const alert = { message, status }

      const data = await Bank.find()
      response.render('admin/bank/v_bank', {
        data,
        alert,
        name: request.session.user.name,
        title: 'Bank - PVPStore'
      })

    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/bank')
    }
  },

  /**
  * @description handle view create data 
  * @return {view} 
  */
  viewCreate: async(request, response) => {
    try {
      response.render('admin/bank/create', {
        name: request.session.user.name,
        title: 'Create Bank - PVPStore'
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/bank')
    }
  },

  /**
  * @description handle create data 
  * @param {*} response
  * @return {void} 
  */
  createData: async(request, response) => {
    try {
      console.log(request.body)
      const { name, bankName, accountNumber } = request.body
      let data = await Bank({ name, bankName, accountNumber })
      await data.save()
      request.flash('message', 'Success add new bank!')
      request.flash('status', 'success')

      response.redirect('/bank')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/bank')
    }
  },

  /**
  * @description handle view update data 
  * @return {view} 
  */
  viewUpdate: async(request, response) => {
    try {
      const { id } = request.params
      const data = await Bank.findById(id)
      
      response.render('admin/bank/update', {
        data,
        name: request.session.user.name,
        title: 'Update Bank - PVPStore'
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/bank')
    }
  },

  /**
  * @description handle view update data 
  * @param {*} request 
  * @param {*} response 
  * @return {void}
  */
  updateData: async(request, response) => {
    try {
      const { id } = request.params
      const { name, bankName, accountNumber } = request.body 
      const data = await Bank.findOneAndUpdate({
        _id: id,
      }, { name, bankName, accountNumber })

      request.flash('message', 'Success update data bank!')
      request.flash('status', 'success')

      response.redirect('/bank')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/bank')
    }
  },

  /**
   * @description handle delete data
   * @param {*} request 
   * @return {void}
   */
  deleteData: async(request, response) => {
    try {
      const { id } = request.params
      const data = await Bank.findOneAndRemove({
        _id: id
      })

      request.flash('message', 'Success delete data bank!')
      request.flash('status', 'success')

      response.redirect('/bank')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/bank')
    }
  }
}