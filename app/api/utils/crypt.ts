const secret = process.env.SECRET ?? "";

const buff_to_base64 = (buff: Uint8Array) =>
	btoa(
		new Uint8Array(buff).reduce(
			(data, byte) => data + String.fromCharCode(byte),
			"",
		),
	);

const base64_to_buf = (
	b64: string, // @ts-expect-error
) => Uint8Array.from(atob(b64), (c, i) => c.charCodeAt(null));

const getPasswordKey = (password: string) =>
	crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
		"deriveKey",
	]);

const enc = new TextEncoder();
const dec = new TextDecoder();

type DeriveKey = Parameters<typeof crypto.subtle.deriveKey>;
const deriveKey = (
	passwordKey: DeriveKey["1"],
	salt: BufferSource,
	keyUsage: DeriveKey["4"],
) =>
	crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 250000,
			hash: "SHA-256",
		},
		passwordKey,
		{ name: "AES-GCM", length: 256 },
		false,
		keyUsage,
	);

export async function encryptData(secretData: string) {
	try {
		const salt = crypto.getRandomValues(new Uint8Array(16));
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const passwordKey = await getPasswordKey(secret);
		const aesKey = await deriveKey(passwordKey, salt, Array.from(["encrypt"]));
		const encryptedContent = await crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv: iv,
			},
			aesKey,
			enc.encode(secretData),
		);

		const encryptedContentArr = new Uint8Array(encryptedContent);
		const buff = new Uint8Array(
			salt.byteLength + iv.byteLength + encryptedContentArr.byteLength,
		);
		buff.set(salt, 0);
		buff.set(iv, salt.byteLength);
		buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
		const base64Buff = buff_to_base64(buff);
		return base64Buff;
	} catch (e) {
		console.log(`Error - ${e}`);
		return "";
	}
}

export async function decryptData(encryptedData: string) {
	try {
		const encryptedDataBuff = base64_to_buf(encryptedData);
		const salt = encryptedDataBuff.slice(0, 16);
		const iv = encryptedDataBuff.slice(16, 16 + 12);
		const data = encryptedDataBuff.slice(16 + 12);
		const passwordKey = await getPasswordKey(secret);
		const aesKey = await deriveKey(passwordKey, salt, Array.from(["decrypt"]));
		const decryptedContent = await crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv: iv,
			},
			aesKey,
			data,
		);
		return dec.decode(decryptedContent);
	} catch (e) {
		console.log(`Error - ${e}`);
		return "";
	}
}
