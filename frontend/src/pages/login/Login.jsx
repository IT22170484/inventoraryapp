import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrorMessage } from '../../app/features/user/userSlice';
import { simpleNotification } from '../../utiles';
import { login } from '../../app/features/user/userApis';
import { ArrowForward } from '@mui/icons-material';

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const { user, error } = useSelector(state => state.user)

    const formValidate = () => {
        const errors = {}
        let formIsValid = true

        if (userDetails.email.trim() === "") {
            errors.email = "Email is required!"
            formIsValid = false
        } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
            errors.email = 'Invalid email format!';
            formIsValid = false
        }

        if (userDetails.password.trim() === "") {
            errors.password = "Password is required!"
            formIsValid = false;
        } else if (userDetails.password.trim().length < 5) {
            errors.password = "Password must be at least 5 characters long!"
            formIsValid = false;
        }

        setErrors(errors)
        return formIsValid
    }

    useEffect(() => {
        if (error !== "") {
            dispatch(clearErrorMessage())
        }
    }, [user, error, dispatch]);

    useEffect(() => {
        if (user?.role === "Inventory Manager") {
            return navigate("/inventory/dashboard")
        } else if (user?.role === "Inventory Staff") {
            return navigate("/inventory/dashboard")
        } else if (user?.role === "Exam Administrator") {
            return navigate("/exam/dashboard")
        } else if (user?.role === "Help Desk Supporter") {
            return navigate("/student-support/dashboard")
        } else if (user?.role === "Student") {
            return navigate("/student/dashboard")
        }
    }, [user, navigate]);

    // show error message if exist
    if (error !== "") {
        simpleNotification("error", error)
    }

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setUserDetails({ ...userDetails, [name]: value })
        clearError(name)
    }

    const clearError = (fieldName) => {
        setErrors({ ...errors, [fieldName]: "" })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formValidate()) {
            dispatch(login(userDetails))
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: "end",
                    gap: "10px",
                    padding: "10px 10px 0px 0px",
                    position: "fixed",
                    top: 0,
                    right: 0,
                }}
            >
                <Link to="/">Return to home</Link><ArrowForward />
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        onChange={onChangeHandler}
                        FormHelperTextProps={{ sx: { color: "red" } }}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="password"
                        onChange={onChangeHandler}
                        FormHelperTextProps={{ sx: { color: "red" } }}
                        helperText={errors.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Box textAlign="right">
                        <Link to="/register">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}

export default Login