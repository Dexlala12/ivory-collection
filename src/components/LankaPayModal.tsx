import React, { useState, useEffect } from 'react';
import { Lock, CreditCard, Landmark, QrCode, ArrowRight, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface LankaPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal: number;
  onPaymentSuccess: (paymentDetails: { gateway: string; transactionId: string }) => void;
  onPaymentFailed: (errorMessage: string) => void;
}

const SRI_LANKAN_BANKS = [
  { code: 'BOC', name: 'Bank of Ceylon (BOC)' },
  { code: 'SAMPATH', name: 'Sampath Bank' },
  { code: 'COMBANK', name: 'Commercial Bank of Ceylon' },
  { code: 'HNB', name: 'Hatton National Bank (HNB)' },
  { code: 'PEOPLES', name: 'People\'s Bank' },
  { code: 'NDB', name: 'National Development Bank (NDB)' },
  { code: 'DFCC', name: 'DFCC Bank' },
  { code: 'SEYLAN', name: 'Seylan Bank' }
];

export default function LankaPayModal({
  isOpen,
  onClose,
  orderTotal,
  onPaymentSuccess,
  onPaymentFailed
}: LankaPayModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'justpay' | 'card' | 'qr'>('justpay');
  const [bank, setBank] = useState(SRI_LANKAN_BANKS[0].code);
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [step, setStep] = useState<'details' | 'otp' | 'processing' | 'success' | 'failed'>('details');
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [failedReason, setFailedReason] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setOtpInput('');
      setOtpError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const initiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple frontend validations
    if (paymentMethod === 'justpay') {
      if (!accountNumber || !mobileNumber) {
        alert('Please fill in your JustPay account and mobile details.');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvc) {
        alert('Please fill in card details.');
        return;
      }
    }

    // Generate simulated OTP for sandbox
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    
    // Go to OTP verification step
    if (paymentMethod === 'qr') {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
      }, 3000);
    } else {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '123456' || otpInput === generatedOtp) {
      setStep('processing');
      setOtpError('');
      
      // Simulate API process time
      setTimeout(() => {
        const isSuccess = Math.random() > 0.05; // 95% success rate in simulator
        if (isSuccess) {
          setStep('success');
        } else {
          setStep('failed');
          setFailedReason('INSUFFICIENT FUNDS IN ACCOUNT OR NETWORK TIMEOUT');
        }
      }, 2500);
    } else {
      setOtpError('Invalid verification code. Enter "123456" or check the sandbox console banner.');
    }
  };

  const completeOrder = () => {
    onPaymentSuccess({
      gateway: `LankaPay - ${paymentMethod.toUpperCase()}`,
      transactionId: `LP-${Math.floor(10000000 + Math.random() * 90000000)}`
    });
    onClose();
  };

  const triggerFailure = () => {
    onPaymentFailed(failedReason || 'User declined or session expired');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Main Sandbox Box */}
      <div className="relative bg-white border border-black/20 w-full max-w-lg shadow-2xl p-6 sm:p-8 z-10 text-black">
        
        {/* Banner declaring Sandbox Environment */}
        <div className="bg-black text-[#F4F4F5] px-4 py-2 mb-6 text-[10px] font-mono tracking-widest text-center uppercase border border-black flex items-center justify-center space-x-2">
          <span>⚡ LANKAPAY® SANDBOX GATEWAY (ACTIVE DEMO)</span>
        </div>

        {/* Step 1: DETAILS */}
        {step === 'details' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase">LANKAPAY PAYMENT NETWORKS</h2>
              <p className="text-lg font-bold tracking-tight mt-1">SECURED TRANSACTION FOR ${orderTotal.toFixed(2)}</p>
            </div>

            {/* Selector tabs */}
            <div className="grid grid-cols-3 gap-2 border-b border-black/10 pb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('justpay')}
                className={`py-3 text-center border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'justpay' 
                    ? 'border-black bg-black text-white font-bold' 
                    : 'border-black/10 hover:border-black/30 bg-zinc-50'
                }`}
              >
                <Landmark size={16} />
                <span className="text-[10px] font-mono tracking-wider uppercase">JUSTPAY®</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 text-center border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-black bg-black text-white font-bold' 
                    : 'border-black/10 hover:border-black/30 bg-zinc-50'
                }`}
              >
                <CreditCard size={16} />
                <span className="text-[10px] font-mono tracking-wider uppercase">DEBIT / CREDIT</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('qr')}
                className={`py-3 text-center border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                  paymentMethod === 'qr' 
                    ? 'border-black bg-black text-white font-bold' 
                    : 'border-black/10 hover:border-black/30 bg-zinc-50'
                }`}
              >
                <QrCode size={16} />
                <span className="text-[10px] font-mono tracking-wider uppercase">LANKAQR</span>
              </button>
            </div>

            <form onSubmit={initiatePayment} className="space-y-4 text-xs">
              {/* JUSTPAY INPUTS */}
              {paymentMethod === 'justpay' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="font-mono tracking-wider text-[10px] text-black/60 block uppercase">Select Linked Bank Account</label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="w-full bg-[#F4F4F5] border border-black/10 focus:border-black px-3 py-2.5 rounded-none outline-none font-sans"
                    >
                      {SRI_LANKAN_BANKS.map((b) => (
                        <option key={b.code} value={b.code}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono tracking-wider text-[10px] text-black/60 block uppercase">JustPay Account Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10293049102"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#F4F4F5] border border-black/10 focus:border-black px-3 py-2.5 rounded-none outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono tracking-wider text-[10px] text-black/60 block uppercase">Registered Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0771234567"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full bg-[#F4F4F5] border border-black/10 focus:border-black px-3 py-2.5 rounded-none outline-none font-mono"
                    />
                    <span className="text-[9px] text-black/40 block font-mono">Sandbox OTP will be output to console banner in next step.</span>
                  </div>
                </div>
              )}

              {/* CARD INPUTS */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="font-mono tracking-wider text-[10px] text-black/60 block uppercase">LankaPay Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#F4F4F5] border border-black/10 focus:border-black px-3 py-2.5 rounded-none outline-none font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono tracking-wider text-[10px] text-black/60 block uppercase">Expiry MM/YY</label>
                      <input
                        type="text"
                        required
                        placeholder="12/28"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-[#F4F4F5] border border-black/10 focus:border-black px-3 py-2.5 rounded-none outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono tracking-wider text-[10px] text-black/60 block uppercase">CVC Code</label>
                      <input
                        type="text"
                        required
                        placeholder="312"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#F4F4F5] border border-black/10 focus:border-black px-3 py-2.5 rounded-none outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* QR INPUTS */}
              {paymentMethod === 'qr' && (
                <div className="text-center p-4 space-y-4 bg-zinc-50 border border-black/5 animate-in fade-in duration-200 flex flex-col items-center">
                  <div className="w-36 h-36 bg-white p-2 border border-black/10 relative">
                    {/* Visual QR representation */}
                    <div className="absolute inset-2 border-2 border-dashed border-black/20 flex items-center justify-center bg-zinc-100">
                      <QrCode size={90} className="stroke-1 text-black opacity-90" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold tracking-wider font-mono text-[10px] uppercase">LANKAQR® INSTANT SCAN</p>
                    <p className="text-[10px] text-black/50 leading-relaxed max-w-xs">
                      Scan the QR above using your iPay, Genie, or other national bank application to trigger instant debit authorization.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-black/30 hover:border-black py-3 text-[10px] font-mono tracking-widest font-bold uppercase transition-all"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white hover:bg-black/80 py-3 text-[10px] font-mono tracking-widest font-bold uppercase transition-all flex items-center justify-center space-x-2"
                >
                  <span>AUTHORIZE</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6 text-center py-4">
            <div>
              <h2 className="text-xs font-mono tracking-[0.2em] text-black/50 uppercase">SANDBOX TWO-FACTOR SECURITY</h2>
              <p className="text-base font-bold tracking-tight mt-1">VERIFICATION CODE HAS BEEN BROADCASTED</p>
            </div>

            {/* Sandbox code disclosure banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-left text-xs text-yellow-800 space-y-2">
              <p className="font-bold font-mono">🔧 SANDBOX CONSOLE CODE:</p>
              <p>
                In a production build, an SMS is sent. In this demo, use code <span className="font-mono font-bold text-black text-sm bg-yellow-100 px-2 py-0.5 border border-yellow-300 rounded">{generatedOtp}</span> or bypass with <span className="font-mono font-bold text-black text-sm bg-yellow-100 px-2 py-0.5 border border-yellow-300 rounded">123456</span> to simulate authentication.
              </p>
            </div>

            <div className="space-y-1 max-w-xs mx-auto text-left">
              <label className="font-mono tracking-wider text-[10px] text-black/60 block uppercase text-center">Enter 6-Digit OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="------"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-[#F4F4F5] border border-black/10 focus:border-black px-4 py-3 text-center text-lg font-mono font-bold tracking-[0.4em] outline-none rounded-none"
              />
              {otpError && <p className="text-[10px] text-red-600 font-mono text-center pt-2">{otpError}</p>}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex-1 border border-black/20 hover:border-black py-3 text-[10px] font-mono tracking-widest font-bold uppercase"
              >
                BACK
              </button>
              <button
                type="submit"
                className="flex-1 bg-black text-[#F4F4F5] hover:bg-black/80 py-3 text-[10px] font-mono tracking-widest font-bold uppercase"
              >
                VERIFY & COMPENSATE
              </button>
            </div>
          </form>
        )}

        {/* Step 3: PROCESSING SPINNER */}
        {step === 'processing' && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="animate-spin text-black stroke-[1.5]" size={40} />
            <div className="space-y-1">
              <p className="font-mono text-xs tracking-widest uppercase font-bold text-black animate-pulse">PROCESSING SECURE SETTLEMENT...</p>
              <p className="text-[10px] text-black/50 font-mono">Routing through LankaPay Network Vault Router. Do not refresh.</p>
            </div>
          </div>
        )}

        {/* Step 4: SUCCESS */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="text-black stroke-[1.5]" size={56} />
            </div>
            <div className="space-y-2">
              <p className="font-mono text-xs tracking-[0.2em] text-black/50 uppercase">SETTLEMENT COMPLETE</p>
              <h3 className="text-xl font-bold tracking-tight">TRANSACTION SUCCESSFULLY RESOLVED</h3>
              <p className="text-xs text-black/60 max-w-sm mx-auto leading-relaxed">
                LankaPay has finalized clearance for your order. Secure funds have been registered and captured.
              </p>
            </div>
            <div className="bg-zinc-50 border border-black/5 p-4 rounded text-xs font-mono space-y-1.5 max-w-sm mx-auto text-left">
              <div className="flex justify-between">
                <span className="text-black/40">SYSTEM RECORD:</span>
                <span className="font-bold">LANKAPAY-CLEARANCE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/40">NETWORK ROUTE:</span>
                <span>{paymentMethod === 'justpay' ? `JUSTPAY via ${bank}` : 'LANKAPAY CARD-SETTLE'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/40">TOTAL FUNDS:</span>
                <span className="font-bold">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={completeOrder}
              className="w-full bg-black text-[#F4F4F5] hover:bg-black/80 py-3 text-[10px] font-mono tracking-widest font-bold uppercase transition-all"
            >
              RETURN TO STOREFRONT & DISPATCH
            </button>
          </div>
        )}

        {/* Step 5: FAILED */}
        {step === 'failed' && (
          <div className="py-6 text-center space-y-6">
            <div className="flex justify-center">
              <AlertTriangle className="text-red-600 stroke-[1.5]" size={56} />
            </div>
            <div className="space-y-2">
              <p className="font-mono text-xs tracking-[0.2em] text-red-600 uppercase">SETTLEMENT REFUSED</p>
              <h3 className="text-xl font-bold tracking-tight">TRANSACTION WAS REJECTED BY HOST</h3>
              <p className="text-xs text-black/60 max-w-sm mx-auto leading-relaxed">
                Reason: {failedReason}
              </p>
            </div>
            <div className="flex space-x-3 max-w-sm mx-auto pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex-1 border border-black/20 hover:border-black py-3 text-[10px] font-mono tracking-widest font-bold uppercase"
              >
                RETRY
              </button>
              <button
                type="button"
                onClick={triggerFailure}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 text-[10px] font-mono tracking-widest font-bold uppercase"
              >
                FAIL ORDER
              </button>
            </div>
          </div>
        )}

        {/* Legal padlock footer */}
        <div className="border-t border-black/5 pt-4 mt-6 flex items-center justify-center space-x-1.5 text-[9px] font-mono text-black/40 uppercase">
          <Lock size={12} className="text-black/30" />
          <span>AES-256 BANK-GRADE ENCRYPTION STANDARDS</span>
        </div>

      </div>
    </div>
  );
}
