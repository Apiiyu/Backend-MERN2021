const Transactions = require('../transaction/model')
const Vouchers = require('../voucher/model')
const Player = require('../player/model')
const Category = require('../category/model')

module.exports = {
  index: async(request, response) => {
    try {
      const TransactionItems = await Transactions.countDocuments()
      const VoucherItems = await Vouchers.countDocuments()
      const PlayerItems = await Player.countDocuments()
      const CategoryItems = await Category.countDocuments()

      response.render('admin/dashboard/v_dashboard', {
        name: request.session.user.name,
        title: 'Dashboard - PVPStore',
        count: {
          TransactionItems,
          VoucherItems,
          PlayerItems,
          CategoryItems
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}