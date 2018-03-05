module.exports = {
  createCallback(req, res) {
    //TODO: CHECKING HEADER
    console.log(req.headers);
    if(req.headers['x-callback-token']!==undefined&&req.headers['x-callback-token']==='eG5kX2RldmVsb3BtZW50X1A0cURmT3NzME9DcGw4UnRLclJPSGphUVlOQ2s5ZE41bFNmaytSMWw5V2JlK3JTaUN3WjNqdz09Og=='){
      //TODO: GET BODY RESPONSES
      const body = req.body;
      //TODO: UPDATE ORDER IF STATUS COMPLETED
      const paymentId = req.body.external_id;
      const getPayment = Payment.find(payment_id);
      if(req.body.status === 'COMPLETED'&&getPayment.status === 'PENDING'){
        //TODO: UPDATE PAYMENT;
        //TODO: SENDING EMAIL TO USER.
        getPayment.status = 'COMPLETED';
        getPayment.updated = req.body.updated;
        getPayment.save();
        //TODO: POST TO API PULSA.
      }

      return res.send(body)
    }
    return res.status(500).send('Invalid Credentials')
  }, 
}