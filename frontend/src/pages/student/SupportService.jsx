import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SelectOption from '../../components/SelectOption';
import FileUploader from '../../components/FileUploader';
import { FileUpload } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getSupportServiceMemebers, postQuestion } from './api';
import { subjects } from '../../utiles';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const teachers = ["teacher - Nishantha", "teacher - Kamal"]

const SupportService = () => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    const [supportServiceMembers, setSupportServiceMembers] = useState([]);
    const [formData, setFormData] = useState({
        studentId: user?._id,
        grade: "",
        subject: "",
        teacher: "",
        category: "",
        topic: "",
        explanation: "",
        file: null
    });
    const [errors, setErrors] = useState({
        studentId: user?._id,
        grade: "",
        subject: "",
        teacher: "",
        category: "",
        topic: "",
        explanation: "",
    });

    useEffect(() => {
        getSupportServiceMemebers().then(res => {
            setSupportServiceMembers(res)
        })
    }, []);

    const handleOnChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        clearError(name)
    }

    const clearError = (fieldName) => {
        setErrors({ ...errors, [fieldName]: "" })
    }

    const formValidate = () => {
        const errors = {}
        let formIsValid = true

        if (formData.grade.trim() === "") {
            errors.grade = "Grade is required!"
            formIsValid = false
        }

        if (formData.subject.trim() === "") {
            errors.subject = "Subject is required!"
            formIsValid = false
        }

        if (formData.teacher.trim() === "") {
            errors.teacher = "Teacher is required!"
            formIsValid = false
        }

        if (formData.category.trim() === '') {
            errors.category = 'Category is required!';
            formIsValid = false;
        }

        if (formData.topic.trim() === '') {
            errors.topic = 'Topic is required!';
            formIsValid = false;
        }

        if (formData.explanation.trim() === '') {
            errors.explanation = 'Explanation is required!';
            formIsValid = false;
        }

        setErrors(errors)
        return formIsValid
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (formValidate()) {
            Swal.fire({
                title: "Are you sure?",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Submit"
            }).then((result) => {
                if (result.isConfirmed) {
                    postQuestion(formData).then(res => {
                        if (res) {
                            Swal.fire({
                                title: "Submitted!",
                                text: "Your form has been submitted successfully!.",
                                icon: "success"
                            });
                            setFormData({
                                studentId: "",
                                grade: "",
                                subject: "",
                                teacher: "",
                                category: "",
                                topic: "",
                                explanation: "",
                                file: null
                            })
                            navigate("/student/dashboard")
                        }
                    })
                }
            });
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Support Service
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="studentId"
                                required
                                fullWidth
                                id="studentId"
                                label="Student ID"
                                value={formData.studentId}
                                onChange={handleOnChange}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="grade"
                                label="Grade"
                                name="grade"
                                value={formData.grade}
                                onChange={handleOnChange}
                                helperText={errors.grade}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SelectOption
                                setDetails={setFormData}
                                details={formData}
                                name="subject"
                                label="Subject"
                                value={formData.subject}
                                items={subjects}
                                clearError={clearError} />
                            {errors.subject && <span className="text-red-600 text-[12px] pl-[14px]">{errors.subject}</span>}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <SelectOption
                                setDetails={setFormData}
                                details={formData}
                                name="teacher"
                                label="Staff member"
                                value={formData.teacher}
                                items={supportServiceMembers}
                                teachers={teachers}
                                clearError={clearError} />
                            {errors.teacher && <span className="text-red-600 text-[12px] pl-[14px]">{errors.teacher}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <SelectOption
                                setDetails={setFormData}
                                details={formData}
                                name="category"
                                label="Category"
                                value={formData.category}
                                items={["paper class", "Issue about class sessions", "Class schedule"]}
                                clearError={clearError} />
                            {errors.category && <span className="text-red-600 text-[12px] pl-[14px]">{errors.category}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="topic"
                                label="Topic"
                                name="topic"
                                value={formData.topic}
                                onChange={handleOnChange}
                                helperText={errors.topic}
                                FormHelperTextProps={{ sx: { color: "red" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <textarea
                                id="explanation"
                                rows="4"
                                name="explanation"
                                className="w-full text-sm text-gray-900 bg-white border-2 border-gray-300 rounded-sm py-1 px-3 :to-blue-700 outline-blue-700 placeholder:text-black/60"
                                placeholder="Explain your matter briefly"
                                required
                                value={formData.explanation}
                                onChange={handleOnChange}
                            />
                            {errors.explanation && <span className="text-red-600 text-[12px] pl-[14px]">{errors.explanation}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            Upload your file here (Optional)
                            <FileUploader
                                details={formData}
                                setDetails={setFormData}
                                Icon={<FileUpload
                                    style={{ width: "5rem", height: "5rem" }}
                                />}
                                uploadText="Only PDF, Image allowed"
                                acceptFileType="application/pdf,image/*"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container >
    )
}

export default SupportService