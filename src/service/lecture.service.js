import 'reflect-metadata';
import { Container } from 'typedi';
import lectureRepository from '../repository/lecture.repository';

class LectureService {
    constructor() {
        this.lectureRepository = lectureRepository;
    }

    async getLectureByOne(lectureId) {
        const isExist = await this.lectureRepository.isExist(lectureId);

        if (isExist) {
            const lectureInfo = await this.lectureRepository.getInfoByOneLecture(lectureId);
            const studentList = await this.lectureRepository.getStudentInfoByOneLecture(lectureId);

            return { lectureInfo, studentList };
        }

        throw new Error('no data for request');
    }

    async addLecture(lectureReq) {
        await this.lectureRepository.createLecture(lectureReq);
    }

    async addBulkLecture(lectureReq) {
        await this.lectureRepository.createBulkLecture(lectureReq);
    }

    async updateStatusOpen(lectureId) {
        await this.lectureRepository.updateOpenStatus(lectureId);
    }

    async deleteLecture(lectureId) {
        const studentCount = await this.lectureRepository.checkStudent(lectureId);

        if (studentCount > 0) {
            throw new Error('existence of student');
        } else {
            await this.lectureRepository.deleteLecture(lectureId);
        }
    }

    async updateInfoLecture(id, lectureReq) {
        await this.lectureRepository.updateInfo(id, lectureReq);
    }
}

Container.set({ id: LectureService, type: LectureService });

export default LectureService;
