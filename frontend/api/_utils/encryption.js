import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes is standard for GCM

function getKey() {
    const keyString = process.env.SETTINGS_ENCRYPTION_KEY;
    if (!keyString) {
        throw new Error('SETTINGS_ENCRYPTION_KEY is not set in environment variables');
    }
    // Convert hex string to buffer
    const key = Buffer.from(keyString, 'hex');
    if (key.length !== 32) {
        throw new Error('SETTINGS_ENCRYPTION_KEY must be 32 bytes (64 hex characters) for aes-256-gcm');
    }
    return key;
}

export function encrypt(text) {
    if (!text) return text;
    
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag().toString('hex');
        
        // Return iv:authTag:encrypted
        return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (err) {
        console.error("Encryption failed:", err);
        return text; // fallback to plaintext if encryption completely fails (or throw)
    }
}

export function decrypt(encryptedData) {
    if (!encryptedData || typeof encryptedData !== 'string') return encryptedData;
    
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
        // Not encrypted in the expected format, return as is (could be legacy plaintext)
        return encryptedData;
    }
    
    try {
        const [ivHex, authTagHex, encryptedText] = parts;
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');
        
        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (err) {
        console.error("Decryption failed:", err);
        return null; // Return null on failed decryption to avoid returning garbage
    }
}
