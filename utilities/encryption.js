// import CryptoJS from 'crypto-js';
//
// export function encryptString(string) {
// 	const secret = CryptoJS.enc.Utf8.parse(process.env.PHONE_KEY);
// 	const salt = CryptoJS.enc.Base64.parse(process.env.PHONE_SALT);
// 	const iv = CryptoJS.enc.Base64.parse(process.env.PHONE_IV);
//
// 	return CryptoJS.AES.encrypt(string, secret, { salt: salt, iv: iv }).toString();
// }
//
// export function decryptString(cipherText) {
// 	const secret = CryptoJS.enc.Utf8.parse(process.env.PHONE_KEY);
// 	const salt = CryptoJS.enc.Base64.parse(process.env.PHONE_SALT);
// 	const iv = CryptoJS.enc.Base64.parse(process.env.PHONE_IV);
//
// 	return CryptoJS.AES.decrypt(cipherText, secret, { salt: salt, iv: iv }).toString(CryptoJS.enc.Utf8);
// }
