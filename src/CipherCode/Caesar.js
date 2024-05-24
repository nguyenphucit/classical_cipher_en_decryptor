export const caesarDecrypt = (PlainText) => {
    let decryptedText = "";
    for (let i = 0; i < PlainText.length; i++) {
      let char = PlainText[i];
      if (/[a-zA-Z]/.test(char)) {
        const isUpperCase = char === char.toUpperCase();
        char = char.toLowerCase();
        const charCode = char.charCodeAt(0);
        const decryptedCharCode =
          ((charCode - 97 - Number(Key) + 26) % 26) + 97;
        if (isUpperCase) {
          char = String.fromCharCode(decryptedCharCode).toUpperCase();
        } else {
          char = String.fromCharCode(decryptedCharCode);
        }
      }
      decryptedText += char;
    }
    setCipherText(decryptedText);
  };

  export const  encryptcaesar = (PlainText) => {
    let plaintext = PlainText;
    let shift = Number(Key);
    let Ciphertxt = "";
    for (let i = 0; i < plaintext.length; i++) {
      let code = plaintext.charCodeAt(i);

      if (code >= 65 && code <= 65 + 26 - 1) {
        code -= 65;
        code = mod(code + shift, 26);
        code += 65;
      }
      if (code >= 97 && code <= 97 + 26 - 1) {
        code -= 97;
        code = mod(code + shift, 26);
        code += 97;
      }

      Ciphertxt += String.fromCharCode(code);
    }
    setCipherText(() => Ciphertxt);
  };