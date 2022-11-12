import express from 'express';
import lectureController from '../../controller/lecture.controller';
import { lectureValidation } from '../../middlewares/validator.middleware';

const router = express.Router();

router.route('/').get(lectureController.test);

router.route('/').post(lectureValidation.addLecture, lectureController.addLectureByOne);

router.route('/bulk').post(lectureValidation.addBulkLecture, lectureController.addLectureByBulk);

router.route('/active/:id').put(lectureController.updateStatusOpen);

router.route('/disable/:id').put(lectureController.deleteLecture);

export default router;
