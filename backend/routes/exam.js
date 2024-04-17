import { Router } from "express";
import {
  deleteExamNotice,
  deleteQuestion,
  editQuestion,
  generateQuiz,
  getAllExamNotices,
  getAllQuestions,
  postQuestion,
  publishExamNotice,
  updateExamNotice,
} from "../controllers/exam.js";

const router = Router();

// post a question
router.post("/add-question", postQuestion);
router.delete("/delete-question/:questionId", deleteQuestion);
router.put("/edit-question/:questionId", editQuestion);

router.get("/get-questions", getAllQuestions);
router.get("/generate-quiz", generateQuiz);
router.get("/exam-notices", getAllExamNotices);
router.post("/publish-notice", publishExamNotice);
router.put("/update-exam-notice", updateExamNotice);
router.delete("/delete-exam-notice/:id", deleteExamNotice);

export default router;
