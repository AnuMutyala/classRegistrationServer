import { getRepository, In } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Student } from "../entity/Student";
import { Teacher } from "../entity/Teacher";
import { Notification } from "../entity/Notification";
import { Register } from "../entity/Register";


// export class RegisterController {
module.exports = class RegisterController {
    private studentRepository = getRepository(Student);
    private teacherRepository = getRepository(Teacher);
    private notificationRepository = getRepository(Notification);
    private registerRepository = getRepository(Register);

    async commonstudents(request: Request, response: Response, next: NextFunction) {
        let teacherLength;
        if (typeof request.query.teacher == "string") {
            teacherLength = 1
        }
        else {
            teacherLength = request.query.teacher.length
        }
        //         SELECT * from classRegistration.student s
        // inner join classRegistration.register a on s.id = a.studentId
        // inner join classRegistration.teacher t on t.id = a.teacherId
        // WHERE t.emailId IN ("teacher1@gmail.com","teacher2@gmail.com") 
        // GROUP BY a.studentId 
        // HAVING COUNT(DISTINCT a.teacherId)=2;
        let a = await this.studentRepository
            .createQueryBuilder("student")
            .innerJoinAndSelect("register", "a", "student.id = a.studentId")
            .innerJoinAndSelect("teacher", "t", "t.id = a.teacherId")
            .where("t.emailId IN (:q)", { q: request.query.teacher })
            .groupBy("a.studentId")
            .having("COUNT(DISTINCT a.teacherId)= :w", { w: teacherLength })
            .select("student.emailId")
            .getMany();

        return a
    }

    async register(request: Request, response: Response, next: NextFunction) {
        //save teacher and students if not there ..
        //if teacher is there then only save the student 
        let teacherResult;
        if (request.body.teacher != '') {
            teacherResult = await this.teacherRepository.findOne({ emailId: request.body.teacher });
            if (!teacherResult) {
                let teacher = new Teacher();
                teacher.emailId = request.body.teacher;
                teacherResult = await this.teacherRepository.save(teacher);
            }
        }
        for (let i = 0; i < request.body.students.length; i++) {
            try {
                if (request.body.students[i] != '') {
                    let studentResult = await this.studentRepository.findOne({ emailId: request.body.students[i] });
                    console.log("studentResult:: ", studentResult)
                    if (!studentResult) {
                        let student = new Student();
                        student.emailId = request.body.students[i];
                        studentResult = await this.studentRepository.save(student);
                    }

                    let registerExisted = await this.registerRepository.findOne({ studentId: studentResult.id, teacherId: teacherResult.id });
                    if (!registerExisted && studentResult && teacherResult) {
                        let register = new Register();
                        register.studentId = studentResult.id;
                        register.teacherId = teacherResult.id;
                        await this.registerRepository.save(register);
                    }
                    return response.status = 200;

                }
            }
            catch (e) {
                return response.status = 404;
            }
        }
    }

    async suspend(request: Request, response: Response, next: NextFunction) {
        //suspend a student
        let studentToSuspend = await this.studentRepository.findOne({ emailId: request.body.student });
        if (studentToSuspend) {
            if (studentToSuspend.suspended != 1) {
                studentToSuspend.suspended = 1;
                await this.studentRepository.save(studentToSuspend);
                return response.status = 200;
            }
            else {
                return response.status = 202;
            }
        }
        else {
            //student is not registered
            return response.status = 404
        }

    }

    async notification(request: Request, response: Response, next: NextFunction) {
        //no of times to loop through this
        // number of students given in request body + no of students to this teacher(No duplication with students in request body)  
        let students = request.body.notification.split(" ");
        let studentFinal = [];
        let notificationString = "";
        students.forEach(student => {
            if (student.includes("@", 1)) {
                studentFinal.push(student.slice(1, student.length))
            }
            else {
                notificationString = notificationString + " " + student
            }

        });

        //No. of students to the teacher
        let studentFromRepo = await this.studentRepository
            .createQueryBuilder("student")
            .innerJoinAndSelect("register", "a", "student.id = a.studentId")
            .innerJoinAndSelect("teacher", "t", "t.id = a.teacherId")
            .where("t.emailId = :q", { q: request.body.teacher })
            .select("student.emailId")
            .getMany();
        if (studentFromRepo.length > 0) {
            studentFromRepo.forEach(stuFromRepo => {
                if (!studentFinal.includes(stuFromRepo.emailId)) {
                    studentFinal.push(stuFromRepo.emailId)
                }

            });
        }

        let teacher = await this.teacherRepository.findOne({ emailId: request.body.teacher });
        if (!teacher) {
            return response.status(200).send("Teacher or student are invalid")
        }
        if (studentFinal.length > 0) {
            studentFinal.forEach(async studentNotiFinal => {
                let student = await this.studentRepository.findOne({ emailId: studentNotiFinal, suspended: 0 });
                if (student && teacher) {
                    let notification = new Notification();
                    notification.notification = notificationString;
                    notification.teacherId = teacher.id;
                    notification.studentId = student.id;
                    let finalNotification = await this.notificationRepository.save(notification);
                    // select s.emailId from classRegistration.notification n
                    //  inner join classRegistration.student s 
                    // on s.id = n.studentId  order by n.createdAt DESC limit 5;
                    let notificationRepo = await this.notificationRepository
                        .createQueryBuilder("n")
                        .innerJoinAndSelect("student", "s", "s.id = n.studentId")
                        .select("s.id as id , s.emailId as receipents")
                        .orderBy("n.createdAt", 'DESC')
                        .limit(studentFinal.length)
                        .getRawMany();
                    return response.send({ reciepients: notificationRepo })



                }


            });
        }
        else {
            return response.status(200).send("Teacher or student are invalid")
        }
    }

}
