import StellarSdk from '@stellar/stellar-sdk';

// Horizon Server for balance queries
const horizonUrl = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';

// Initialize server - handle both old and new SDK versions
let server;
try {
  // Try new SDK structure first
  if (StellarSdk.Horizon && StellarSdk.Horizon.Server) {
    server = new StellarSdk.Horizon.Server(horizonUrl);
  } else if (StellarSdk.Server) {
    // Fallback to old structure
    server = new StellarSdk.Server(horizonUrl);
  } else {
    // Last resort - try direct instantiation
    const { Server } = StellarSdk;
    if (Server) {
      server = new Server(horizonUrl);
    } else {
      console.error('Could not find Server constructor in Stellar SDK');
      // Create a basic server object using fetch
      server = {
        loadAccount: async (address) => {
          const response = await fetch(`${horizonUrl}/accounts/${address}`);
          if (!response.ok) throw new Error('Account not found');
          return response.json();
        },
        submitTransaction: async (transaction) => {
          const response = await fetch(`${horizonUrl}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `tx=${encodeURIComponent(transaction.toEnvelope().toXDR('base64'))}`
          });
          if (!response.ok) throw new Error('Transaction failed');
          return response.json();
        }
      };
    }
  }
} catch (e) {
  console.error('Failed to initialize Horizon server:', e);
  // Fallback server implementation
  server = {
    loadAccount: async (address) => {
      const response = await fetch(`${horizonUrl}/accounts/${address}`);
      if (!response.ok) {
        if (response.status === 404) {
          const error = new Error('Account not found');
          error.response = { status: 404 };
          throw error;
        }
        throw new Error('Failed to load account');
      }
      return response.json();
    }
  };
}

// Network configuration
const networkPassphrase = import.meta.env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';

/**
 * Get XLM balance for a wallet address
 * @param {string} address - Stellar wallet address
 * @returns {Promise<string>} Balance in XLM
 */
export const getBalance = async (address) => {
  try {
    if (!server) {
      console.error('Server is null, attempting to fetch directly');
      const response = await fetch(`${horizonUrl}/accounts/${address}`);
      if (!response.ok) {
        if (response.status === 404) {
          return '0.0000000';
        }
        throw new Error('Failed to fetch balance');
      }
      const account = await response.json();
      const xlmBalance = account.balances.find(balance => balance.asset_type === 'native');
      return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(7) : '0.0000000';
    }
    
    const account = await server.loadAccount(address);
    const xlmBalance = account.balances.find(balance => balance.asset_type === 'native');
    return xlmBalance ? parseFloat(xlmBalance.balance).toFixed(7) : '0.0000000';
  } catch (error) {
    console.error('Error fetching balance:', error);
    if (error.response && error.response.status === 404) {
      // Account not funded yet
      return '0.0000000';
    }
    throw new Error('Failed to fetch balance. Please try again.');
  }
};

/**
 * Send XLM to a destination address
 * @param {string} sourceAddress - Source wallet address
 * @param {string} destinationAddress - Destination wallet address
 * @param {string} amount - Amount in XLM
 * @param {Function} signTransaction - Freighter signing function
 * @returns {Promise<Object>} Transaction result with hash
 */
export const sendXLM = async (sourceAddress, destinationAddress, amount, signTransaction) => {
  try {
    // Validate addresses
    if (!isValidStellarAddress(destinationAddress)) {
      throw new Error('Invalid destination address format');
    }

    // Load source account
    const sourceAccount = await server.loadAccount(sourceAddress);

    // Build transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: '100000', // 0.01 XLM
      networkPassphrase
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationAddress,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString()
        })
      )
      .setTimeout(180)
      .build();

    // Sign transaction with Freighter
    const signedXDR = await signTransaction(transaction.toXDR(), {
      network: networkPassphrase,
      networkPassphrase,
      accountToSign: sourceAddress
    });

    // Submit transaction
    const transactionResult = await server.submitTransaction(
      StellarSdk.TransactionBuilder.fromXDR(signedXDR, networkPassphrase)
    );

    return {
      success: true,
      hash: transactionResult.hash,
      ledger: transactionResult.ledger
    };
  } catch (error) {
    console.error('Transaction error:', error);
    
    // Handle specific errors
    if (error.message.includes('tx_insufficient_balance')) {
      throw new Error('Insufficient balance to complete transaction');
    } else if (error.message.includes('op_underfunded')) {
      throw new Error('Account does not have enough XLM (minimum 1 XLM reserve required)');
    } else if (error.message.includes('tx_bad_seq')) {
      throw new Error('Transaction sequence error. Please try again.');
    }
    
    throw new Error(error.message || 'Transaction failed. Please try again.');
  }
};

/**
 * Validate Stellar address format
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export const isValidStellarAddress = (address) => {
  try {
    StellarSdk.Keypair.fromPublicKey(address);
    return true;
  } catch {
    return false;
  }
};

/**
 * Format XLM amount for display
 * @param {string|number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatXLM = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7
  });
};

/**
 * Shorten address for display
 * @param {string} address - Full address
 * @param {number} chars - Characters to show on each side
 * @returns {string} Shortened address
 */
export const shortenAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Get transaction URL on Stellar Expert
 * @param {string} hash - Transaction hash
 * @param {string} network - 'TESTNET' or 'MAINNET'
 * @returns {string} URL to transaction
 */
export const getTransactionUrl = (hash, network = 'TESTNET') => {
  const networkParam = network === 'TESTNET' ? 'testnet' : 'public';
  return `https://stellar.expert/explorer/${networkParam}/tx/${hash}`;
};

/**
 * Poll for account creation/funding
 * @param {string} address - Address to check
 * @param {number} maxAttempts - Maximum poll attempts
 * @returns {Promise<boolean>} True if account exists
 */
export const pollAccountCreation = async (address, maxAttempts = 10) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await server.loadAccount(address);
      return true;
    } catch (error) {
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  return false;
};

export default {
  getBalance,
  sendXLM,
  isValidStellarAddress,
  formatXLM,
  shortenAddress,
  getTransactionUrl,
  pollAccountCreation
};
