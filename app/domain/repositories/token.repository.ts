/**
 * Token Repository Interface
 * Abstracts token storage and retrieval from infrastructure details
 */

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface TokenRepository {
  /**
   * Save token pair to persistent storage
   */
  save(tokens: TokenPair): Promise<void>;

  /**
   * Retrieve token pair from persistent storage
   */
  retrieve(): Promise<TokenPair | null>;

  /**
   * Clear all tokens from persistent storage
   */
  clear(): Promise<void>;

  /**
   * Get only the access token without full pair
   */
  getAccessToken(): Promise<string | null>;

  /**
   * Get only the refresh token without full pair
   */
  getRefreshToken(): Promise<string | null>;
}
