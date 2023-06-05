import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-internship-offers',
  templateUrl: './admin-internship-offers.component.html',
  styleUrls: ['./admin-internship-offers.component.css']
})
export class AdminInternshipOffersComponent {
  p:number = 1 ;
  counter:any
  dataArray:any = []
  dataArray2:any = []
  messageErr="" ;
  addcandidature! :  FormGroup;
  dataCand = {
    id: '',
    etat: ''  }
  userdata: any;

  constructor(private adservice:AdminService,private route:Router, private toastr: ToastrService) {

    this.userdata = JSON.parse( sessionStorage.getItem('userdata') !) ;

  }
  async ngOnInit(): Promise<void> {

    try {
      const data = await this.adservice.getallintership(this.userdata.id).toPromise();
      this.dataArray=data
      console.log(this.dataArray)
      this.counter = this.dataArray.length;
     } catch(error) {
      this.messageErr = "We don't found any internship offre in our database";
    }
  }

  deleteinternshipoffre(id:any){
    this.adservice.deleteinternshipoffre(id).subscribe(
      () => {
        this.toastr.success('Internship Offer was Succeffuly Deleted!', 'User!');
        setTimeout(() => {
          window.location.reload()
        }, 500);

      },
      (err: HttpErrorResponse) => {
        Swal.fire('Error!', err.message, 'error');
      }
    );

  }


}

