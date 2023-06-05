import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InternService } from 'src/app/services/intern.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-intern',
  templateUrl: './dashboard-intern.component.html',
  styleUrls: ['./dashboard-intern.component.css']
})
export class DashboardInternComponent implements OnInit{
  @ViewChild('verifiedBadge', { static: false }) verifiedBadge!: ElementRef;

  dataArray: any;
  userdata:any
  sous_categories: any;
  messageErr = '' ;
  counter:any
  todayDate=new Date();
    constructor(private route: Router,private intservice: InternService) {
    this.userdata = JSON.parse( sessionStorage.getItem('userdata') !) ;
  }
  ngOnInit(): void {

    this.intservice.getalloffres().subscribe(data => {
      this.dataArray = data
      this.sous_categories = this.dataArray.map((item: any) => {
        return item.offre_categories.map((offreCategory: any) => {
          return offreCategory.souscategorie.sous_categorie_name;
        });
      });
      this.counter = this.dataArray.length
      console.log(this.dataArray), (err: HttpErrorResponse) => {
        this.messageErr = "We dont't found any candidature in our database"
      }
    })
  }




  addrequest(id: any) {

    if (this.userdata) {
      const formData = new FormData();
      formData.append('offre_id', id);
      formData.append('user_id', this.userdata.id);
      formData.append('date_postulation',this.todayDate.toISOString());

      debugger
      this.intservice.addcandidature(formData).subscribe(() => {
        this.route.navigate(['/intern-candidatures'])

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
      this.intservice.addFavoris(formData).subscribe(() => {
        this.route.navigate(['/intern-favorit-list'])
  
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
