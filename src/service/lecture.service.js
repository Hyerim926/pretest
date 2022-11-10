import 'reflect-metadata';
import { Container, Service } from 'typedi';
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
}

Container.set({ id: ExampleClass, type: ExampleClass });
Container.set({ id: LectureService, type: LectureService });

export { ExampleClass, LectureService };
