

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import styles from './AuthPage.module.css';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // 1. Import the eye icons

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 2. Add state for visibility
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const switchModeHandler = () => {
        setIsLogin((prevState) => !prevState);
        setError('');
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin ? { email, password } : { username, email, password };
            const response = await api.post(url, payload);
            
            login(response.data);
            navigate('/dashboard');

        } catch (err) {
            setError(err.response?.data?.message || `An error occurred. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.backgroundOverlay}></div>
            
            <div className={styles.authBox}>
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <form onSubmit={submitHandler}>
                    {!isLogin && (
                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {/* 3. Update the password input section */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                            <span 
                                className={styles.passwordIcon} 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>
                    {error && <p className={styles.errorText}>{error}</p>}
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
                    </button>
                    <button type="button" onClick={switchModeHandler} className={styles.switchButton}>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'} <span>{isLogin ? 'Sign Up' : 'Login'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;