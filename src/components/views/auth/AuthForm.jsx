// AuthForm.jsx
import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AuthForm = () => {
    const [isSignIn, setIsSignIn] = useState(true);

    const toggleForm = () => {
        setIsSignIn(!isSignIn);
    };

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gray-200">
            <div className="w-full max-w-md">
                {isSignIn ? <SignIn onSwitch={toggleForm} /> : <SignUp onSwitch={toggleForm} />}
            </div>
        </div>
    );
};

export default AuthForm;
