import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './SignupForm.css';
import LoginFormModal from '../LoginFormModal';
import { Avatar } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const CustomAvatar = withStyles({
    root: {
        width: '150px',
        height: '150px',
    },
})(Avatar);

function SignupFormPage({ showModal, setShowModal }) {
    const dispatch = useDispatch();
    const session = useSelector((state) => state.session);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    if (session.user && session.isLoaded) return <Redirect to="/" />;

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);

            dispatch(
                sessionActions.signup({
                    email,
                    name,
                    phoneNumber,
                    password,
                    confirmPassword,
                })
            )
                .then(() => {
                    nextPage();
                })
                .catch((res) => {
                    if (res.data && res.data.errors) setErrors(res.data.errors);
                });
        } else {
            setErrors(['Passwords must match']);
        }
    };

    const nextPage = () => {
        document.querySelector('.signupFormContainer').classList.toggle('next');
    };

    const handlePictureUpload = (e) => {
        e.preventDefault();
        dispatch(sessionActions.addProfilePicture(image));
    };

    const handleSkip = () => {
        dispatch(sessionActions.loadUserState());
    };

    return (
        <div className="signupFormContainer">
            <div className="signupPage1">
                <div className="signupFormHeader">
                    <h1>Sign Up</h1>
                </div>
                <form className="form1" onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
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
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="signupFormFooter">
                            <button className="signupFormSubmit" type="submit">
                                Sign Up
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="signupPage2">
                <form onSubmit={handlePictureUpload} className="form2">
                    <div className="fileWrapper">
                        <CustomAvatar
                            className="imgPreview"
                            src={preview && preview}
                        ></CustomAvatar>
                        <input
                            className="fileInput form2Input"
                            type="file"
                            accept="image/gif,image/jpeg,image/jpg,image/png"
                            onChange={updateFile}
                        ></input>
                    </div>
                    <label>Upload a Profile Picture</label>
                    <div className="form2Info">
                        <button className="uploadButton">Upload</button>
                        <div className="skipContainer">
                            <div
                                onClick={handleSkip}
                                className="skipProfileUpload"
                            >
                                Skip for now
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignupFormPage;
