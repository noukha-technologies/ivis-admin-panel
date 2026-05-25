import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { authService } from '../../api/services/auth.service';
import { getApiErrorMessage } from '../../api/apiResponse';
import { isEmail, isRequired } from '../../utils/validators';

// Import local assets
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
  const [showPassword, setShowPassword] = useState(false);

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
      await authService.login({ email: email.trim(), password });
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      const status =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status;
      if (status === 401) {
        setLoginError('Invalid email or password');
      } else {
        setLoginError(getApiErrorMessage(err, 'An error occurred. Please try again.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans antialiased overflow-hidden">
      {/* Left Column - Illustration / Banner */}
      <div
        className="flex-none flex flex-col items-center justify-center p-8 bg-neutral-50 relative overflow-hidden select-none border-r border-neutral-100"
        style={{
          width: '50%',
          backgroundImage: `url(${loginRightBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="z-10 flex flex-col items-center w-full max-w-115 text-center gap-10">
          <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-neutral-900 leading-tight">
            Smart vehicle testing platform<br />for faster inspections
          </h1>

          {/* Main Opal Centered Card */}
          <div className="w-full max-w-105 aspect-[1.6] flex items-center justify-center transition-all duration-300">
            <img
              src={opalImg}
              alt="OPAL Banner"
              className="max-h-40 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-none flex flex-col justify-center items-center py-12 px-6 sm:px-12" style={{ width: '50%' }}>
        <div className="w-full max-w-100">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src={opalImg} alt="OPAL IVPMS Logo" className="h-13 w-auto object-contain" />
          </div>

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
                  className={`block w-full h-12 rounded-lg border px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 transition-all ${emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300'
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
              <div className="relative flex items-center w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="  ••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '20px', paddingRight: '44px' }}
                  className={`block w-full h-12 rounded-lg border px-4 py-3 text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 transition-all ${passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-neutral-500 hover:text-neutral-800 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.863 7.863L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{passwordError}</p>
              )}
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
                className="flex w-full h-12 items-center justify-center rounded-lg bg-[#1A1A1A] px-4 py-3 text-[15px] font-semibold text-white shadow-sm hover:bg-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default LoginPage;
