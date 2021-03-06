import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import './LoginForm.css';

function LoginForm() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password })).catch(
            (res) => {
                if (res.data && res.data.errors) setErrors(res.data.errors);
            }
        );
    };

    return (
        <div className="loginFormContainer">
            <div className="loginFormHeader">
                <h1>Welcome back!</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="formBody">
                    <ul className="errors">
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <div className="loginFormInputContainer">
                        <div className="loginLabelContainer">
                            <label>Phone Number or Email</label>
                        </div>
                        <div className="loginInput">
                            <input
                                placeholder="Phone Number or Email"
                                type="text"
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="loginFormInputContainer">
                        <div className="loginLabelContainer">
                            <label>Password</label>
                        </div>
                        <div className="loginInput">
                            <input
                                placeholder="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="loginFormButtonContainer">
                        <button className="loginFormButton" type="submit">
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;
