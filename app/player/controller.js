const Voucher = require('../voucher/model')
const Category = require('../category/model')
const Nominal = require('../nominal/model')
const Payment = require('../payment/model')
const Bank = require('../bank/model')
const Player = require('./model')
const Transaction = require('../transaction/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config/env')

module.exports = {
  landingPage: async (request, response) => {
    try {
      const VoucherItems = await Voucher.find().select('_id name status category thumbnail').populate('category')

      response.status(200).json({
        message: 'Successfully get data!',
        data: VoucherItems
      })
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  detailPage: async (request, response) => {
    try {
      const { id } = request.params
      const VoucherItems = await Voucher.findOne({_id: id})
      .populate('category')
      .populate('nominals')
      .populate('user')
      .populate({
        path: 'payments', 
        populate: {
          path: 'banks',
          model: 'Bank'
        }
      })

      if(!VoucherItems) {
        return response.status(404).json({
          message: 'Voucher Game is not found!'
        })
      }

      response.status(200).json({
        message: 'Successfully get data!',
        data: VoucherItems
      })
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  category: async(request, response) => {
    try {
      const data = await Category.find()

      if(!data) {
        response.status(404).json({
          message: 'Data category is not found!',
          data: []
        })
      }

      response.status(200).json({
          message: 'Successfully get data category!',
          data
        })
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  checkOut: async(request, response) => {
    try {
      const { accountUser, name, nominal, voucher, payment, bank } = request.body
      const VoucherData = await Voucher.findOne({_id: voucher}).select('name category _id thumbnail user').populate('category').populate('user')

      if(!VoucherData) {
        return response.status(404).json({
          message: "Voucher Game doesn't exists!"
        })
      }

      const NominalData = await Nominal.findOne({_id: nominal})
      if(!NominalData) {
        return response.status(404).json({
          message: "Nominal doesn't exists!"
        })
      }

      const PaymentData = await Payment.findOne({_id: payment})
      if(!PaymentData) {
        return response.status(404).json({
          message: "Payment doesn't exists!"
        })
      }

      const BankData = await Bank.findOne({_id: bank})
      if(!BankData) {
        return response.status(404).json({
          message: "Bank doesn't exists!"
        })
      }

      let tax = (10/100) * NominalData._doc.price
      let value = NominalData._doc.price - tax
      console.log(value)

      const payload = {
        historyVoucherTopUp: {
          gameName: VoucherData._doc.name,
          category: VoucherData._doc.category ? VoucherData._doc.category.name : '',
          thumbnail: VoucherData._doc.thumbnail,
          coinName: NominalData._doc.coinName,
          coinQuantity: NominalData._doc.coinQuantity,
          price: NominalData._doc.price
        },
        historyPayment: {
          name: PaymentData._doc.name,
          type: PaymentData._doc.type,
          bankName: PaymentData._doc.bankName,
          accountNumber: PaymentData._doc.accountNumber
        },
        name,
        accountUser,
        tax,
        value,
        player: request.player._id,
        historyUser: {
          name: VoucherData._doc.user?._id,
          phoneNumber: VoucherData._doc.user?.phoneNumber
        },
        category: VoucherData._doc.category?._id,
        user: VoucherData._doc.user?._id
      }

      const transactions = new Transaction(payload)
      await transactions.save()
      
      response.status(201).json({
        message: 'Successfully create new transaction!',
        data: transactions
      })

    } catch (error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  historyTransaction: async(request, response) => {
    try {
      const { status = '' } = request.query
      let criteria = {}

      if(status.length) {
        criteria = {
          ...criteria,
          status: { $regex: `${status}`, $options: 'i'}
        }
      }

      if(request.player._id) {
        criteria = {
          ...criteria,
          player: request.player._id
        }
      }

      const history = await Transaction.find(criteria)
      let total = await Transaction.aggregate([
        { $match: criteria },
        { 
          $group: {
            _id: null,
            value: {$sum: '$value'}
          } 
        }
      ])

      response.status(200).json({
        message: 'Successfully get history transaction',
        data: history,
        total: total.length ? total[0].value: 0
      })
    } catch (error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  detailHistory: async (request, response) => {
    try {
      const { id } = request.params
      const history = await Transaction.findById(id)

      if(!history) {
        response.status(404).json({
          message: 'History Transactions is not found!',
          data: []
        })
      }

      response.status(200).json({
        message: 'Successfully get data history!',
        data: history
      })
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  dashboardOverview: async (request, response) => {
    try {
      const count = await Transaction.aggregate([
        {
          $match: {
            player: request.player._id
          }
        },
        {
          $group: {
            _id: '$category',
            value: {
              $sum: '$value'
            }
          }
        }
      ])

      const category = await Category.find()
      category.forEach(categoryItem => {
        count.forEach(countItem => {
          if(countItem._id.toString() === categoryItem._id.toString()) {
            countItem.name = categoryItem.name
          }
        })
      })

      const history = await Transaction.find({
        player: request.player._id
      }).populate('category').sort({'updatedAt': -1})

      response.status(200).json({
        message: 'Successfully get data dashboard overview!',
        data: {
          history,
          counts: count
        } 
      })
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  profile: async (request, response) => {
    try {
      console.log(request.player)
      const data = {
        id: request.player._id,
        username: request.player.username,
        email: request.player.email,
        name: request.player.name,
        avatar: request.player.avatar,
        phone_number: request.player.phoneNumber
      }

      response.status(200).json({
        message: 'Successfully get data profile!',
        data
      })
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  },

  updateProfile: async (request, response, next) => {
    try {
      const { name = '', phoneNumber= '' } = request.body
      const payload = {}

      if(name.length) payload.name = name
      if(phoneNumber.length) payload.phoneNumber = phoneNumber

      if(request.file) {
        let tmp_path = request.file.path
        let originalExt = request.file.originalname.split('.')[request.file.originalname.split('.').length - 1]
        let filename = request.file.filename + '.' + originalExt
        let target_path = path.resolve(config.rootPath, `public/uploads/players/${filename}`) 
        
        const src = fs.createReadStream(tmp_path)
        const destination = fs.createWriteStream(target_path)

        src.pipe(destination)
        src.on('end', async ()=> {
            let player = await Player.findById(request.player._id)
            let currentImage = `${config.rootPath}/public/uploads/players/${player.avatar}`
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage)
            }

            player = await Player.findOneAndUpdate({
              _id: request.player._id
            }, {
              ...payload,
              avatar: filename
            }, { new: true, runValidators: true} )

            console.log(player)

            response.status(201).json({
              message: 'Successfully update profile!',
              data: {
                id: player.id,
                name: player.name,
                phoneNumber: player.phoneNumber,
                avatar: player.avatar
              }
            })
        })
      } else {
        const data = await Player.findOneAndUpdate({
          _id: request.player._id
        }, payload, { new: true, runValidators: true})
      
        response.status(201).json({
          message: 'Successfully update profile!',
          data: {
            id: data.id,
            name: data.name,
            phoneNumber: data.phoneNumber,
            avatar: data.avatar
          }
        })
      }
    } catch(error) {
      response.status(500).json({
        message: error.message || 'Internal server error'
      })
    }
  }
}