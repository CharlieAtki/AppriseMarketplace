import {useState} from "react";
import {useNavigate} from "react-router-dom";


const HostingBusinessForm = () => {
    // input is for reading the current state value.
    // setInput is for updating the state, leading to a re-render with the new input value.
    // For example, input is what would be used within the UI,
    // but setInput is used to update the input when a condition Changes, such as new data in the input field
    const [input, setInput] = useState({ email: "", password: "" }); // state input fields

    const [passwordInputError, setPasswordInputError] = useState(false); // To track if there was an error within the password input field
    const [passwordInputLengthError, setPasswordInputLengthError] = useState(false); // To track is the input password is long enough
    const [emailInputError, setEmailInputError] = useState(false); // To track if there was an error within the email input field
    const [emailInputValidityError, setEmailInputValidityError] = useState(false); // To track if the email contains an @ symbol

    // defining the env variables
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    const navigate = useNavigate();

    // Function to get input field class based on error state
    // Used to improve user feedback + inform the user, which input is incorrect
    const getEmailInputClass = (hasError) => {
        return hasError
            ? 'border-red-500'  // If there's an error, apply red border
            : 'border-gray-300'; // If no error, apply default border
    };

    const getPasswordInputClass = (hasError) => {
        return hasError
            ? 'border-red-500'  // If there's an error, apply red border
            : 'border-gray-300'; // If no error, apply default border
    };

    // of loop iterates over each element of the string until the conditions specified are satisfied
    const emailValidityCheck = (email) => {
        for (let character of email) {
            if (character === '@') {
                return true
            }
        }
        return false; // the input email is not valid -> no @ symbol
    }


    // This asynchronous function is used to send and then receive data from backend
    // Data, such as email and password will be transferred
    async function becomeABusiness(buttonType) {
        // Reset error states before submitting
        setEmailInputError(false);
        setPasswordInputError(false);
        setPasswordInputLengthError(false);
        setEmailInputValidityError(false);

        let hasError = false; // Track if there are any errors


        // Check for empty input fields
        if (!input.email) {
            setEmailInputError(true); // Set email error to true if empty
            hasError = true;
            // Calling a function to check if the email contains an @ symbol
        } else if (!emailValidityCheck(input.email)) {
            setEmailInputValidityError(true) // the data input doesn't contain an @ symbol
            hasError = true;
        }


        if (!input.password) {
            setPasswordInputError(true); // Set password error to true if empty
            hasError = true;
        } else if (input.password.length < 8) {
            setPasswordInputLengthError(true);
            hasError = true
        }

        // If there are errors, don't proceed with sending data
        if (hasError) return

        try {
            // fetch operation is asynchronous, the process will wait until the response
            const response = await fetch(`${backendUrl}/api/business-Auth/become-a-business`, {
                // Defining that the method is POST (sending data),
                // Headers are telling the server that JSON is being sent
                method: "POST",
                headers: {
                    "Content-Type": "application/json",  // telling the server what data type is being sent
                    "Accept": "application/json"
                },
                credentials: 'include', // Allows cookie exchange
                body: JSON.stringify(input) // converts the JS object into a JSON string, making it ready for HTTP transmission
            });

            // If there is a response, await for the data to be transferred
            if (response.ok) {
                const data = await response.json(); // .json turns the JSON string back into a JS object
                // if there is data within the response, redirect the user to the dashboard
                if (data) {
                    // Redirecting the user to the dashboard
                    navigate('/');
                }
            } else {
                // fetching the response data
                const data = await response.json();

                // The backend checks to see if the email has been used within a client document
                // The backend responds with a NOT OK (!ok) server status code, such as 500
                // The backends response will return, which input field must have a different input
                // By setting the according setInputError, the front end can use the ternary operator to adjust the colour of the input field
                // In this example, the email input field would turn red
                if (data.field === "email") {
                    setEmailInputError(true);
                }
                if (data.field === "password") {
                    setPasswordInputError(true);
                }
                // Log error response for debugging
                console.log("Error Response Data:", data);
            }
        } catch (err) {
            // If an error occurs, output the error into the console
            console.log('Error saving client', err)
        }
    }

    // write the explanation for this code
    // the input and set input are store 2 objects,
    // the handleChange function takes the new input from the input fields when there is presence,
    // and then overrides the value in the useState. event.target is the name of the input field and the value is the input
    const handleChange = (event) => {
        const { name, value } = event.target; // event.target refers to the input element
        // ...prev ensures any previous input states are retained
        // [name]: value dynamically updates the input object with the new value for the field that triggered the change event.

        // multiple input fields with different input accessing the same handler,
        // ...prev would retain those objects when the new input state is set

        // The line below calls setInput to change the value of input
        setInput((prev) => ({ ...prev, [name]: value })); // updates the input state object
    }

    return (
        // flex h-screen makes the parent section take up the full height of the screen and uses Flexbox to layout its children in a row
        <section className="flex h-screen">
            {/* Left side: Login Form */}
            {/* justify-centre items-centre This centres the content both horizontally and vertically inside the div */}
            {/* w-1/2 This makes each side take up 50% of the width of the screen */}
            <div className="flex justify-center items-center w-1/2">
                {/* The container is vertically centered in the screen */}
                {/* w-96 This fixes the width of the login form, so it doesn't stretch too wide */}
                <div className="text-center p-6 w-96 border-2 border-gray-700 text-lg rounded-3xl shadow-2xl">
                    <h1 className="py-4 text-xl font-semibold text-gray-700">Become a Business</h1>
                    <div className="flex flex-col gap-4">
                        {/* Input fields - Temp, use the React input boxes */}
                        {/* focus:outline-none - Removes the default outline of focus */}
                        {/* focus:ring-2 - Adds a 2px ring around the input on focus */}
                        {/* focus:ring-indigo-500 - Changes the ring colour to indigo when the input is focused */}
                        {/* hover:border-indigo-500 - Changes the border colour to indigo when the input is hovered */}
                        <input type="text"
                               name="email"
                               value={input.email}
                               onChange={handleChange}
                               className={`border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 ${getEmailInputClass(emailInputError)}`}
                               placeholder="Email address"

                        />
                        {/* add the incorrect password prompt once the password input checks are implemented*/}
                        <input type="password"
                               name="password"
                               value={input.password}
                               onChange={handleChange}
                               className={`border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500 ${getPasswordInputClass(passwordInputError)}`}
                               placeholder="Password"

                        />
                        {/* When there is an emailInputError, the text below appears to inform the user what input is incorrect*/}
                        {emailInputError && (
                            <p className="text-red-500 text-sm mt-1">Email Already Taken</p>
                        )}
                        {emailInputValidityError && (
                            <p className="text-red-500 text-sm mt-1">Invalid Email</p>
                        )}
                        {passwordInputLengthError && (
                            <p className="text-red-500 text-sm mt-1">Password Not Long Enough</p>
                        )}
                    </div>
                    {/* SignIn and SignUp buttons */}
                    {/* space-x-4 - This adds space between each of the buttons in the row */}
                    <div className="py-6 space-x-4">
                        <button
                            onClick={() => becomeABusiness()}
                            className='bg-gray-700 text-white rounded-full shadow-2xl shadow-gray-500/50 px-6 py-3 hover:bg-indigo-700 transition-all transform hover:scale-105'>
                            Become a Business
                        </button>
                    </div>
                </div>
            </div>

            {/* Right side: Splash Text */}
            {/* justify-centre items-centre This centres the content both horizontally and vertically inside the div */}
            {/* w-1/2 This makes each side take up 50% of the width of the screen */}
            {/* bg-gradient-to-br from-gray-700 to-indigo-700 - This adds a colour gradient from the top left to the bottom right */}
            <div className="flex justify-center items-center w-1/2 bg-gradient-to-br from-gray-700 to-indigo-700">
                <h1 className="text-black">Splash Screen</h1>
            </div>
        </section>

    );
};

export default HostingBusinessForm