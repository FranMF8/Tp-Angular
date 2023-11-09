import { Component } from '@angular/core';
import { Student } from 'src/app/Models/student.model';
import { StudentService } from './../../Services/student.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {

  studentArray!: Student[]
  selectedStudent: Student
  dniFindActive: boolean;
  buttonText: string;
  listButtonText: string;
  toFindStudent: Student;
  foundStudent: Student | undefined;
  found: boolean;
  listVisible: boolean;
  loginService: any;
  renderer: any;

  constructor(private _studentService: StudentService) {
    this.selectedStudent = new Student();
    this.dniFindActive = false;
    this.buttonText = "🔍︎";
    this.listButtonText = "▲";
    this.toFindStudent = new Student();
    this.found = false;
    this.listVisible = false;
  }

  ngOnInit(): void {
    this.getAll();
  }
  getAll() {
    this._studentService.GetAll().subscribe( response => {
      this.studentArray = response as Student[];
    })
  }



  submitStudent(toAddStudent: Student) {

    if((toAddStudent.firstName != null || toAddStudent.firstName === "") && (toAddStudent.dni != null || toAddStudent.dni === 0) && (toAddStudent.email != null || toAddStudent.email === ""))
    {
      this._studentService.Add(toAddStudent).subscribe(response => {
        console.log(response);
        this.getAll();
      }, error => {
      console.error(error);
      });
    } else {
      confirm('Datos invalidos')
    }

  }

  changeStudent(toModifyStudent: Student) {
    if((toModifyStudent.dni !== 0 && toModifyStudent.dni != null) && (toModifyStudent.firstName !== "" && toModifyStudent.firstName != null) && (toModifyStudent.email !== "" && toModifyStudent.email != null))
    {
      this._studentService.Update(toModifyStudent).subscribe(response => {
        console.log(response);
        this.getAll();
      }, error => {
        console.error(error.error);
      });
    }  else {
      this.getAll()
      confirm('Datos invalidos')
    }

  }

  deleteRequest(student: Student) {
    this._studentService.Delete(student).subscribe(response => {
      console.log(response);
      this.getAll();
    }, error => {
      console.error(error);
    });
  }

  add() {
    this.submitStudent(this.selectedStudent);
    this.deselect();
  }

  edit() {
    this.changeStudent(this.selectedStudent)
    this.deselect();
  }

  deselect() {
    this.selectedStudent = new Student();
    this.found = false;
  }

  deselectChoose(toDeselectStudent: Student | undefined) {
    toDeselectStudent = new Student();
    this.found = false;
  }

  selectStudent(student: Student) {
    if(student !== this.selectedStudent) {
      this.selectedStudent = student;
      this.foundStudent = student;
      this.found = true;
    } else {
      this.deselect()
    }

  }

  deleteFromForm() {
    if(confirm('Estas seguro de querer eliminar al estudiante?')) {
      this.deleteRequest(this.selectedStudent);
    this.deselect();
    }
  }

  findByDNIActivate() {
    if(!this.dniFindActive) {
      this.buttonText = "+"
    }
    else {
      this.buttonText = "🔍︎"
    }
    this.dniFindActive = !this.dniFindActive;
  }

  changeFound() {
    if(this.found) {
      this.found = false;
      this.foundStudent = new Student();
      this.deselect();
      this.toFindStudent = new Student();
    } else {
      this.found = true;
    }
  }

  findByDNI() {
    this.foundStudent = this.studentArray.find(student => student.dni == this.toFindStudent.dni)
    if (this.foundStudent?.firstName && this.foundStudent !== null) {
      this.deselectChoose(this.foundStudent);
      this.found = true
    } else {
      this.found = false
      confirm('Estudiante no encontrado')
    }
  }

  showList() {

    if(this.listVisible) {
      this.listButtonText = "▲";
      this.listVisible = false;
    }
    else if(!this.listVisible) {
      this.listButtonText = "▼";
      this.listVisible = true;
    }
  }

  copyDataToClipboard(student: Student | undefined) {
    const clipboardData = `Nombre: ${student?.firstName}\nApellido: ${student?.lastName}\nDNI: ${student?.dni}\nEmail: ${student?.email}`;

    const tempTextarea = this.renderer.createElement('textarea');
    this.renderer.setAttribute(tempTextarea, 'style', 'position: absolute; top: -9999px');
    this.renderer.appendChild(document.body, tempTextarea);

    tempTextarea.value = clipboardData;
    tempTextarea.select();
    document.execCommand('copy');

    this.renderer.removeChild(document.body, tempTextarea);

    confirm('Texto copiado');
  }

  copyEmails() {
    var emailsChain = "";
    this.studentArray.forEach(element => {
      if(emailsChain === "") {
        emailsChain = element.email;
      } else {
        emailsChain = emailsChain + ", " + element.email;
      }
    });
    const tempTextarea = this.renderer.createElement('textarea');
    this.renderer.setAttribute(tempTextarea, 'style', 'position: absolute; top: -9999px');
    this.renderer.appendChild(document.body, tempTextarea);

    tempTextarea.value = emailsChain;
    tempTextarea.select();
    document.execCommand('copy');

    this.renderer.removeChild(document.body, tempTextarea);

    confirm('Texto copiado');
  }

}
