const https = require ('https')
const CircularJSON = require('circular-json')
const axios = require ('axios')

module.exports = {
  pulsa(req, res) {
    var pulsa = `<?xml version="1.0" ?>
                <mp>
                  <commands>topup</commands>
                  <username>081380572721</username>
                  <ref_id>order01</ref_id>
                  <hp>081220563934</hp>
                  <pulsa_code>xld5000</pulsa_code>
                  <sign>b1b2cc42a395bec43ebab0f22ca80a75</sign>
                </mp>`
    axios.post('https://testprepaid.mobilepulsa.net/v1/legacy/index', pulsa, {
        headers: {
            'Content-Type': 'text/xml',
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    .then((data) => {
      let json = CircularJSON.stringify(data);
      res.send(json);
    })
    .catch(err => console.log(err))
  }
};