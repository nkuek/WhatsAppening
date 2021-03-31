import { Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormPage() {
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (sessionUser) return <Redirect to="/" />;

    const updateFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            let reader = new FileReader();

            reader.onload = function (e) {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            const formattedNumber = phoneNumber.replaceAll('-', '');
            dispatch(
                sessionActions.signup({
                    email,
                    name,
                    password,
                    image,
                    phoneNumber: formattedNumber,
                    confirmPassword,
                })
            ).catch((res) => {
                if (res.data && res.data.errors) setErrors(res.data.errors);
            });
        }
        return setErrors([
            'Confirm Password field must be the same as the Password field',
        ]);
    };

    return (
        <div className="signupFormContainer">
            <div className="signupFormHeader">
                <h1>Sign Up</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <div className="fileWrapper">
                    <img
                        className="imgPreview"
                        src={
                            !preview
                                ? 'https://i.stack.imgur.com/l60Hf.png'
                                : preview
                        }
                    ></img>
                    <input
                        className="fileInput"
                        type="file"
                        accept="image/gif,image/jpeg,image/jpg,image/png"
                        onChange={updateFile}
                    ></input>
                </div>
                <div className="formBody">
                    <div className="formInputContainer">
                        <label htmlFor="email">Email</label>
                        <input
                            placeholder="Email"
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="formInputContainer">
                        <label htmlFor="name">Name</label>
                        <input
                            placeholder="Name"
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="formInputContainer">
                        <label htmlFor="phonenumber">PhoneNumber</label>
                        <input
                            placeholder="Phone Number"
                            id="phonenumber"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="formInputContainer">
                        <label htmlFor="phonenumber">Password</label>
                        <input
                            placeholder="Password"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="formInputContainer">
                        <label htmlFor="confirmpassword">
                            Confirm Password
                        </label>
                        <input
                            placeholder="Confirm Password"
                            id="confirmpassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="signupFormSubmit" type="submit">
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignupFormPage;
