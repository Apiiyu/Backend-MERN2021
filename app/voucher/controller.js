const Vouchers = require('./model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config/env')
const { response } = require('express')

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

      const data = await Vouchers.find().populate('category').populate('nominals')
      response.render('admin/vouchers/v_voucher', {
        data,
        alert,
        name: request.session.user.name,
        title: 'Vouchers - PVPStore'
      })

    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/vouchers')
    }
  },

  /**
  * @description handle view create data 
  * @return {view} 
  */
  viewCreate: async(request, response) => {
    try {
      const CategoryItems = await Category.find()
      const NominalItems = await Nominal.find()
      response.render('admin/vouchers/create', {
        CategoryItems,
        NominalItems,
        name: request.session.user.name,
        title: 'Create Vouchers - PVPStore'
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/vouchers')
    }
  },

  /**
  * @description handle create data 
  * @param {*} response
  * @return {void} 
  */
  createData: async(request, response) => {
    try {
      const { name, category, nominals } = request.body
      
      if(request.file) {
        let tmp_path = request.file.path
        let originalExt = request.file.originalname.split('.')[request.file.originalname.split('.').length - 1]
        let filename = request.file.filename + '.' + originalExt
        let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`) 
        
        const src = fs.createReadStream(tmp_path)
        const destination = fs.createWriteStream(target_path)
        
        src.pipe(destination)
        src.on('end', async ()=> {
          try {
            console.log(src, 'filename')
            const vouchers = new Vouchers({
              name,
              category,
              nominals,
              thumbnail: filename
            })
            
            await vouchers.save();
            request.flash('message', 'Success add new vouchers!')
            request.flash('status', 'success')
  
            response.redirect('/vouchers')
          } catch (error) {
            request.flash('message', `${error.message}`)
            request.flash('status', 'danger')
            response.redirect('/vouchers')
          }
        })
      } else {
        const vouchers = new Vouchers({
          name,
          category,
          nominal,
        })
  
        await vouchers.save()
  
        request.flash('message', 'Success add new vouchers!')
        request.flash('status', 'success')
  
        response.redirect('/vouchers')
      }
    } catch (error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/vouchers')
    }
  },

  /**
  * @description handle view update data 
  * @return {view} 
  */
  viewUpdate: async(request, response) => {
    try {
      const { id } = request.params
      const CategoryItem = await Category.find()
      const NominalItem = await Nominal.find()
      const VouchersItem = await Vouchers.findById(id).populate('category').populate('nominals')
      
      response.render('admin/vouchers/update', {
        CategoryItem,
        NominalItem,
        VouchersItem,
        name: request.session.user.name,
        title: 'Update Vouchers - PVPStore'
      })
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/vouchers')
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
      const { name, category, nominals } = request.body
      
      if(request.file) {
        let tmp_path = request.file.path
        let originalExt = request.file.originalname.split('.')[request.file.originalname.split('.').length - 1]
        let filename = request.file.filename + '.' + originalExt
        let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`) 
        
        const src = fs.createReadStream(tmp_path)
        const destination = fs.createWriteStream(target_path)
        
        src.pipe(destination)
        src.on('end', async ()=> {
          try {
            console.log(src, 'filename')
            const selectedVoucher = await Vouchers.findById(id)
            let currentImage = `${config.rootPath}/public/uploads/${selectedVoucher.thumbnail}`
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage)
            }

            await Vouchers.findOneAndUpdate({
              _id: id
            }, {
              name,
              category,
              nominals,
              thumbnail: filename
            })

            request.flash('message', 'Success update data vouchers!')
            request.flash('status', 'success')
  
            response.redirect('/vouchers')
          } catch (error) {
            request.flash('message', `${error.message}`)
            request.flash('status', 'danger')
            response.redirect('/vouchers')
          }
        })
      } else {
        await Vouchers.findOneAndUpdate({
          _id: id
        }, {
          name,
          category,
          nominals,
        })

        request.flash('message', 'Success update data vouchers!')
        request.flash('status', 'success')
  
        response.redirect('/vouchers')
      }
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
      const data = await Vouchers.findOneAndRemove({
        _id: id
      })

      // --> Remove data image
      let currentImage = `${config.rootPath}/public/uploads/${data.thumbnail}`
      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage)
      }

      request.flash('message', 'Success delete data vouchers!')
      request.flash('status', 'success')

      response.redirect('/vouchers')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/vouchers')
    }
  },

  /**
  * @description handle change status voucher
  * @param {*} request
  * @return {void}
  */
  changeStatus: async (request, response) => {
    try {
      const { id } = request.params
      let data = await Vouchers.findById(id)
      const status = data.status == 'Active' ? 'Inactive' : 'Active'

      data = await Vouchers.findOneAndUpdate({
        _id: id
      }, {status})

      request.flash('message', 'Success update status vouchers!')
      request.flash('status', 'success')

      response.redirect('/vouchers')
    } catch(error) {
      request.flash('message', `${error.message}`)
      request.flash('status', 'danger')
      response.redirect('/vouchers')
    }
  }
}