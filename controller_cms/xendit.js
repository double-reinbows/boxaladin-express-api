const axios = require ('axios')

module.exports = {
  balance(req, res) {
      axios({
        method: 'GET',
        url: `https://api.xendit.co/balance`,
        headers: {
          authorization: process.env.XENDIT_PRODUCTION_AUTHORIZATION        
        }
      })
      .then(({data}) => {
        res.send(data)
      })
      .catch(err => res.send(err))
  }, 
}
