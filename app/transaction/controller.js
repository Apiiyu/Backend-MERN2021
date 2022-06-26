const Transactions = require('./model')

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

      const data = await Transactions.find().populate('player')
      response.render('admin/transactions/v_transactions', {
        data,
        alert,
        name: request.session.user.name,
        title: 'transactions - PVPStore'
      })

    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/transactions')
    }
  },
  changeStatus: async(request, response) => {
    try {
      const { id } = request.params
      const { status } = request.query

      await Transactions.findOneAndUpdate({ _id: id}, { status })
      request.flash('message', 'Successfully change status transaction!')
      request.flash('status', 'success')
      response.redirect('/transactions')
    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/transactions')
    }
  }
}