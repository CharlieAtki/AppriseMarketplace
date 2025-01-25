import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";

const DestinationView = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const destination = location.state?.destination;

    const backendUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/user-unAuth/auth-check`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json',
                    }
                });

                console.log('Auth check response:', response);
                const result = await response.json();
                console.log('Auth check result:', result);

                if (!result || !result.success) {
                    navigate('/customerAccountManagement');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                navigate('/customerAccountManagement');
            }
        };

        checkLoginStatus();
    }, [navigate, backendUrl]);

    if (!destination) {
        return <div>No destination selected.</div>;
    }

    return (
        // html / JSX code
        <div>
            <h1>
                {destination.name}
            </h1>
            <img src={destination.image} alt={destination.name} />
            <p>{destination.description}</p>
            <ul>
                {destination.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                ))}
            </ul>

        </div>
    );
};

export default DestinationView;