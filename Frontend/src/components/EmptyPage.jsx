import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function EmptyPage() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/dashboard')
        else navigate('login')
    })

    return (
        <div>EmptyPage</div>
    )
}

export default EmptyPage