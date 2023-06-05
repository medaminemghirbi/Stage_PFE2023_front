
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import { SuperadminService } from 'src/app/services/superadmin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offre-job-condidature',
  templateUrl: './offre-job-condidature.component.html',
  styleUrls: ['./offre-job-condidature.component.css']
})
export class OffreJobCondidatureComponent {
  addinterview! :  FormGroup;
  p:number = 1 ;
  minDate!: string;
  counter:any
  dataArray:any = []
  messageErr="" ;
  messageError="" ;
  addcandidature! :  FormGroup;
  dataCand = {
    id: '',
    etat: '',
    interview_date: '' }
  userdata: any;
  is_updated: boolean = false;
  update!: FormGroup;
  todayDate=new Date();
  todayDate1: string;

  constructor(private adservice:AdminService,private route:Router, private toastr: ToastrService) {
    this.todayDate1 = this.todayDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    this.userdata = JSON.parse( sessionStorage.getItem('userdata') !) ;

    this.update = new FormGroup({
      interview_date: new FormControl('', [Validators.required]),
      etat: new FormControl(''),
    });

  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  ngOnInit(): void {
    this.minDate = this.formatDate(this.todayDate);	
    this.adservice.getallcandidaturesjob(this.userdata.id).subscribe(data => {
      this.dataArray = data
      console.log(this.dataArray)
      this.counter = this.dataArray.length
      console.log(this.counter), (err: HttpErrorResponse) => {
        this.messageErr = "We dont't found any candidature in our database"
      }
    })
  }

  deleteCandJob(id:any){
    this.adservice.deleteCandJob(id).subscribe(
      () => {
        this.toastr.success('Candidature was Succeffuly Deleted!', 'User!');
        setTimeout(() => {
          window.location.reload()
        }, 500);

      },
      (err: HttpErrorResponse) => {
        Swal.fire('Error!', err.message, 'error');
      }
    );

  }




  getdata(etat: string, interview_date:any, id: any) {
    this.dataCand.etat = etat
    this.dataCand.interview_date =interview_date
    this.dataCand.id = id

  }


  updateCandJob(f: any) {
    let data = f.value
    const formData = new FormData();
    formData.append('etat', this.update.value.etat);
    formData.append('interview_date', this.update.value.interview_date);
if(this.update.value.etat =='Interview' && this.update.value.interview_date == ''){
  this.messageError=" champs required" ;
  setTimeout(() => {
    window.location.reload()
  }, 200);
}else{
  this.adservice.updateCandJob(this.dataCand.id, formData).subscribe(response => {
    let indexId = this.dataArray.findIndex((obj: any) => obj.id == this.dataCand.id)
    this.dataArray[indexId].etat = data.etat
    this.toastr.success('Candidature Succeffuly Updated!', 'Candidature!');
    setTimeout(() => {
      window.location.reload()
    }, 500);
  }, (err: HttpErrorResponse) => {
    console.log(err);
  })
}

    }

    alert(){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Interview Is Not Scheduled For Today!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
      console.log("clicked")
    }

}

