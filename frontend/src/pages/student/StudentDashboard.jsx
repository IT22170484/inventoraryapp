import { ShoppingCart, Warning } from "@mui/icons-material"
import { Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"
import { getPastPapers, getQuestionsByStudentId } from "./api";

const StudentDashboard = () => {
    const [noOfAskedQuestions, setNoOfAskedQuestions] = useState(0);
    const [noOfUploadedPapers, setNoOfUploadedPapers] = useState(0);
    const { user } = useSelector(state => state.user)

    useEffect(() => {
        getQuestionsByStudentId(user._id).then(res => setNoOfAskedQuestions(res.length))
    }, [user._id]);

    useEffect(() => {
        getPastPapers().then(res => {
            const count = res.filter(({ paper }) => {
                return paper.userId === user._id
            })
            setNoOfUploadedPapers(count.length)
        })
    }, [user._id]);

    return (
        <div className="p-5">
            <Typography component="h1" variant="h5">
                Dashboard
            </Typography>

            <div className="w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-2 place-items-center gap-5 mt-10">
                    <div className="h-[150px] w-full border-2 flex items-center justify-center flex-col rounded-lg shadow-md text-center font-bold text-xl">
                        <div className="p-3 bg-blue-600 rounded-full">
                            <ShoppingCart fontSize="large" className="text-white" />
                        </div>
                        No of questions
                        <span className="font-normal">{noOfAskedQuestions}</span>
                    </div>
                    <div className="h-[150px] w-full border-2 flex items-center justify-center flex-col rounded-lg shadow-md text-center font-bold text-xl">
                        <div className="p-3 bg-red-600 rounded-full">
                            <Warning fontSize="large" className="text-white" />
                        </div>
                        No of papers
                        <span className="font-normal">{noOfUploadedPapers}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 mt-10 max-w-sm mx-auto">
                <Link to="/student/support-service" className="py-2 bg-[#1f2937ea] hover:bg-[#1F2937] font-bold uppercase rounded-full duration-300 text-white w-full text-center">Ask a question</Link>
                <Link to="/student/replies" className="py-2 bg-[#1f2937ea] hover:bg-[#1F2937] hover:bg-[] font-bold uppercase rounded-full duration-300 text-white w-full text-center">View replies</Link>
                <Link to="/student/paper-upload" className="py-2 bg-[#1f2937ea] hover:bg-[#1F2937] hover:bg-[] font-bold uppercase rounded-full duration-300 text-white w-full text-center">Upload papers</Link>
                <Link to="/student/check-results" className="py-2 bg-[#1f2937ea] hover:bg-[#1F2937] hover:bg-[] font-bold uppercase rounded-full duration-300 text-white w-full text-center">Check paper results</Link>
            </div>
        </div>
    )
}

export default StudentDashboard