import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/');
    }, [navigate]);

    return (
        <>
            <h2>Page not found</h2>
        </>
    );
};

export default Error404;
