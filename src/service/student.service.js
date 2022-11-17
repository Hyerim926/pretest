import 'reflect-metadata';
import { Container } from 'typedi';
import studentRepository from '../repository/student.repository';

class StudentService {
    constructor() {
        this.studentRepository = studentRepository;
    }

    async signUp(studentReq) {
        await this.studentRepository.addStudent(studentReq);
    }

    async withdraw(studentId) {
        await this.studentRepository.deleteStudent(studentId);
        await this.studentRepository.updateEnrolmentStatus(studentId);
    }

    async enrolLecture(enrolReq) {
        const isJoined = await this.studentRepository.isJoined(enrolReq.studentId);
        if (isJoined) {
            await this.studentRepository.enrollLecture(enrolReq);
        }
    }
}

Container.set({ id: StudentService, type: StudentService });

export default StudentService;
