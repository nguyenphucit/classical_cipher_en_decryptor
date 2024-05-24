import { charToNumber,NumberToChar,inverseMod26 } from "../helper/Helper";
export const hillCipher2x2=(keyMatrix, input)=> {
    const result = [];
    const char1 = charToNumber(input[0].toUpperCase());
    const char2 = charToNumber(input[1].toUpperCase());
    const charArray = [char1, char2];

    for (let i = 0; i < 2; i++) {
        let sum = 0;
        for (let j = 0; j < 2; j++) {
            sum += keyMatrix[j][i] * charArray[j];
        }
        result.push(sum % 26);
    }

    return result.map((item,index)=>{
        if(input[index]===input[index].toUpperCase()){
            return NumberToChar(item).toUpperCase();
        }
        else{
        return NumberToChar(item).toLowerCase();
        }
    }).join('');
}

export const hillDecipher2x2=(keyMatrix, input)=>{
    const result = [];
    const char1 = charToNumber(input[0].toUpperCase());
    const char2 = charToNumber(input[1].toUpperCase());
    const charArray = [char1, char2];

    const determinant = keyMatrix[0][0] * keyMatrix[1][1] - keyMatrix[0][1] * keyMatrix[1][0];
    const keyMatrixInverse = [
        [keyMatrix[1][1], -keyMatrix[0][1]],
        [-keyMatrix[1][0], keyMatrix[0][0]]
    ];

    // Calculate the inverse of the determinant modulo 26
    const detInverse = inverseMod26(determinant);

    for (let i = 0; i < 2; i++) {
        let sum = 0;
        for (let j = 0; j < 2; j++) {
            sum += keyMatrixInverse[j][i] * charArray[j];
        }
        const decryptedChar = (sum * detInverse) % 26;
        result.push((decryptedChar + 26) % 26); // Ensure result is positive modulo 26
    }

    return result.map((item,index)=>{
        if(input[index]===input[index].toUpperCase()){
            return NumberToChar(item).toUpperCase();
        }
        else{
        return NumberToChar(item).toLowerCase();
        }
    }).join('');
}

export const isMatrixInvertible=(matrix)=>{
    if (matrix.length !== 2 || matrix[0].length !== 2 || matrix[1].length !== 2) {
        console.error("Invalid matrix size. Must be a 2x2 matrix.");
        return false;
    }

    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1];

    const determinant =Math.abs(a * d - b * c)%26;
    const accepable=[1,3,5,7,9,11,15,17,19,21,23,25]
    const isInvertible=accepable.find(item=>item===determinant)
    return isInvertible!==undefined
}