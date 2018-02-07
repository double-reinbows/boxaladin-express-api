const db = require('../models')

module.exports = {
    createCallback(req, res) {
      //TODO: CHECKING HEADER
      if(req.headers['x-callback-token']!==undefined&&req.headers['x-callback-token']===process.env.XENDIT_VALIDATION_TOKEN)
      {      
        //TODO: GET BODY RESPONSES
        const body = req.body;
        const paymentId = body.external_id;
        console.log("testing")
        //TODO: UPDATE ORDER IF STATUS COMPLETED
        db.payment    
        .findById(paymentId)
        .then(data => {
          if (!data) {
            return res.status(404).send({
              message: 'Id Not Found',
            });
          }else{              
            if(data.status === 'PENDING'&& req.body.status === 'COMPLETED'){
              //TODO: UPDATE PAYMENT;
              //TODO: SENDING EMAIL TO USER.
              db.payment.update({
                status: req.body.status
              },{
                where:{
                  id: paymentId
                }
              })
              .then(() => {
                db.transaction.findOne({    
                  where:{    
                    paymentId: paymentId
                  }
                })
                .then((resultTransaction) => {
                  console.log("transakti", resultTransaction)
                  if(resultTransaction === null){
                    console.log("asd")
                    db.topup.findOne({
                      // include:[
                      //   {all:true}
                      // ],
                      where:{
                        paymentId: paymentId
                      }
                    })
                    .then((resultTopUp)=>{
                      console.log("resulttopup", resultTopUp)
                      db.user.findOne({
                        where:{
                          id: userId
                        }
                      })
                      .then((resultUser) => {
                        console.log('aaaa',resultUser.firstName)
                        db.user.update({
                          aldinKeys: resultUser.aladinKeys + resultTopUp.keys.keyAmount
                        })
                        .then((result) => {
                          console.log ('top up aladin keys berhasil')
                          res.send(result)
                        })
                        .catch(error => res.status(400).send(error));
                      })
                      .catch(error => res.status(400).send(error));
                    })
                    .catch(error => res.status(400).send(error));
                  } else {
                    db.transaction.update({
                      status: req.body.status
                    },{
                      where:{
                        paymentId: paymentId
                      }
                    })
                    .then((dataTransaction) => {
                      console.log("update status transaksi")
                      //TODO: POST TO API PULSA.                                                 
                      res.send(dataTransaction)
                    })
                    .catch(error => res.status(400).send(error));
                  }
                })
                .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
            } else {
              console.log("'if' ga jalan, jdi kluar body")
              return res.send(body)
            }
          }})
          .catch(error => res.status(400).send(error)); 
        } else {
            return res.status(500).send('Invalid Credentials')
        }

    // Contoh payload yang dikirim dari xendit:
    // {
    //   id: "579c8d61f23fa4ca35e52da4",
    //   user_id: "5781d19b2e2385880609791c",
    //   external_id: "invoice_123124123",
    //   is_high: true,
    //   status: "COMPLETED",
    //   merchant_name: "Xendit",
    //   amount: 50000,
    //   payer_email: "albert@xendit.co",
    //   description: "This is a description",
    //   fees_paid_amount: 2500,
    //   paid_amount: 50000,
    //   payment_method: "POOL",
    //   bank_code: "BCA",
    //   adjusted_received_amount: 47500,
    //   updated: "2016-10-10T08:15:03.404Z",
    //   created: "2016-10-10T08:15:03.404Z"
  }, 
}