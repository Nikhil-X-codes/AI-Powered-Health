'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react';

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 4) return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  return { score: 5, label: 'Excellent', color: 'bg-emerald-600' };
}

export default function SignupPage() {
  const { register, loading, error: authError } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      triggerShake();
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      triggerShake();
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      triggerShake();
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      router.replace('/auth/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
      triggerShake();
    }
  };

  const displayError = error || authError;

  return (
    <AuthLayout
      heading="Create your account"
      subheading="Start understanding your medical data today"
    >
      <form
        onSubmit={handleSubmit}
        className={`space-y-4 ${shakeError ? 'animate-shake' : ''}`}
        id="signup-form"
      >
        {/* Error message */}
        {displayError && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 animate-fade-in-up">
            <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <p className="text-sm text-red-700">{displayError}</p>
          </div>
        )}

        {/* Name field */}
        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
              <User className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
              <Mail className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
              <Lock className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              id="toggle-password-visibility"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* Password strength indicator */}
          {formData.password && (
            <div className="mt-2.5 animate-fade-in-up">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`strength-bar-${i}`}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i < passwordStrength.score ? passwordStrength.color : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Password strength:{' '}
                <span className="font-medium">{passwordStrength.label}</span>
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password field */}
        <div>
          <label htmlFor="signup-confirm-password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
              <Lock className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-11 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              id="toggle-confirm-password-visibility"
            >
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {/* Match indicator */}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600 animate-fade-in-up">
              <Check className="h-3.5 w-3.5" />
              Passwords match
            </div>
          )}
        </div>

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 pt-1">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label htmlFor="terms-checkbox" className="text-xs leading-relaxed text-slate-500">
            I agree to the{' '}
            <span className="font-medium text-slate-700 cursor-pointer hover:text-emerald-600 transition">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="font-medium text-slate-700 cursor-pointer hover:text-emerald-600 transition">
              Privacy Policy
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white"
          id="signup-submit-btn"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-4 py-1">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-emerald-600 transition hover:text-emerald-700"
            id="login-link"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
