import type { Metadata } from 'next';

// Components
import AuthScreen from '@/containers/AuthScreen';

export const metadata: Metadata = {
    title: 'Sign up',
    description: 'Create a Sprout account and start tracking your houseplants.'
};

const SignUpPage = () => {
    return <AuthScreen mode="signup" />;
};

export default SignUpPage;
