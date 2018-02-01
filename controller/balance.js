const axios = require ('axios')

module.exports = {
  balance(req, res) {
      axios({
        method: 'GET',
        url: `https://api.xendit.co/balance`,
        headers: {
          authorization: "Basic eG5kX2RldmVsb3BtZW50X09ZcUFmTDBsMDdldmxjNXJkK0FhRW1URGI5TDM4Tko4bFhiZytSeGkvR2JlOExHb0NBUitndz09Og=="        
        }
      })
      .then(({data}) => {
        res.send(data)
      })
      .catch(err => console.log(err))
  }, 
}
