import React, { useContext } from "react";
import "./style.scss";
import { useState, useEffect } from "react";
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";
import {
  charToNumber,
  modInverse,
  checkCharPosition,
  isStringContainsAllLetters,
} from "../../helper/Helper";
import {
  hillCipher2x2,
  hillDecipher2x2,
  isMatrixInvertible,
} from "../../CipherCode/Hill";
import {
  DecryptVigenereBlock,
  EncryptVigenereBlock,
} from "../../CipherCode/Vigenere";

import { isPrimeWithM } from "../../CipherCode/Affine";
import { AppContext } from "../../Provider/AppProvider";
export const Encryptor = () => {
  const { PlainText, CipherText, setPlainText, setCipherText } =
    useContext(AppContext);
  const [Key, setKey] = useState("");
  const [KeyA, setKeyA] = useState("");
  const [KeyB, setKeyB] = useState("");
  const [HillKey1, setHillKey1] = useState("");
  const [HillKey2, setHillKey2] = useState("");
  const [HillKey3, setHillKey3] = useState("");
  const [HillKey4, setHillKey4] = useState("");
  const [Cipher, setCipher] = useState("Caesar Cipher");
  const [KeyForm, setKeyForm] = useState(false);
  const [isDecrypt, setisDecrypt] = useState(() => false);
  const [lastDigitOfOddHill, setlastDigitOfOddHill] = useState();
  //-----------------------CAESAR CIPHER-----------------------//
  const EncryptCaesar = () => {
    if (Key.trim().replaceAll(" ", "") === "") {
      alert("vui lòng nhập khóa");
      return;
    }
    let plaintext = PlainText;
    let key;
    if (isNaN(Key)) key = charToNumber(Key.toUpperCase());
    else key = Key;

    let shift = Number(key);
    shift = shift % 26;
    let Ciphertxt = "";

    for (let i = 0; i < plaintext.length; i++) {
      let char = plaintext[i];

      if (char.match(/[a-z]/i)) {
        // Check nếu là chữ cái
        let charCode = plaintext.charCodeAt(i);

        if (charCode >= 65 && charCode <= 90) {
          // Nếu là chữ cái in hoa
          Ciphertxt += String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
        } else if (charCode >= 97 && charCode <= 122) {
          // Nếu là chữ cái in thường
          Ciphertxt += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
        }
      } else {
        // Nếu không phải là chữ cái, giữ nguyên
        Ciphertxt += char;
      }
    }
    setCipherText(() => Ciphertxt);
  };

  const DecryptCaesar = () => {
    let decryptedText = "";
    if (Key === " ") {
      alert("vui lòng nhập khóa");
      return;
    }
    let key;
    if (isNaN(Key)) key = charToNumber(Key.toUpperCase());
    else key = Key;

    let shift = Number(key);
    shift = shift % 26;
    // shift = shift % 26;
    for (let i = 0; i < PlainText.length; i++) {
      let char = PlainText[i];

      if (char.match(/[a-z]/i)) {
        // Check nếu là chữ cái
        let charCode = PlainText.charCodeAt(i);

        if (charCode >= 65 && charCode <= 90) {
          // Nếu là chữ cái in hoa
          let decryptedCharCode = ((charCode - 65 - shift + 26) % 26) + 65;
          decryptedText += String.fromCharCode(decryptedCharCode);
        } else if (charCode >= 97 && charCode <= 122) {
          // Nếu là chữ cái in thường
          let decryptedCharCode = ((charCode - 97 - shift + 26) % 26) + 97;
          decryptedText += String.fromCharCode(decryptedCharCode);
        }
      } else {
        // Nếu không phải là chữ cái, giữ nguyên
        decryptedText += char;
      }
    }
    setCipherText(decryptedText);
  };
  //-------------------------SUBSTITUTION CIPHER----------------------//
  const EncryptSubstitution = () => {
    let encryptedText = "";
    if (Key.trim().replaceAll(" ", "").length !== 26) {
      alert("key không hợp lệ ( phải đúng 26 kí tự) ");
      return;
    }
    if (!isStringContainsAllLetters(Key)) {
      alert("key không hợp lệ ( chưa đủ 26 chữ trong bảng chữ cái)");
      return;
    }
    const shift = Key.trim().replaceAll(" ", "").toUpperCase();

    for (let i = 0; i < PlainText.length; i++) {
      if (/[a-zA-Z]/.test(PlainText[i])) {
        const position = checkCharPosition(PlainText[i]);
        encryptedText +=
          PlainText[i] === PlainText[i].toUpperCase()
            ? shift[position]
            : shift[position].toLowerCase();
      } else {
        encryptedText += PlainText[i];
      }
    }
    setCipherText(encryptedText);
  };

  const DecryptSubstitution = () => {
    let decryptedText = "";
    if (Key.trim().replaceAll(" ", "").length !== 26) {
      alert("key không hợp lệ ( phải đúng 26 kí tự) ");
      return;
    }
    if (!isStringContainsAllLetters(Key)) {
      alert("key không hợp lệ ( chưa đủ 26 chữ trong bảng chữ cái)");
      return;
    }
    const shift = Key.trim().replaceAll(" ", "").toUpperCase();

    for (let i = 0; i < PlainText.length; i++) {
      // nếu kí tự là chữ cái
      if (/[a-zA-Z]/.test(PlainText[i])) {
        const position = shift.indexOf(PlainText[i].toUpperCase());
        decryptedText +=
          PlainText[i] === PlainText[i].toUpperCase()
            ? String.fromCharCode(position + "A".charCodeAt(0))
            : String.fromCharCode(position + "a".charCodeAt(0));
      }
      // nếu kí tự không phải là chữ cái
      else {
        decryptedText += PlainText[i];
      }
    }
    setCipherText(decryptedText);
  };

  //-------------------------AFFINE CIPHER---------------------------//
  const EncryptAffine = () => {
    if (KeyA.length === 0 || KeyB.length === 0) {
      alert("vui lòng nhập key");
      return;
    }
    let keyA = KeyA;
    let keyB = KeyB;
    if (isNaN(parseInt(KeyA))) {
      keyA = charToNumber(KeyA[0].toUpperCase());
    }
    if (isNaN(parseInt(KeyB))) {
      keyB = charToNumber(KeyB[0].toUpperCase());
    }

    if (!isPrimeWithM(keyA, 26)) {
      alert("khóa A phải nguyên tố cùng nhau với 26");
      return false;
    }

    let encryptedMessage = "";
    const message = PlainText;

    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      if (/[A-Za-z]/.test(char)) {
        const charValue = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const encryptedValue =
          (parseInt(keyA) * charValue + parseInt(keyB)) % 26;
        const encryptedChar = String.fromCharCode(
          encryptedValue + "A".charCodeAt(0)
        );
        encryptedMessage +=
          char === char.toUpperCase()
            ? encryptedChar
            : encryptedChar.toLowerCase();
      } else {
        encryptedMessage += char;
      }
    }
    setCipherText((prev) => {
      return encryptedMessage;
    });
  };
  const DecryptAffine = () => {
    if (KeyA.length === 0 || KeyB.length === 0) {
      alert("vui lòng nhập key");
      return;
    }
    let keyA = KeyA;
    let keyB = KeyB;
    if (isNaN(parseInt(keyA))) {
      keyA = charToNumber(KeyA[0].toUpperCase());
    }
    if (isNaN(parseInt(KeyB))) {
      keyB = charToNumber(KeyB[0].toUpperCase()) % 26;
    }

    if (!isPrimeWithM(KeyA, 26)) {
      alert("khóa A phải nguyên tố cùng nhau với 26");
      return false;
    }

    let decryptedMessage = "";
    const message = PlainText;
    for (let i = 0; i < message.length; i++) {
      const char = message[i];
      if (/[A-Za-z]/.test(char)) {
        const charValue = char.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
        const decryptedValue =
          ((charValue - keyB + 26) * modInverse(keyA, 26)) % 26;
        const decryptedChar = String.fromCharCode(
          decryptedValue + "A".charCodeAt(0)
        );
        decryptedMessage +=
          char === char.toUpperCase()
            ? decryptedChar
            : decryptedChar.toLowerCase();
      } else {
        // Bỏ qua các ký tự không phải chữ cái
        decryptedMessage += char;
      }
    }

    setCipherText(decryptedMessage);
  };
  //-----------------------VIGENERE CIPHER-------------------------//
  const EncryptVigenere = () => {
    const messages = PlainText.trim().replaceAll(" ", "");
    const lenK = Key.trim().replaceAll(" ", "").length;
    const regex = new RegExp(`.{1,${lenK}}`, "g");
    const blocks = messages.match(regex);

    const allSpace = [];
    PlainText.trim()
      .split("")
      .forEach((item, index) => {
        if (item === " ") allSpace.push(index);
      });

    let encryptedText = [];
    for (const block of blocks) {
      encryptedText.push(
        EncryptVigenereBlock(
          block,
          lenK,
          Key.trim().replaceAll(" ", "").toUpperCase()
        )
      );
    }
    let cipher = encryptedText.join("");

    allSpace.forEach((item) => {
      cipher = cipher.slice(0, item) + " " + cipher.slice(item, cipher.length);
    });

    setCipherText(() => cipher);
  };

  const DecryptVigenere = () => {
    const messages = PlainText.trim().replaceAll(" ", "");
    const lenK = Key.trim().replaceAll(" ", "").length;
    const regex = new RegExp(`.{1,${lenK}}`, "g");
    const blocks = messages.match(regex);

    const allSpace = [];
    PlainText.trim()
      .split("")
      .forEach((item, index) => {
        if (item === " ") allSpace.push(index);
      });

    let decryptedText = [];
    for (const block of blocks) {
      decryptedText.push(
        DecryptVigenereBlock(
          block,
          lenK,
          Key.trim().replaceAll(" ", "").toUpperCase()
        )
      );
    }

    let plain = decryptedText.join("");

    allSpace.forEach((item) => {
      plain = plain.slice(0, item) + " " + plain.slice(item, plain.length);
    });

    setCipherText(() => plain);
  };
  //-----------------------HILL CIPHER-----------------------------//
  const EncryptHillCipher = () => {
    let message;
    let isOdd = false;
    if (PlainText.trim().replaceAll(" ", "").length % 2 !== 0) {
      // alert("vui lòng nhập số lượng ký tự chẵn cho bản rõ");
      // return;
      isOdd = true;
    }
    if (isOdd) message = PlainText.trim().replaceAll(" ", "") + "z";
    else message = PlainText.trim().replaceAll(" ", "");
    const allSpace = [];
    PlainText.trim()
      .split("")
      .forEach((item, index) => {
        if (item === " ") allSpace.push(index);
      });
    const keyMatrix = [
      [
        isNaN(HillKey1)
          ? charToNumber(HillKey1.toUpperCase())
          : parseInt(HillKey1),
        isNaN(HillKey2)
          ? charToNumber(HillKey2.toUpperCase())
          : parseInt(HillKey2),
      ],
      [
        isNaN(HillKey3)
          ? charToNumber(HillKey3.toUpperCase())
          : parseInt(HillKey3),
        isNaN(HillKey4)
          ? charToNumber(HillKey4.toUpperCase())
          : parseInt(HillKey4),
      ],
    ];

    if (!isMatrixInvertible(keyMatrix)) {
      alert("ma trận khóa không hợp lệ,vui lòng nhập lại");
      return;
    }

    // tách bản rõ ra thành các khối 2 ký tự
    const blocks = message.match(/.{1,2}/g);

    if (!blocks) {
      alert("Thông điệp quá ngắn để chia thành các khối 2 ký tự.");
      return;
    }

    if (blocks[blocks.length - 1].length % 2 !== 0) {
      alert("Thông điệp lẻ, không thể để chia thành các khối 2 ký tự.");
      return;
    }

    const encryptedBlocks = [];

    for (const block of blocks) {
      const encryptedBlock = hillCipher2x2(keyMatrix, block);
      encryptedBlocks.push(encryptedBlock);
    }

    let encryptedMessage = encryptedBlocks.join("");
    let getLastDigit = encryptedMessage;
    setlastDigitOfOddHill(() => getLastDigit);

    if (isOdd) encryptedMessage = encryptedMessage.slice(0, -1);
    allSpace.forEach((item) => {
      encryptedMessage =
        encryptedMessage.slice(0, item) +
        " " +
        encryptedMessage.slice(item, encryptedMessage.length);
    });
    setCipherText(() => encryptedMessage);
  };

  const DecryptHillCipher = () => {
    // const encryptedMessage = PlainText.trim().replaceAll(" ", "");

    let isOdd = false;
    let encryptedMessage;
    if (PlainText.trim().replaceAll(" ", "").length % 2 !== 0) {
      // alert("vui lòng nhập số lượng ký tự chẵn cho bản rõ");
      // return;
      isOdd = true;
    }
    // console.log(lastDigitOfOddHill);
    if (isOdd)
      encryptedMessage =
        PlainText.trim().replaceAll(" ", "") +
        lastDigitOfOddHill[lastDigitOfOddHill.length - 1];
    else encryptedMessage = PlainText.trim().replaceAll(" ", "");

    const allSpace = [];
    PlainText.trim()
      .split("")
      .forEach((item, index) => {
        if (item === " ") allSpace.push(index);
      });

    const keyMatrix = [
      [
        isNaN(HillKey1)
          ? charToNumber(HillKey1.toUpperCase())
          : parseInt(HillKey1),
        isNaN(HillKey2)
          ? charToNumber(HillKey2.toUpperCase())
          : parseInt(HillKey2),
      ],
      [
        isNaN(HillKey3)
          ? charToNumber(HillKey3.toUpperCase())
          : parseInt(HillKey3),
        isNaN(HillKey4)
          ? charToNumber(HillKey4.toUpperCase())
          : parseInt(HillKey4),
      ],
    ];
    if (!isMatrixInvertible(keyMatrix)) {
      alert("ma trận khóa không hợp lệ,vui lòng nhập lại");
      return;
    }
    const blocks = encryptedMessage.match(/.{1,2}/g);
    if (!blocks) {
      alert("Thông điệp quá ngắn để chia thành các khối 2 ký tự.");
      return;
    }

    const decryptedBlocks = [];
    for (const block of blocks) {
      const decryptedBlock = hillDecipher2x2(keyMatrix, block);
      decryptedBlocks.push(decryptedBlock);
    }

    let decryptedMessage = decryptedBlocks.join("");
    allSpace.forEach((item) => {
      decryptedMessage =
        decryptedMessage.slice(0, item) +
        " " +
        decryptedMessage.slice(item, decryptedMessage.length);
    });

    if (isOdd) decryptedMessage = decryptedMessage.slice(0, -1);

    setCipherText(() => decryptedMessage);
  };
  //----------------------HANDLE ENCRYPT-DECRYPT-------------------//
  const handleEncrypt = () => {
    if (Cipher === "Caesar Cipher" && !isDecrypt) EncryptCaesar();
    else if (Cipher === "Caesar Cipher" && isDecrypt) DecryptCaesar();

    if (Cipher === "Substitution Cipher" && !isDecrypt) EncryptSubstitution();
    else if (Cipher === "Substitution Cipher" && isDecrypt)
      DecryptSubstitution();

    if (Cipher === "Apphin Cipher" && !isDecrypt) EncryptAffine();
    else if (Cipher === "Apphin Cipher" && isDecrypt) DecryptAffine();

    if (Cipher === "Hill Cipher" && !isDecrypt) EncryptHillCipher();
    else if (Cipher === "Hill Cipher" && isDecrypt) DecryptHillCipher();

    if (Cipher === "Vigenere Cipher" && !isDecrypt) EncryptVigenere();
    else if (Cipher === "Vigenere Cipher" && isDecrypt) DecryptVigenere();
  };

  //-------------------GENERATE KEY FOR SUBSTITUTION CIPHER------------------//
  const shuffleArray = () => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    setKey(characters.join(""));
  };

  useEffect(() => {
    if (Cipher === "Substitution Cipher") {
      shuffleArray();
      setKeyForm(true);
    } else {
      setKey("");
      setKeyForm(false);
    }
    return () => {};
  }, [Cipher]);

  const swapRole = (e) => {
    e.preventDefault();
    setisDecrypt((prev) => !prev);
    const currentPlainText = PlainText;
    const currentCipherText = CipherText;
    setCipherText(currentPlainText);
    setPlainText(currentCipherText);
  };
  const reset = () => {
    setCipherText("");
    setKey("");
    setPlainText("");
  };
  return (
    <div className="cryptorTool">
      <div className="wrapper">
        <div className="container">
          <div className="formwrapper">
            <div className="column">
              <form className="box" id="form1">
                <h2 className="encryptTitle">
                  {isDecrypt ? "Decryptor" : "Ecryptor"}
                </h2>
                <div className="field">
                  <label
                    className="label"
                    style={{ color: "#363636", fontWeight: "500" }}
                  >
                    {isDecrypt ? "Cipher Text" : "Plain Text"}
                  </label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      id="encryptPlainText"
                      placeholder={
                        Cipher === "Hill Cipher"
                          ? "Please enter Plain Text with even digits, Ex:HELP, HELPER"
                          : "Enter Plain Text"
                      }
                      value={PlainText}
                      onChange={(e) => setPlainText(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div
                  className="field"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className="keyWrap">
                    {Cipher !== "Apphin Cipher" ? (
                      Cipher === "Hill Cipher" ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            width: "50%",
                            alignItems: "center",
                            padding: "5px",
                          }}
                        >
                          <input
                            type="text"
                            className="HillKey"
                            placeholder="[0][0]"
                            value={HillKey1}
                            onChange={(e) => {
                              if (!isNaN(e.target.value))
                                setHillKey1(e.target.value);
                              else {
                                setHillKey1(e.target.value);
                                if (e.target.value.length >= 2) {
                                  if (
                                    parseInt(e.target.value).toString().length >
                                      0 &&
                                    parseInt(e.target.value).toString() !==
                                      "NaN"
                                  )
                                    setHillKey1(parseInt(e.target.value));
                                  else {
                                    setHillKey1(e.target.value[0]);
                                  }
                                }
                              }
                            }}
                          />
                          <input
                            type="text"
                            className="HillKey"
                            value={HillKey2}
                            placeholder="[0][1]"
                            onChange={(e) => {
                              if (!isNaN(e.target.value))
                                setHillKey2(e.target.value);
                              else {
                                setHillKey2(e.target.value);
                                if (e.target.value.length >= 2) {
                                  if (
                                    parseInt(e.target.value).toString().length >
                                      0 &&
                                    parseInt(e.target.value).toString() !==
                                      "NaN"
                                  )
                                    setHillKey2(parseInt(e.target.value));
                                  else {
                                    setHillKey2(e.target.value[0]);
                                  }
                                }
                              }
                            }}
                          />
                          <input
                            type="text"
                            className="HillKey"
                            value={HillKey3}
                            placeholder="[1][0]"
                            onChange={(e) => {
                              if (!isNaN(e.target.value))
                                setHillKey3(e.target.value);
                              else {
                                setHillKey3(e.target.value);
                                if (e.target.value.length >= 2) {
                                  if (
                                    parseInt(e.target.value).toString().length >
                                      0 &&
                                    parseInt(e.target.value).toString() !==
                                      "NaN"
                                  )
                                    setHillKey3(parseInt(e.target.value));
                                  else {
                                    setHillKey3(e.target.value[0]);
                                  }
                                }
                              }
                            }}
                          />
                          <input
                            type="text"
                            className="HillKey"
                            value={HillKey4}
                            placeholder="[1][1]"
                            onChange={(e) => {
                              if (!isNaN(e.target.value))
                                setHillKey4(e.target.value);
                              else {
                                setHillKey4(e.target.value);
                                if (e.target.value.length >= 2) {
                                  if (
                                    parseInt(e.target.value).toString().length >
                                      0 &&
                                    parseInt(e.target.value).toString() !==
                                      "NaN"
                                  )
                                    setHillKey4(parseInt(e.target.value));
                                  else {
                                    setHillKey4(e.target.value[0]);
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          id="encryptKey"
                          placeholder="Please enter your Key"
                          value={Key}
                          onChange={(e) => {
                            if (Cipher === "Caesar Cipher") {
                              if (!isNaN(e.target.value))
                                setKey(e.target.value);
                              else {
                                setKey(e.target.value);
                                if (e.target.value.length >= 2) {
                                  if (
                                    parseInt(e.target.value).toString().length >
                                      0 &&
                                    parseInt(e.target.value).toString() !==
                                      "NaN"
                                  )
                                    setKey(parseInt(e.target.value));
                                  else {
                                    setKey(e.target.value[0]);
                                  }
                                }
                              }
                            } else {
                              setKey(e.target.value);
                            }
                          }}
                        />
                      )
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="key a"
                          style={{
                            padding: "5px",
                            border: "none",
                            outline: "none",
                            borderBottom: "1px solid #333333",
                            width: "40px",
                            marginRight: "10px",
                          }}
                          value={KeyA}
                          onChange={(e) => {
                            if (!isNaN(e.target.value)) setKeyA(e.target.value);
                            else {
                              setKeyA(e.target.value);
                              if (e.target.value.length >= 2) {
                                if (
                                  parseInt(e.target.value).toString().length >
                                    0 &&
                                  parseInt(e.target.value).toString() !== "NaN"
                                )
                                  setKeyA(parseInt(e.target.value));
                                else {
                                  setKeyA(e.target.value[0]);
                                }
                              }
                            }
                          }}
                        />
                        <input
                          type="text"
                          placeholder="key b"
                          style={{
                            padding: "5px",
                            border: "none",
                            outline: "none",
                            borderBottom: "1px solid #333333",
                            width: "40px",
                            marginRight: "10px",
                          }}
                          value={KeyB}
                          onChange={(e) => {
                            if (!isNaN(e.target.value)) setKeyB(e.target.value);
                            else {
                              setKeyB(e.target.value);
                              if (e.target.value.length >= 2) {
                                if (
                                  parseInt(e.target.value).toString().length >
                                    0 &&
                                  parseInt(e.target.value).toString() !== "NaN"
                                )
                                  setKeyB(parseInt(e.target.value));
                                else {
                                  setKeyB(e.target.value[0]);
                                }
                              }
                            }
                          }}
                        />
                      </>
                    )}
                  </div>
                  {KeyForm ? (
                    <button
                      className="keyGenerate"
                      style={{ flex: "1" }}
                      onClick={(e) => {
                        e.preventDefault();
                        shuffleArray();
                      }}
                    >
                      Generate Key
                    </button>
                  ) : null}
                </div>
                <div className="columns">
                  <div className="column">
                    <div className="select-wrapper">
                      <select
                        id="encyrptChoice"
                        onChange={(e) => {
                          setCipher(e.target.value);
                        }}
                      >
                        <option>Caesar Cipher</option>
                        <option>Hill Cipher</option>
                        <option>Substitution Cipher</option>
                        <option>Apphin Cipher</option>
                        <option>Vigenere Cipher</option>
                      </select>
                    </div>
                  </div>
                  <div className="column">
                    <button
                      type="button"
                      className="button is-primary"
                      onClick={handleEncrypt}
                    >
                      {isDecrypt ? "Decrypt" : "Encrypt"}
                    </button>
                  </div>
                  <div className="column">
                    <button className="swap" onClick={(e) => swapRole(e)}>
                      <SwapVerticalCircleIcon style={{ fontSize: "50px" }} />
                    </button>
                  </div>
                </div>
                <div className="field" style={{ marginTop: "20px" }}>
                  <label
                    className="label"
                    style={{ color: "#363636", fontWeight: "500" }}
                  >
                    {isDecrypt ? "Plain Text" : "Cipher Text"}
                  </label>
                  <div className="control">
                    <textarea
                      className="textarea"
                      id="encryptCipherText"
                      placeholder="Output Cipher Text"
                      value={CipherText}
                      onChange={(e) => setCipherText(e.target.value)}
                      style={{ height: "100px", borderRadius: "6px" }}
                    ></textarea>
                    <button
                      type="button"
                      className="buttonReset"
                      onClick={reset}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
