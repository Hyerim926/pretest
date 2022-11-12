import 'reflect-metadata';
import { Container } from 'typedi';
import lectureRepository from '../repository/lecture.repository';

class ExampleClass {
    print() {
        console.log('I am alive!');
    }
}

class LectureService {
    constructor() {
        this.lectureRepository = lectureRepository;
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
            await this.lectureRepository.deleteLecture(lectureId);
        } else {
            throw new Error('existence of student');
        }
    }
}

Container.set({ id: ExampleClass, type: ExampleClass });
Container.set({ id: LectureService, type: LectureService });

export { ExampleClass, LectureService };
