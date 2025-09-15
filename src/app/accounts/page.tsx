'use client';

import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaExclamationCircle, FaSpinner, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';
import MainLayout from '@/components/Layout/MainLayout';

const AccountsPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpData, setOtpData] = useState<any>(null);
  const router = useRouter();

  console.log('AccountsPage rendered:', {
    user: user ? { username: user.username, role: user.role, token: user.token?.slice(0, 10) + '...' } : 'No user',
    loading,
    step,
    timestamp: new Date().toISOString(),
  });

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to /');
    router.push('/');
    return null;
  }

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      console.log('Email input empty');
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    console.log('Sending OTP request:', {
      email,
      token: user.token?.slice(0, 10) + '...',
    });

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ email }),
      });

      console.log('OTP request response:', {
        status: response.status,
        statusText: response.statusText,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('OTP sent successfully:', data);
        setMessage(data.message);
        setOtpData(data);
        setStep('otp');
      } else {
        console.error('OTP request failed:', data);
        setError(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      console.error('OTP request error:', {
        error: err.message,
        stack: err.stack,
      });
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      console.log('Password mismatch:', { newPassword, confirmPassword });
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      console.log('Password too short:', newPassword.length);
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      console.log('Invalid OTP format:', otp);
      setError('OTP must be a 6-digit number.');
      return;
    }

    setIsLoading(true);
    console.log('Sending change password request:', {
      email: otpData?.email,
      otp,
      userRole: user.role,
      userId: user.id,
    });

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          email: otpData?.email,
          otp,
          newPassword,
          userRole: user.role,
          userId: user.id,
        }),
      });

      console.log('Change password response:', {
        status: response.status,
        statusText: response.statusText,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Password changed successfully:', data);
        setMessage(data.message);
        setTimeout(() => {
          setStep('email');
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setOtpData(null);
          setMessage('');
        }, 3000);
      } else {
        console.error('Change password failed:', data);
        setError(data.error || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Change password error:', {
        error: err.message,
        stack: err.stack,
      });
      setError('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    console.log('Back to email step');
    setStep('email');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setMessage('');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-900">Account Settings</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Logged in as: <span className="font-medium">{user.username}</span> ({user.role})
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaLock className="mr-2" />
              Change Password
            </h2>

            {/* Progress indicator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className={`flex items-center ${step === 'email' ? 'text-blue-600' : 'text-green-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'email' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-green-100 border-2 border-green-600'}`}>
                  <FaEnvelope className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Email</span>
              </div>
              <div className={`w-8 h-0.5 ${step === 'otp' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${step === 'otp' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'otp' ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                  <FaKey className="w-4 h-4" />
                </div>
                <span className="ml-2 text-sm font-medium">Verify & Reset</span>
              </div>
            </div>

            {step === 'email' ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your registered email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                    <FaEnvelope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the email address associated with your account to receive the OTP.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                  ) : (
                    'Send OTP to Email'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-800">
                    OTP sent to: <span className="font-medium">{otpData?.email}</span>
                  </p>
                </div>

                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Verification Code (OTP)
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center text-lg font-mono tracking-widest"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Check your email for the 6-digit verification code</p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleBackToEmail}
                    className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            )}

            {message && (
              <div className="flex items-center text-green-600 bg-green-100 p-3 rounded-md">
                <FaCheckCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center text-red-600 bg-red-100 p-3 rounded-md">
                <FaExclamationCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-500">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountsPage;