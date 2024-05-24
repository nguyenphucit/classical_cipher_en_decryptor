import { NumberToChar } from "../helper/Helper";

export const EncryptVigenereBlock=(messages,lenK,Key)=>{
    const block=messages.toUpperCase();
    let cipher=""
    for (var i = 0; i < block.length; i++) {
        var j = i % lenK;
        if (block[i] === " ") cipher += " ";
        else {
         let key=isNaN(Key[j])?Key.charCodeAt(j):NumberToChar(parseInt(Key[j])).charCodeAt(0)
          cipher +=messages[i].toUpperCase()===messages[i] ? String.fromCharCode(
            65 + ((block.charCodeAt(i) - 65 +  key - 65) % 26)
          ).toUpperCase():String.fromCharCode(
            65 + ((block.charCodeAt(i) - 65 +  key - 65) % 26)
          ).toLowerCase()
        }
      }
      return cipher
}

export const DecryptVigenereBlock=(messages,lenK,Key)=>{
  let plain=""
  const block=messages.toUpperCase()
  for (var i = 0; i < block.length; i++) {
    var j = i % lenK;
    let key=isNaN(Key[j])?Key.charCodeAt(j):NumberToChar(parseInt(Key[j])).charCodeAt(0)
    var diff = block.charCodeAt(i) -  key;
    if (block[i] === " ") plain += " ";
    else {
      if (diff >= 0) {
        plain += messages[i]===messages[i].toUpperCase()?String.fromCharCode(65 + (diff % 26)).toUpperCase():String.fromCharCode(65 + (diff % 26)).toLowerCase();
      } else {
        plain += messages[i]===messages[i].toUpperCase()? String.fromCharCode(65 + 26 + (diff % 26)).toUpperCase():String.fromCharCode(65 + 26 + (diff % 26)).toLowerCase();
      }
    }
  }
  return plain
}