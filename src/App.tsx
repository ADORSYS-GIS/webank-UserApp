import { useState } from 'react';
import OtpInput from './components/OtpInput';
import './App.css';

export default function App() {
  const [otp, setOtp] = useState('');
  const onChange = (value: string) => setOtp(value);

  return (
    <>
      <div className="container">
        <h1>OTP Verification</h1>
        <h4>Enter the verification code we just sent to your phone number</h4>
        <OtpInput value={otp} valueLength={4} onChange={onChange} />
      </div>
    </>
  );
}