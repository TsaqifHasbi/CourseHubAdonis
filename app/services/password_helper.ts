/**
 * Helper functions for password management
 * Support for both bcrypt and scrypt hash verification
 */
import bcrypt from 'bcrypt'

/**
 * Check if a hash is in bcrypt format
 * @param hash The password hash to check
 */
export function isBcryptHash(hash: string): boolean {
  return hash.startsWith('$2y$') || hash.startsWith('$2a$') || hash.startsWith('$2b$')
}

/**
 * Verify a password against a bcrypt hash
 * @param hashedPassword The bcrypt password hash
 * @param plainPassword The plain password to verify
 */
export async function verifyBcryptPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
  try {
    // Convert $2y$ format (PHP format) to $2a$ format (Node.js format) if needed
    const nodeCompatibleHash = hashedPassword.startsWith('$2y$') 
      ? hashedPassword.replace('$2y$', '$2a$')
      : hashedPassword

    // Use bcrypt to verify the password
    return await bcrypt.compare(plainPassword, nodeCompatibleHash)
  } catch (error) {
    console.error('bcrypt verification error:', error)
    return false
  }
}

/**
 * Get the hash algorithm based on the hash format
 * @param hash The password hash
 */
export function getHashAlgorithm(hash: string): 'bcrypt' | 'scrypt' | 'unknown' {
  if (isBcryptHash(hash)) {
    return 'bcrypt'
  } else if (hash.includes('scrypt')) {
    return 'scrypt'
  } else {
    return 'unknown'
  }
}
