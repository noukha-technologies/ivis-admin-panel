import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { setToken, setUser } from '../../utils/storage';
import { isEmail, isRequired } from '../../utils/validators';

// Import local assets
import opalLogo from '../../assets/images/opal_logo.svg';
import opalImg from '../../assets/images/opal_img.svg';
import loginRightBg from '../../assets/images/login_right_background.svg';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation state
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoginError('');

    let hasError = false;

    if (!isRequired(email)) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!isEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }

    if (!isRequired(password)) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simple mock authentication - accepts any credentials to bypass login
      setToken('mock-jwt-token-xyz123');
      setUser({
        id: '1',
        email: email || 'john@gmail.com',
        role: 'admin',
        name: email ? email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : 'John Doe',
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased overflow-hidden">
      {/* Left Column - Form */}
      <div className="flex-none flex flex-col justify-center items-center py-12 px-6 sm:px-12" style={{ width: '50%' }}>
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="mb-8 flex justify-start">
            <img src={opalLogo} alt="OPAL IVPMS Logo" className="h-[52px] w-auto object-contain" />
          </div>

          {/* Header */}
          <h2 className="text-[22px] font-semibold text-neutral-900 tracking-tight mb-8">
            Sign into OPAL IVPMS
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {loginError && (
              <div className="rounded-lg bg-red-50 p-3.5 text-sm text-red-600 border border-red-200">
                {loginError}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email *
              </label>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="  john@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '20px' }}
                  className={`block w-full h-[48px] rounded-lg border px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 transition-all ${
                    emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300'
                  }`}
                />
                {emailError && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{emailError}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="  ••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '20px' }}
                  className={`block w-full h-[48px] rounded-lg border px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 transition-all ${
                    passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300'
                  }`}
                />
                {passwordError && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{passwordError}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end text-sm">
              <a
                href={ROUTES.FORGOT_PASSWORD}
                className="font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full h-[48px] items-center justify-center rounded-lg bg-[#1A1A1A] px-4 py-3 text-[15px] font-semibold text-white shadow-sm hover:bg-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column - Illustration / Banner */}
      <div 
        className="flex-none flex flex-col items-center justify-center p-8 bg-neutral-50 relative overflow-hidden select-none border-l border-neutral-100"
        style={{
          width: '50%',
          backgroundImage: `url(${loginRightBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="z-10 flex flex-col items-center w-full max-w-[460px] text-center gap-10">
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-neutral-900 leading-tight">
            Smart vehicle testing platform<br />for faster inspections
          </h1>
          
          {/* Main Opal Centered Card */}
          <div className="bg-[#FFF1F2] rounded-2xl w-full max-w-[420px] aspect-[1.6] flex items-center justify-center p-8 transition-all duration-300">
            <img 
              src={opalImg} 
              alt="OPAL Banner" 
              className="max-h-[160px] w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
