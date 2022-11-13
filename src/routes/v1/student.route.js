import express from 'express';
import studentController from '../../controller/student.controller';
import { studentValidator } from '../../middlewares/validator.middleware';

const router = express.Router();

router.route('/signup').post(studentValidator.signUp, studentController.signUp);

router.route('/withdraw/:id').put(studentController.withdraw);

router.route('/enrol').post(studentController.enrolLecture);

export default router;
