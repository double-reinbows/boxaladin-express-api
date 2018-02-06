const https = require ('https')
const CircularJSON = require('circular-json')
const axios = require ('axios')
var convert = require('xml-js')

module.exports = {
  pulsa(req, res) {
    var pulsa = `<?xml version="1.0" ?>
                <mp>
                  <commands>topup</commands>
                  <username>081380572721</username>
                  <ref_id>order01</ref_id>
                  <hp>${req.body.hp}</hp>
                  <pulsa_code>${req.body.pulsa_code}</pulsa_code>
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
      let dataJson = JSON.parse(json)
      // res.send(convert.xml2json(dataJson.config.data, { compact: true }));
      res.send(dataJson.config)
    })
    .catch(err => console.log(err))
  }
};
