import * as crypto from 'crypto';

export class DataEncrypter {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly KEY_LENGTH = 32;

  /**
   * Encrypt data using AES-256-GCM
   * @param text - Plain text to encrypt
   * @param secretKey - Encryption key (32 bytes recommended)
   * @returns Encrypted string in format: iv:authTag:encryptedData
   */
  static encrypt(text: string, secretKey: string): string {
    // Derive a proper key from the secret
    const key = crypto.scryptSync(secretKey, 'salt', this.KEY_LENGTH);
    const iv = crypto.randomBytes(this.IV_LENGTH);
    
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt data encrypted with encrypt method
   * @param encryptedText - Encrypted text from encrypt method
   * @param secretKey - Same key used for encryption
   * @returns Decrypted plain text
   */
  static decrypt(encryptedText: string, secretKey: string): string {
    try {
      const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
      
      if (!ivHex || !authTagHex || !encrypted) {
        throw new Error('Invalid encrypted text format');
      }

      const key = crypto.scryptSync(secretKey, 'salt', this.KEY_LENGTH);
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${(error as Error).message}`);
    }
  }
}