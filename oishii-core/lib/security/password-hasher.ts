import * as crypto from 'crypto';

export class PasswordHasher {
  private static readonly SALT_LENGTH = 16;
  private static readonly PBKDF2_ITERATIONS = 100000;
  private static readonly HASH_ALGORITHM = 'sha512';

  /**
   * Generate a secure password hash using PBKDF2
   * @param password - Plain text password
   * @param saltRounds - Optional custom salt (for verification)
   * @returns Hash string in format: salt$hash
   */
  static hash(password: string, saltRounds?: Buffer): string {
    const salt = saltRounds || crypto.randomBytes(this.SALT_LENGTH);
    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      this.PBKDF2_ITERATIONS,
      64,
      this.HASH_ALGORITHM
    );

    return `${salt.toString('hex')}$${hash.toString('hex')}`;
  }

  /**
   * Verify a password against a hash
   * @param password - Plain text password to verify
   * @param hashedPassword - Previously hashed password
   * @returns True if password matches
   */
  static verify(password: string, hashedPassword: string): boolean {
    try {
      const [saltHex] = hashedPassword.split('$');
      const salt = Buffer.from(saltHex, 'hex');
      const newHash = this.hash(password, salt);
      
      return crypto.timingSafeEqual(
        Buffer.from(hashedPassword),
        Buffer.from(newHash)
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a random secure password
   * @param length - Password length (default: 16)
   * @param includeSymbols - Include special characters (default: true)
   * @returns Random password string
   */
  static generatePassword(length: number = 16, includeSymbols: boolean = true): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = lowercase + uppercase + numbers;
    if (includeSymbols) {
      chars += symbols;
    }
    
    let password = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      password += chars[randomBytes[i] % chars.length];
    }
    
    return password;
  }
}