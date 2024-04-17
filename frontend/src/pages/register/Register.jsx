/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
    Avatar,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
} from "@mui/material"
import { ArrowForward, LockOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { simpleNotification, userRoles } from '../../utiles';
import { register } from '../../app/features/user/userApis';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrorMessage } from '../../app/features/user/userSlice';

const SelectOption = ({ setUserDetails, userDetails, name, label, value, items, clearError }) => {
    const handleChange = (e) => {
        if (name === "role") {
            setUserDetails({ ...userDetails, role: e.target.value });
            clearError(name)
        } else if (name === "gender") {
            setUserDetails({ ...userDetails, gender: e.target.value });
            clearError(name)
        }
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label={label}
                    name={name}
                    onChange={handleChange}
                >
                    {items?.map((item, i) => (
                        <MenuItem key={i} value={item}>{item}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

const Register = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        gender: "",
        nic: ""
    });
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        gender: "",
        nic: ""
    });
    const { user, error } = useSelector(state => state.user)

    // form validation
    const formValidate = () => {
        const errors = {}
        let formIsValid = true

        if (userDetails.firstName.trim() === "") {
            errors.firstName = "First name is required!"
            formIsValid = false
        }

        if (userDetails.lastName.trim() === "") {
            errors.lastName = "Last name is required!"
            formIsValid = false
        }

        if (userDetails.email.trim() === "") {
            errors.email = "Email is required!"
            formIsValid = false
        } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
            errors.email = 'Invalid email format!';
            formIsValid = false
        }

        if (userDetails.nic.trim() === '') {
            errors.nic = 'NIC is required!';
            formIsValid = false;
        } else if (userDetails.nic.trim().length !== 10 && userDetails.nic.trim().length !== 12) {
            errors.nic = "NIC number must be 10 or 12 characters long!"
            formIsValid = false
        } else if (userDetails.nic.trim().length === 10 && userDetails.nic.trim().charAt(9) !== 'V') {
            errors.nic = 'Last character must "V" for a 10-character NIC!';
            formIsValid = false;
        }

        if (userDetails.password.trim() === "") {
            errors.password = "Password is required!"
            formIsValid = false;
        } else if (userDetails.password.trim().length < 5) {
            errors.password = "Password must be at least 5 characters long!"
            formIsValid = false;
        }

        if (userDetails.role.trim() === "") {
            errors.role = "Role is required!"
            formIsValid = false;
        }

        if (userDetails.gender.trim() === "") {
            errors.gender = "Gender is required!"
            formIsValid = false;
        }

        setErrors(errors)
        return formIsValid
    }

    useEffect(() => {
        if (!user && error !== "") {
            dispatch(clearErrorMessage())
        }
    }, [user, error, dispatch]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formValidate()) {
            dispatch(register({ ...userDetails, navigate }))
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
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={userDetails.firstName}
                                onChange={onChangeHandler}
                                helperText={errors.firstName}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={userDetails.lastName}
                                onChange={onChangeHandler}
                                helperText={errors.lastName}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={userDetails.email}
                                onChange={onChangeHandler}
                                helperText={errors.email}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="nic"
                                label="NIC"
                                name="nic"
                                value={userDetails.nic}
                                onChange={onChangeHandler}
                                helperText={errors.nic}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={userDetails.password}
                                onChange={onChangeHandler}
                                helperText={errors.password}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectOption
                                setUserDetails={setUserDetails} userDetails={userDetails}
                                name="role"
                                label="Role"
                                value={userDetails?.role}
                                items={userRoles}
                                clearError={clearError}
                            />
                            {errors.role && <span className="text-red-600 text-[12px] pl-[14px]">{errors.role}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <SelectOption
                                setUserDetails={setUserDetails} userDetails={userDetails}
                                name="gender"
                                label="Gender"
                                value={userDetails?.gender}
                                items={["Male", "Female"]}
                                clearError={clearError}
                            />
                            {errors.gender && <span className="text-red-600 text-[12px] pl-[14px]">{errors.gender}</span>}
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link to="/login">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}

export default Register