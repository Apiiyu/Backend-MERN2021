const Category = require('./model')

module.exports = {
  /**
   * @description Handle page category
   * @return {view}
  */
  index: async(request, response) => {
    try {
      const message = request.flash('message')
      const status = request.flash('status')
      const alert = { message, status }

      const data = await Category.find()
      console.log(alert)
      response.render('admin/category/v_category', {
        data,
        alert
      })

    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/category')
    }
  },

  /**
  * @description handle view create data 
  * @return {view} 
  */
  viewCreate: async(request, response) => {
    try {
      response.render('admin/category/create')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/category')
    }
  },

  /**
  * @description handle create data 
  * @param {*} response
  * @return {void} 
  */
  createData: async(request, response) => {
    try {
      const { name } = request.body
      let data = await Category({ name })
      await data.save()
      request.flash('message', 'Success add new category!')
      request.flash('status', 'success')

      console.log()
      response.redirect('/category')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/category')
    }
  },

  /**
  * @description handle view update data 
  * @return {view} 
  */
  viewUpdate: async(request, response) => {
    try {
      const { id } = request.params
      const data = await Category.findById(id)
      
      response.render('admin/category/update', {
        data
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/category')
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
      const { name } = request.body 
      const data = await Category.findOneAndUpdate({
        _id: id,
      }, { name})

      request.flash('message', 'Success update data category!')
      request.flash('status', 'success')

      response.redirect('/category')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/category')
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
      const data = await Category.findOneAndRemove({
        _id: id
      })

      request.flash('message', 'Success delete data category!')
      request.flash('status', 'success')

      response.redirect('/category')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/category')
    }
  }
}