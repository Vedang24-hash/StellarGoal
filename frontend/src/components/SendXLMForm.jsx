import React, { useState } from 'react';
import { sendXLM, isValidStellarAddress, getTransactionUrl } from '../utils/stellar';
import freighter from '@stellar/freighter-api';

/**
 * Send XLM Form Component
 * Allows users to send XLM to another address
 */
const SendXLMForm = ({ sourceAddress, network, onTransactionComplete }) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [txHash, setTxHash] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setTxHash(null);

    // Validation
    if (!destinationAddress.trim()) {
      setError('Please enter a destination address');
      return;
    }

    if (!isValidStellarAddress(destinationAddress)) {
      setError('Invalid Stellar address format');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > 1000000) {
      setError('Amount is too large');
      return;
    }

    setSending(true);

    try {
      const result = await sendXLM(sourceAddress, destinationAddress, amount, freighter.signTransaction);
      
      setSuccess(`Successfully sent ${amount} XLM!`);
      setTxHash(result.hash);
      
      // Clear form
      setDestinationAddress('');
      setAmount('');
      setMemo('');
      
      // Notify parent component
      if (onTransactionComplete) {
        onTransactionComplete(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="send-xlm-form">
      <div className="form-header">
        <h3>💸 Send XLM</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <p>{success}</p>
            {txHash && (
              <p className="transaction-hash">
                <a 
                  href={getTransactionUrl(txHash, network)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link"
                >
                  View transaction →
                </a>
              </p>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="destination" className="form-label">
            Destination Address *
          </label>
          <input
            type="text"
            id="destination"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            className="form-input"
            disabled={sending}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount (XLM) *
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.0000001"
            min="0.0000001"
            className="form-input"
            disabled={sending}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="memo" className="form-label">
            Memo (Optional)
          </label>
          <input
            type="text"
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="Transaction note"
            className="form-input"
            disabled={sending}
            maxLength="28"
          />
          <small className="form-help">Maximum 28 characters</small>
        </div>

        <button 
          type="submit" 
          disabled={sending}
          className="button button-primary button-large"
        >
          {sending ? (
            <>
              <span className="loading-spinner-small"></span>
              Sending...
            </>
          ) : (
            'Send XLM'
          )}
        </button>
      </form>
    </div>
  );
};

export default SendXLMForm;
