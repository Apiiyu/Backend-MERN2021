module.exports = {
  index: async(request, response) => {
    try {
      response.render('index', {
        title: 'Home - PVPStore'
      })
    } catch (error) {
      console.log(error)
    }
  }
}