/* eslint-disable react/prop-types */
import {
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    Container,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from "@mui/material"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom"
import { userRoles } from "../../utiles";
import { editProfile } from "../../app/features/user/userApis";

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
                    disabled={name === "role" && userRoles.includes(userDetails.role)}
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

const EditProfile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useSelector(state => state.user)
    const [userDetails, setUserDetails] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        password: "",
        role: user?.role,
        gender: user?.gender,
        nic: user?.nic
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
    const redirectUrl = `/${location.pathname.split("/")[1]}/profile`

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

        if (userDetails.password.trim() !== "" && userDetails.password.trim().length < 5) {
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

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setUserDetails({ ...userDetails, [name]: value })
        clearError(name)
    }

    const clearError = (fieldName) => {
        setErrors({ ...errors, [fieldName]: "" })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (formValidate()) {
            const data = {
                userInfo: { ...userDetails, _id: user._id },
                navigate,
                redirectUrl
            }

            dispatch(editProfile(data))
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Edit Profile
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
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
                    <Box
                        component="div"
                        sx={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "space-between"
                        }}
                    >
                        <Link to={`${redirectUrl}`} className="flex-1">
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Cancel
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, flex: 1 }}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}

export default EditProfile