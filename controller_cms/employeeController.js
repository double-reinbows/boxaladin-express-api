const model = require('../models')
const hasher = require('../helpers/aladin_hash')
const {
  genRandomString
} = require('../helpers/string')

module.exports = {

  /* function ini terima create dan penambahan wallet khusus karyawan ,
   * sebelum create, function ini akan cek apakah ada karyawan yang terdaftar atau belum
   * kalau sudah ada karyawan yang terdaftar maka endpoint ini tidak akan create karyawan
   * penambahan 'EMPLOYEE' di column role agar mempermudah untuk melihat list karyawan
   * email dan primary phonenumber sudah otomatis TRUE ketika karyawan sudah berhasil di buat
   */

  createEmployee: (req, res) => {
    model.user.findOne({
      where: {
        email: req.body.email
      }
    })
    .then(result => {
      if (!result) {
        model.user.create({
          email: req.body.email,
          emailVerified: true,
          emailToken: genRandomString(128),
          typedEmail: req.body.typedEmail,
          username: req.body.username,
          firstName: req.body.firstName,
          aladinKeys: 0,
          wallet: 0,
          coin: 0,
          password: hasher(req.body.password),
          role: 'EMPLOYEE',
          salt: 0,
        })
        .then(result => {
          model.phonenumber.create({
            userId: result.id,
            number: req.body.phonenumber,
            verified: true,
            otp: 0,
            primary: true,
          })
          model.payment.create({
            invoiceId: result.id,
            xenditId: 'ADMIN',
            status: 'EMPLOYEE',
            amount: req.body.amount,
            availableBanks: `Note : ${req.body.note ? req.body.note : 'No Note'}`,
            expiredAt: new Date()
          })
          .then(dataPayment => {
            if (req.body.amount > 0) {
              model.walletLog.create({
                userId: result.id,
                paymentId: dataPayment.id,
                virtualId: 0,
                amount: dataPayment.amount,
                status: 'PAID'
              })
              .then(dataWalletlog => {
                model.user.update({
                  wallet: parseInt(result.wallet) + parseInt(dataWalletlog.amount) || result.wallet
                }, {
                  where: {
                    id: result.id
                  }
                })
                return res.send({
                  message: 'success',
                  data: result,
                  phone: dataPhone
                })
              })
            } else {
              res.send('wallet is not updated')
            }
          })
        })
      } else {
        return res.send('email is exits');
      }
    }).catch(err => {
      return res.send(err)
    })
  },

  /* function ini akan menampilkan semua karyawan yang terdaftar,
   * karyawan akan di urutkan berdasarkan jumlah wallet mulai dari TERBESAR sampai TERKECIL
   */

  findAllEmployee: (req, res) => {
    model.user.findAll({
        order: [
          ['wallet', 'DESC']
        ],
        include: {
          model: model.phonenumber,
          as: 'phonenumbers'
        },
        where: {
          role: 'EMPLOYEE'
        }
      }).then(dataUser => {
        res.send(dataUser)
      })
      .catch(err => console.log(err))
  },

  /* function ini digunakan untuk menghapus 1 user atau karyawan,
   * function akan sekaligus menghapus user / karyawan dan nomor handphone
   */

  deleteEmployee: (req, res) => {
    const deleteEmployee = model.user.destroy({
      where: {
        id: req.params.id
      }
    })

    const deletePhoneNumber = model.phonenumber.destroy({
      where: {
        userId: req.params.id
      }
    })

    res.send(`employee deleted`);;
  }
}
