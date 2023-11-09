import { Injectable, Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../Models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url: string;

  constructor(private http: HttpClient)
  {
    this.url = "https://b7b9-181-231-122-56.ngrok-free.app/student/";
  }

  GetAll() {
    return this.http.get(this.url + "getAll");
  }

  Add(student: Student) {
    return this.http.post(this.url, student);
  }

  Update(student: Student) {
    return this.http.post(this.url + student.id + "/update", student)
  }

  Delete(student: Student) {
    return this.http.post(this.url + student.id +"/delete", student)
  }
}
