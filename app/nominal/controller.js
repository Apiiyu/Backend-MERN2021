const Nominal = require('./model')

module.exports = {
  /**
   * @description Handle page nominal
   * @return {view}
  */
  index: async(request, response) => {
    try {
      const message = request.flash('message')
      const status = request.flash('status')
      const alert = { message, status }

      const data = await Nominal.find()
      console.log(alert)
      response.render('admin/nominal/v_nominal', {
        data,
        alert
      })

    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/nominal')
    }
  },

  /**
  * @description handle view create data 
  * @return {view} 
  */
  viewCreate: async(request, response) => {
    try {
      response.render('admin/nominal/create')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/nominal')
    }
  },

  /**
  * @description handle create data 
  * @param {*} response
  * @return {void} 
  */
  createData: async(request, response) => {
    try {
      const { coinName, coinQuantity, price } = request.body
      let data = await Nominal({ coinName, coinQuantity, price })
      await data.save()
      request.flash('message', 'Success add new nominal!')
      request.flash('status', 'success')

      console.log()
      response.redirect('/nominal')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/nominal')
    }
  },

  /**
  * @description handle view update data 
  * @return {view} 
  */
  viewUpdate: async(request, response) => {
    try {
      const { id } = request.params
      const data = await Nominal.findById(id)
      
      response.render('admin/nominal/update', {
        data
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/nominal')
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
      const { coinName, coinQuantity, price } = request.body 
      const data = await Nominal.findOneAndUpdate({
        _id: id,
      }, { coinName, coinQuantity, price })

      request.flash('message', 'Success update data nominal!')
      request.flash('status', 'success')

      response.redirect('/nominal')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/nominal')
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
      const data = await Nominal.findOneAndRemove({
        _id: id
      })

      request.flash('message', 'Success delete data nominal!')
      request.flash('status', 'success')

      response.redirect('/nominal')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/nominal')
    }
  }
}