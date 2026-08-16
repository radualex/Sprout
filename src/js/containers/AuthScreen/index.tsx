'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Lib
import { authClient } from '@/js/lib/auth-client';

// Styles
import styles from './styles.module.scss';

interface Props {
    mode: 'login' | 'signup';
}

async function handleGoogle() {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/' });
}

export const AuthScreen: React.FunctionComponent<Props> = ({ mode }) => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSignup = mode === 'signup';

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);
        const callbackURL = '/';
        if (isSignup) {
            const result = await authClient.signUp.email({ name, email, password, callbackURL });
            if (result.error) {
                setError(result.error.message ?? 'Sign-up failed.');
                setIsSubmitting(false);
                return;
            }
        } else {
            const result = await authClient.signIn.email({ email, password });
            if (result.error) {
                setError(result.error.message ?? 'Sign-in failed.');
                setIsSubmitting(false);
                return;
            }
        }
        router.push(callbackURL);
        router.refresh();
    }

    return (
        <div className={styles.screen}>
            <div className={styles.hero}>
                <div className={styles.logo}>🌱</div>
                <h1>Sprout</h1>
                <p className={styles.sub}>Track your plants, never miss a watering.</p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                {isSignup && (
                    <label className={styles.field}>
                        Name
                        <input value={name} onChange={(event) => { setName(event.target.value); }} placeholder="Ada Lovelace" autoComplete="name" />
                    </label>
                )}

                <label className={styles.field}>
                    Email
                    <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); }} placeholder="you@example.com" autoComplete="email" required />
                </label>

                <label className={styles.field}>
                    Password
                    <input type="password" value={password} onChange={(event) => { setPassword(event.target.value); }} placeholder="••••••••" autoComplete={isSignup ? 'new-password' : 'current-password'} required />
                </label>

                {error && <p className={styles.error}>{error}</p>}

                <button className={styles.primary} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'One moment…' : (isSignup ? 'Create account' : 'Sign in')}
                </button>
            </form>

            <div className={styles.divider}>
                <span>or</span>
            </div>

            <button className={styles.google} type="button" onClick={handleGoogle}>
                Continue with Google
            </button>

            <p className={styles.switch}>
                {isSignup ? 'Already have an account?' : 'New to Sprout?'}{' '}
                <Link href={isSignup ? '/login' : '/signup'}>
                    {isSignup ? 'Sign in' : 'Create account'}
                </Link>
            </p>
        </div>
    );
};
