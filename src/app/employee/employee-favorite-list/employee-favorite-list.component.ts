import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-favorite-list',
  templateUrl: './employee-favorite-list.component.html',
  styleUrls: ['./employee-favorite-list.component.css']
})
export class EmployeeFavoriteListComponent {
  dataArray: any ;
  messageErr: any ;
  userdata: any;



  constructor(private usersService:EmployeeService) {
    this.userdata = JSON.parse( sessionStorage.getItem('userdata') !);

    }

  ngOnInit(): void {

    this.usersService.getallfavoris(this.userdata.id).subscribe(data=>{
      console.log(data)
      this.dataArray=data , (err:HttpErrorResponse)=>{
        console.log(err)
      this.messageErr="We dont't found this user in our database"}
      //console.log(this.dataArray)
    })

  }

  deleteFavoris(id:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteFavoris(id).subscribe(response=>{
          window.location.reload();
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })


  }


}