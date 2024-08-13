const lowers: string = "abcdefghijklmnopqrstuvwxyz";
const uppers: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers: string = "0123456789";
const symbols: string = "!@#$%^&*()-_=+`~/?.>,<;:'|\"";

function generateRandomString( length: number, includeUpper: boolean, includeLower: boolean, includeNumbers: boolean, includeSymbols: boolean): string{
  let randomString: string = "";

  if (includeUpper) randomString += uppers
  if (includeLower) randomString += lowers
  if (includeNumbers) randomString += numbers
  if (includeSymbols) randomString += symbols

  if (randomString.length < 1) throw new Error("Must include at least one character set");

  let finalString: string = ''

  for ( let i = 0; i < length; i++)
    finalString = finalString + randomString.charAt(Math.random() * (randomString.length))
  return finalString;
}

export function generateEmail(): string {
  return generateRandomString(10, false, true, true, false) + "@modivcare.io"
}