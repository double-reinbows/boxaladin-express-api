const bankCode = function(bank_code, decoded) {
  if (process.env.ENV !== 'prod') {
    if ( bank_code === 'BRI') {
      return 9999000000 + decoded.id
    } else if ( bank_code === 'MANDIRI') {
      return 9999000000 + decoded.id
    } else if ( bank_code === 'BNI') {
      return 9999000000 + decoded.id
    }
  } else if (process.env.ENV === 'prod') {
    if (bank_code === 'BRI') {
      return  1268000000 + decoded.id
    } else if ( bank_code === 'MANDIRI') {
      return  1268000000 + decoded.id
    } else if ( bank_code === 'BNI') {
      return  126800000000 + decoded.id
    }
  }
}

module.exports = bankCode