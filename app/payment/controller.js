const Payment = require('./model')
const Bank = require('../bank/model')

module.exports = {
  /**
   * @description Handle page Payment
   * @return {view}
  */
  index: async(request, response) => {
    try {
      const message = request.flash('message')
      const status = request.flash('status')
      const alert = { message, status }

      const data = await Payment.find().populate('banks')
      response.render('admin/payment/v_payment', {
        data,
        alert,
        name: request.session.user.name,
        title: 'Payment - PVPStore'
      })

    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/payment')
    }
  },

  /**
  * @description handle view create data 
  * @return {view} 
  */
  viewCreate: async(request, response) => {
    try {
      const BankItems = await Bank.find()
      response.render('admin/payment/create', {
        BankItems,
        name: request.session.user.name,
        title: 'Create Payment - PVPStore'
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/payment')
    }
  },

  /**
  * @description handle create data 
  * @param {*} response
  * @return {void} 
  */
  createData: async(request, response) => {
    try {
      const { type, banks } = request.body
      let data = await Payment({ type, banks })
      await data.save()
      request.flash('message', 'Success add new type of payment!')
      request.flash('status', 'success')

      response.redirect('/payment')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/payment')
    }
  },

  /**
  * @description handle view update data 
  * @return {view} 
  */
  viewUpdate: async(request, response) => {
    try {
      const { id } = request.params
      const data = await Payment.findById(id).populate('banks')
      const BankItems = await Bank.find()
      
      response.render('admin/payment/update', {
        data,
        BankItems,
        name: request.session.user.name,
        title: 'Update Payment - PVPStore'
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/payment')
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
      const { type, banks } = request.body 
      const data = await Payment.findOneAndUpdate({
        _id: id,
      }, { type, banks })

      request.flash('message', 'Success update data type of payment!')
      request.flash('status', 'success')

      response.redirect('/payment')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/payment')
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
      const data = await Payment.findOneAndRemove({
        _id: id
      })

      request.flash('message', 'Success delete data type of payment!')
      request.flash('status', 'success')

      response.redirect('/payment')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/payment')
    }
  }
}