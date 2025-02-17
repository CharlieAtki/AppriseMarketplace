import { useState } from "react";

const CustomerLoginForm = () => {
    const [input, setInput] = useState({ email: "", password: "" });
    const [passwordInputError, setPasswordInputError] = useState(false);
    const [passwordInputLengthError, setPasswordInputLengthError] = useState(false);
    const [emailInputError, setEmailInputError] = useState(false);
    const [emailInputValidityError, setEmailInputValidityError] = useState(false);

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const frontendUrl = process.env.REACT_APP_FRONTEND_URL;

    const emailValidityCheck = (email) => email.includes("@");

    async function sendData(buttonType) {
        setEmailInputError(false);
        setPasswordInputError(false);
        setPasswordInputLengthError(false);
        setEmailInputValidityError(false);

        let hasError = false;

        if (!input.email) {
            setEmailInputError(true);
            hasError = true;
        } else if (!emailValidityCheck(input.email)) {
            setEmailInputValidityError(true);
            hasError = true;
        }

        if (!input.password) {
            setPasswordInputError(true);
            hasError = true;
        } else if (input.password.length < 8) {
            setPasswordInputLengthError(true);
            hasError = true;
        }

        if (hasError) return;

        try {
            const APIEndPoint = buttonType === 'signUp'
                ? `${backendUrl}/api/user-unAuth/add-user`
                : `${backendUrl}/api/user-unAuth/user-login`;

            const UIEndPoint = buttonType !== 'signUp'
                ? `${frontendUrl}/marketplace`
                : `${frontendUrl}/customerAccountManagement`;

            const response = await fetch(APIEndPoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                credentials: 'include',
                body: JSON.stringify(input)
            });

            if (response.ok) {
                const data = await response.json();
                if (data) window.location.href = UIEndPoint;
            } else {
                const data = await response.json();
                if (data.field === "email") setEmailInputError(true);
                if (data.field === "password") setPasswordInputError(true);
                console.log("Error Response Data:", data);
            }
        } catch (err) {
            console.log('Error saving client', err);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-8 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl transition-all transform hover:scale-105 hover:shadow-2xl">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-8">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={input.email}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md px-4 py-2 text-gray-900 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-lg ${emailInputError || emailInputValidityError ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {emailInputError && <p className="text-red-500 text-sm mt-1">Email already taken</p>}
                                {emailInputValidityError && <p className="text-red-500 text-sm mt-1">Invalid email</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={input.password}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md px-4 py-2 text-gray-900 outline-gray-700 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-lg ${passwordInputError || passwordInputLengthError ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {passwordInputLengthError &&
                                    <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters</p>}
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={() => sendData('signIn')}
                                className="w-40 rounded-2xl bg-gray-700 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-indigo-600"
                            >
                                Sign in
                            </button>
                            <button
                                type="button"
                                onClick={() => sendData('signUp')}
                                className="w-40 rounded-2xl bg-gray-700 px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-indigo-600"
                            >
                                Sign Up
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default CustomerLoginForm;