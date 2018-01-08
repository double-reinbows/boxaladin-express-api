let keygen = () => {
  let key = '';

  while (key.length < 8) {
    let rand = Math.ceil(Math.random() * 3)
    let rand2 = Math.ceil(Math.random() * 26)

    if (rand == 1) key += Math.floor(Math.random()*10)
    else if (rand == 2) key += String.fromCharCode(64 + rand2)
    else key += String.fromCharCode(96 + rand2)
  }

  return key
}

module.exports = keygen;
