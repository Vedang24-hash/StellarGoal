import { useState, useEffect, useCallback } from 'react';
import freighter from '@stellar/freighter-api';

// Stellar Network Passphrases
const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015';
const MAINNET_PASSPHRASE = 'Public Global Stellar Network ; September 2015';

// Demo wallet addresses for testing
const DEMO_ADDRESSES = [
  'GDEMO1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  'GDEMO2BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
  'GCLIENTCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
  'GDEMO3DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'
];

// Generate random demo address
const getRandomDemoAddress = () => {
  return DEMO_ADDRESSES[Math.floor(Math.random() * DEMO_ADDRESSES.length)];
};

/**
 * Custom React hook for Freighter wallet connection
 * Handles auto-detection, session restore, error handling, and demo mode
 * 
 * @returns {Object} Wallet state and control functions
 */
export const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [network, setNetwork] = useState(null);
  const [networkOk, setNetworkOk] = useState(false);
  const [installed, setInstalled] = useState(null); // null = checking, true = found, false = not found
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Check if Freighter extension is installed with retry logic
   * Retries 5 times with increasing delays: 200ms, 400ms, 700ms, 1200ms
   */
  const detectFreighter = useCallback(async () => {
    const delays = [200, 400, 700, 1200];
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const connected = await freighter.isConnected();
        if (connected !== undefined) {
          setInstalled(true);
          return true;
        }
      } catch (err) {
        console.log(`Freighter detection attempt ${attempts + 1} failed:`, err);
      }

      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delays[attempts - 1] || 1500));
      }
    }

    setInstalled(false);
    return false;
  }, []);

  /**
   * Validate if the network is a valid Stellar network
   */
  const validateNetwork = useCallback((networkPassphrase) => {
    if (!networkPassphrase) return false;
    return networkPassphrase === TESTNET_PASSPHRASE || networkPassphrase === MAINNET_PASSPHRASE;
  }, []);

  /**
   * Get network name from passphrase
   */
  const getNetworkName = useCallback((networkPassphrase) => {
    if (networkPassphrase === TESTNET_PASSPHRASE) return 'TESTNET';
    if (networkPassphrase === MAINNET_PASSPHRASE) return 'MAINNET';
    return null;
  }, []);

  /**
   * Restore previous session if wallet was connected
   */
  const restoreSession = useCallback(async () => {
    try {
      const allowed = await freighter.isAllowed();
      
      if (allowed) {
        const userAddress = await freighter.getPublicKey();
        const userNetwork = await freighter.getNetworkDetails();

        if (userAddress && userNetwork) {
          setAddress(userAddress);
          const networkName = getNetworkName(userNetwork.networkPassphrase);
          setNetwork(networkName);
          setNetworkOk(validateNetwork(userNetwork.networkPassphrase));
          
          // Store in localStorage for persistence
          localStorage.setItem('stellargoal_wallet_address', userAddress);
          localStorage.setItem('stellargoal_wallet_network', networkName);
          return true;
        }
      }
    } catch (err) {
      console.log('Session restore failed:', err);
    }
    return false;
  }, [getNetworkName, validateNetwork]);

  /**
   * Initialize wallet detection on mount
   */
  useEffect(() => {
    const initialize = async () => {
      // Detect Freighter extension
      const freighterFound = await detectFreighter();
      
      // Try to restore session if Freighter is installed
      if (freighterFound) {
        await restoreSession();
      }
    };

    initialize();
  }, [detectFreighter, restoreSession]);

  /**
   * Connect to wallet
   * @param {string} walletType - 'freighter' or 'demo'
   */
  const connect = useCallback(async (walletType = 'freighter') => {
    setConnecting(true);
    setError(null);

    try {
      if (walletType === 'demo') {
        // Simulate demo wallet connection
        await new Promise(resolve => setTimeout(resolve, 900));
        
        const demoAddress = getRandomDemoAddress();
        setAddress(demoAddress);
        setNetwork('TESTNET');
        setNetworkOk(true);
        
        localStorage.setItem('stellargoal_wallet_address', demoAddress);
        localStorage.setItem('stellargoal_wallet_network', 'TESTNET');
        localStorage.setItem('stellargoal_wallet_type', 'demo');
        
        setConnecting(false);
        return;
      }

      // Freighter wallet connection
      if (installed === false) {
        throw new Error(
          'Freighter wallet extension is not installed. Please install it from the Chrome Web Store (https://www.freighter.app/) and refresh this page.'
        );
      }

      // Check if Freighter is still checking
      if (installed === null) {
        throw new Error(
          'Still checking for Freighter extension. Please wait a moment and try again.'
        );
      }

      // Request access to Freighter
      const accessGranted = await Promise.race([
        freighter.requestAccess(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 30000)
        )
      ]);

      if (!accessGranted) {
        throw new Error(
          'Connection request was declined. Please try again and approve the connection in Freighter.'
        );
      }

      // Get wallet address
      const userAddress = await freighter.getPublicKey();
      if (!userAddress) {
        throw new Error(
          'Could not retrieve wallet address from Freighter. Please make sure you have an account set up.'
        );
      }

      // Get network
      const userNetworkDetails = await freighter.getNetworkDetails();
      if (!userNetworkDetails || !userNetworkDetails.networkPassphrase) {
        throw new Error(
          'Could not retrieve network information from Freighter. Please try again.'
        );
      }

      const userNetwork = userNetworkDetails.networkPassphrase;

      // Validate network
      if (!validateNetwork(userNetwork)) {
        throw new Error(
          `Invalid network detected: ${userNetwork}. Please switch to Stellar Testnet or Mainnet in Freighter.`
        );
      }

      const networkName = getNetworkName(userNetwork);
      
      // Update state
      setAddress(userAddress);
      setNetwork(networkName);
      setNetworkOk(true);
      
      // Store in localStorage
      localStorage.setItem('stellargoal_wallet_address', userAddress);
      localStorage.setItem('stellargoal_wallet_network', networkName);
      localStorage.setItem('stellargoal_wallet_type', 'freighter');

    } catch (err) {
      console.error('Connection error:', err);
      
      // Handle specific error cases
      let errorMessage = err.message;
      
      if (err.message === 'timeout') {
        errorMessage = 'Connection timed out. Please check if Freighter is responding and try again.';
      } else if (err.message.includes('locked')) {
        errorMessage = 'Freighter wallet is locked. Please unlock it and try again.';
      } else if (err.message.includes('User declined')) {
        errorMessage = 'Connection request was declined. Please try again and approve the connection in Freighter.';
      }
      
      setError(errorMessage);
    } finally {
      setConnecting(false);
    }
  }, [installed, validateNetwork, getNetworkName]);

  /**
   * Disconnect wallet and clear session
   */
  const disconnect = useCallback(() => {
    setAddress(null);
    setNetwork(null);
    setNetworkOk(false);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('stellargoal_wallet_address');
    localStorage.removeItem('stellargoal_wallet_network');
    localStorage.removeItem('stellargoal_wallet_type');
  }, []);

  return {
    address,
    network,
    networkOk,
    installed,
    connecting,
    error,
    connect,
    disconnect
  };
};

export default useWallet;
