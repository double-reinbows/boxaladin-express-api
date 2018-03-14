
const md5 = require('js-md5')

let randomSort = (a, b) => {
  return Math.random() > .5 ? -1 : 1
}

let replace = string => {
  let result = ''
  const replacement = {
    1: '2',
    2: '3',
    3: '4',
    4: '5',
    5: '6',
    a: 'b',
    b: 'c',
    c: 'd'
  }

  for (var i = 0; i <= string.length - 1; i++) {
    if (replacement.hasOwnProperty(string[i])) result += replacement[string[i]]
    else result += string[i]
  }

  return result
}

let hasher = pass => {
  const str = "0123456789abcdefghijklmnopqrstuvwxysABCDEFGHIJKLMNOPQRSTUVWXYZ"

  let capcay = str.repeat(5).split('').sort(randomSort).join('').slice(0, 5)
  let acak = capcay.slice(0, 6)
  let txt_password2 = acak + md5(pass)
  let txt_new_password = replace(txt_password2)

  return txt_new_password
}
module.exports = hasher


/**
 * Kode asli hashing password boxaladin yang lama.
 * Written in PHP.
 * public function createHash($password) {
 * //Commence Boxaladin's weird hashing algorithm... -_-"
 *   $replacements = array('1'=>'2','2'=>'3','3'=>'4','4'=>'5','5'=>'6','a'=>'b','b'=>'c','c'=>'d');
 *   $capcay             = substr(str_shuffle(str_repeat("0123456789abcdefghijklmnopqrstuvwxysABCDEFGHIJKLMNOPQRSTUVWXYZ", 5)), 0, 5);
 *   $acak               = substr($capcay,0,6);
 *   $txt_password2      = $acak.md5($password);  // acak + md5(pass). bukan method chaining
 *   $txt_new_password   = strtr($txt_password2,$replacements);
 *   return $txt_new_password;
 * }
 */
