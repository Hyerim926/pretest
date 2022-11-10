import express from 'express';
import lectureController from '../../controller/lecture.controller';

const router = express.Router();

router.route('/').get(lectureController.test);

router.route('/').post(lectureController.addLectureByOne);

export default router;
