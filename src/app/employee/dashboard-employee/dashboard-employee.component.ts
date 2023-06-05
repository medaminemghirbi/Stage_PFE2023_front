import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { SuperadminService } from 'src/app/services/superadmin.service';
import Swal from 'sweetalert2';
declare var $: any; // Declare jQuery

@Component({
  selector: 'app-dashboard-employee',
  templateUrl: './dashboard-employee.component.html',
  styleUrls: ['./dashboard-employee.component.css']
})
export class DashboardEmployeeComponent  implements OnInit{
  @ViewChild('verifiedBadge', { static: false }) verifiedBadge!: ElementRef;

  dataArray: any;
  dataArray2: any;
  userdata:any
  sous_categories: any;
  messageErr = '' ;
  counter:any
  todayDate=new Date();
    constructor(private route: Router,private empservice: EmployeeService,private supservice: SuperadminService) {
    this.userdata = JSON.parse( sessionStorage.getItem('userdata') !) ;
  }
  ngOnInit(): void {

    this.empservice.getalloffres().subscribe(data => {
      this.dataArray = data
   /*   this.sous_categories = this.dataArray.map((item: any) => {
        return item.offre_categories.map((offreCategory: any) => {
          return offreCategory.souscategorie.sous_categorie_name;
        });
      });*/
      console.log(this.dataArray)
      this.counter = this.dataArray.length
      console.log(this.counter), (err: HttpErrorResponse) => {
        this.messageErr = "We dont't found any candidature in our database"
      }
    })

    this.supservice.getalldomains().subscribe(data => {
      this.dataArray2 = data
      console.log(this.dataArray)
      this.counter = this.dataArray.length
      console.log(this.counter), (err: HttpErrorResponse) => {
        this.messageErr = "We dont't found any domain in our database"
      }
    })
  }

  getcategorybydomain(id: any): void {
    this.empservice.getoffrebydomain(id).subscribe(data => {
      this.dataArray2 = data
      console.log(this.dataArray2)
      this.counter = this.dataArray2.length, (err: HttpErrorResponse) => {
        this.messageErr = "We dont't found any category in our database"
      }
    })
  }



  addrequest(id: any) {

    if (this.userdata) {
      const formData = new FormData();
      formData.append('offre_id', id);
      formData.append('user_id', this.userdata.id);
      formData.append('date_postulation',this.todayDate.toISOString());
      this.empservice.addcondidature(formData).subscribe(() => {
        this.route.navigate(['/employee-condidatures'])

        console.log(formData)
        Swal.fire('Saved!', '', 'success')
      }, (err: HttpErrorResponse) => {
        this.messageErr = err.error

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You cant Add Candidature on the same Offre twice '
        })

      });
    }
    else {
      Swal.fire('you must logged_in !', '', 'error')
      this.route.navigate(['/login'])
    }


  }
  addfavoris(id: any ) {

    if (this.userdata) {
      const formData = new FormData();
      formData.append('offre_id', id);
      formData.append('user_id', this.userdata.id);
      // let data=f.value
     // console.log(formData)
      this.empservice.addFavoris(formData).subscribe(() => {
        this.route.navigate(['/employee-favorite-list'])
  
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Add To Favorite Succefully  ',
          showConfirmButton: false,
          timer: 1500
        })
        // window.location.reload();
  
  
      }, (err: HttpErrorResponse) => {
        this.messageErr = err.error
  
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You cant twice ',
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500
        })
  
      });
    }
    else {
      Swal.fire('you must logged_in !', '', 'error')
      this.route.navigate(['/login'])
    }
  }
  



  verifiedtest(verified:boolean){

    if(verified == true){
      Swal.fire('Offre not Verified !', '', 'error')
    }else{
      Swal.fire('item Verified!', '', 'success')
    }
  }
}
