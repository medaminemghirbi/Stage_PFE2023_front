import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SuperadminService } from 'src/app/services/superadmin.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-all-offres',
  templateUrl: './all-offres.component.html',
  styleUrls: ['./all-offres.component.css']
})
export class AllOffresComponent {
  counter:any
  dataArray:any = []
  messageErr="" ;

  offre = {
    id: '',
    verified: ''
  }
  update!: FormGroup;
  constructor(private sprservice:SuperadminService,private route:Router, private toastr: ToastrService) {

    this.update = new FormGroup({
      verified: new FormControl(''),
    });
  }
  async ngOnInit(): Promise<void> {
    try {
      const data = await this.sprservice.getalloffres().toPromise();
      this.dataArray = data;
      console.log(this.dataArray);
      this.counter = this.dataArray.length;
    } catch (error) {
      this.messageErr = "We don't found any offre in our database";
    }
  }


  getdata(verified: string, id: any) {
    this.offre.verified = verified
    this.offre.id = id
    console.log(this.offre)
  }

  addverification(f: any) {
    let data = f.value
    const formData = new FormData();
    formData.append('verified', this.update.value.verified);
    this.sprservice.addverification(this.offre.id, formData).subscribe(response => {
      let indexId = this.dataArray.findIndex((obj: any) => obj.id == this.offre.id)
      this.dataArray[indexId].verified = data.verified
      this.toastr.success('Offre  is Succeffuly Verified!', 'Offre!');

      setTimeout(() => {
        window.location.reload();
      }, 900);
    }, (err: HttpErrorResponse) => {
      console.log(err);
    })

  }
  deleteOffre(id:any){
    this.sprservice.deleteOffre(id).subscribe(
      () => {
        this.toastr.success('Offre Succeffuly Deleted!', 'Offre!');
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
