import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/employee.service';
@Component({
  selector: 'app-employee-experiences',
  templateUrl: './employee-experiences.component.html',
  styleUrls: ['./employee-experiences.component.css']
})
export class EmployeeExperiencesComponent {

  counter:any
  dataArray:any = []
  messageErr="" ;
  addExperience! :  FormGroup;
  update!: FormGroup;
  dataExp = {
    id: '',
    entreprise: '',
    position_held: '',
    start_date: new Date(),
    end_date: new Date()
  }
  userdata:any;

  constructor(private empservice:EmployeeService,private route:Router, private toastr: ToastrService) {
    this.userdata = JSON.parse( sessionStorage.getItem('userdata') !) ;
console.log(this.userdata)
    this.addExperience = new FormGroup({
      entreprise: new FormControl('', [Validators.required]),
      position_held: new FormControl('', [Validators.required]),
      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required])

    });
    this.update = new FormGroup({
      entreprise: new FormControl(''),
      position_held: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl('')

    });
   }
   ngOnInit(): void {
    this.empservice.getexperiences(this.userdata.id).subscribe(data => {
      this.dataArray = data
      console.log(this.dataArray)
      this.counter = this.dataArray.length
      console.log(this.counter), (err: HttpErrorResponse) => {
        this.messageErr = "We dont't found any experience in our database"
      }
    })
  }

  getdata(entreprise: string, position_held: string,start_date: Date,end_date: Date, id: any) {
    this.dataExp.entreprise = entreprise
    this.dataExp.position_held = position_held
    this.dataExp.start_date = start_date
    this.dataExp.end_date = end_date
    this.dataExp.id = id
    console.log(this.dataExp)
  }

  addnewExperience(f: any) {
    const formData = new FormData();
    formData.append('entreprise', this.addExperience.value.entreprise);
    formData.append('position_held', this.addExperience.value.position_held);
    formData.append('start_date', this.addExperience.value.start_date);
    formData.append('end_date', this.addExperience.value.end_date);

    formData.append('user_id', this.userdata.id);

    let data = f.value
    this.empservice.createnewexperience(formData).subscribe(() => {
      this.toastr.success('Experience Succeffuly added!', 'Experiences!');
      setTimeout(() => {
        window.location.reload()
      }, 100);
    }, (err: HttpErrorResponse) => {
      this.messageErr = err.error
    });
  }

  updateExperiences(f: any) {
    let data = f.value
    const formData = new FormData();
    formData.append('entreprise', this.update.value.entreprise);
    formData.append('position_held', this.update.value.position_held);
    formData.append('start_date', this.update.value.start_date);
    formData.append('end_date', this.update.value.end_date);

    this.empservice.updateExperience(this.dataExp.id, formData).subscribe(response => {
      let indexId = this.dataArray.findIndex((obj: any) => obj.id == this.dataExp.id)
      this.dataArray[indexId].entreprise = data.entreprise
      this.dataArray[indexId].position_held = data.position_held
      this.dataArray[indexId].start_date = data.start_date
      this.dataArray[indexId].end_date = data.end_date

      this.toastr.success('Experience Succeffuly Updated!', 'EXperiences!');

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })

  }

  deleteExperience(id: any): void {
    this.empservice.deleteexperience(id).subscribe(
      () => {
        this.toastr.error('Experience Succeffuly Deleted!', 'Experiences!');
        setTimeout(() => {
          window.location.reload()
        }, 100);

      },
      (err: HttpErrorResponse) => {
        Swal.fire('Error!', err.message, 'error');
      }
    );
  }
}