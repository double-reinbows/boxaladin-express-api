module.exports = {

  genRandomString: (length) => {
    var token = ''
    var alp = 'abcdeghijklmnopqrstuvwxyzABCDEFIJKLMNOPQRSTUVWXYZ0123456789'
  
    for (var i=0; i<length; i++) {
      token += alp[Math.floor(Math.random() * (alp.length-1))]
    }
    
    return token
  }

}