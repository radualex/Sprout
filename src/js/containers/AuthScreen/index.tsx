'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Sprout } from 'lucide-react';

// Auth
import { authClient } from '@/js/lib/auth/auth-client';

// Styles
import styles from './styles.module.scss';

interface Props extends React.ComponentProps<'div'> {
    mode: 'login' | 'signup';
}

export const AuthScreen: React.FunctionComponent<Props> = ({ mode, ...props }) => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSignup = mode === 'signup';

    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }, []);

    const handleEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }, []);

    const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }, []);

    const handleSubmit = useCallback(async (event: React.SyntheticEvent) => {
        event.preventDefault();

        setError('');
        setIsSubmitting(true);

        const callbackURL = '/';

        if (isSignup) {
            const result = await authClient.signUp.email({
                name,
                email,
                password,
                callbackURL
            });
            if (result.error) {
                setError(result.error.message ?? 'Sign-up failed.');
                setIsSubmitting(false);

                return;
            }
        } else {
            const result = await authClient.signIn.email({
                email,
                password
            });
            if (result.error) {
                setError(result.error.message ?? 'Sign-in failed.');
                setIsSubmitting(false);

                return;
            }
        }

        router.push(callbackURL);
        router.refresh();
    }, [name, email, password, isSignup, router]);

    const handleGoogle = useCallback(() => {
        void authClient.signIn.social({
            provider: 'google',
            callbackURL: '/'
        });
    }, []);

    return (
        <div className={styles.root} {...props}>
            <div className={styles.hero}>
                <div className={styles.logo}>
                    <Sprout size={44} />
                </div>
                <h1>
                    Sprout
                </h1>
                <p className={styles.sub}>
                    Track your plants, never miss a watering.
                </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                {isSignup && (
                    <label className={styles.field}>
                        Name
                        <input value={name} onChange={handleNameChange} placeholder="Ada Lovelace" autoComplete="name" />
                    </label>
                )}

                <label className={styles.field}>
                    Email
                    <input type="email" value={email} onChange={handleEmailChange} placeholder="you@example.com" autoComplete="email" required />
                </label>

                <label className={styles.field}>
                    Password
                    <input type="password" value={password} onChange={handlePasswordChange} placeholder="••••••••" autoComplete={isSignup ? 'new-password' : 'current-password'} required />
                </label>

                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}

                <button className={styles.primary} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'One moment…' : (isSignup ? 'Create account' : 'Sign in')}
                </button>
            </form>

            <div className={styles.divider}>
                <span>
                    or
                </span>
            </div>

            <button className={styles.google} type="button" onClick={handleGoogle}>
                Continue with Google
            </button>

            <p className={styles.switch}>
                {`${isSignup ? 'Already have an account?' : 'New to Sprout?'} `}
                <Link href={isSignup ? '/login' : '/signup'}>
                    {isSignup ? 'Sign in' : 'Create account'}
                </Link>
            </p>
        </div>
    );
};
