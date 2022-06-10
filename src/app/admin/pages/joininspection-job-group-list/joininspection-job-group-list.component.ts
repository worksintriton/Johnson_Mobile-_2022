import { Component, OnInit, Inject,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-joininspection-job-group-list',
  templateUrl: './joininspection-job-group-list.component.html',
  styleUrls: ['./joininspection-job-group-list.component.css']
})
export class JoininspectionJobGroupListComponent implements OnInit {
  apiUrl = environment.apiUrl;
  imgUrl = environment.imageURL;
  rows = [];
  searchQR:any;
  value1:any;

  S_Date: any;
  E_Date: any;
  job_detail_no : string = '';
  user_type_value : string = '';
  date_and_time : string = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
  pet_type_list : any = [];
  pet_type_id : string = '';

  update_button : boolean;
  selectedimgae : any;


  rows1 : any;
  activity_name : any;


  joint_inspection_groupdetail : any;

  @ViewChild('imgType', { static: false }) imgType: ElementRef;

  constructor(
    private toastr:ToastrManager,
    private router: Router,
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private _api: ApiService,
    private routes: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {

    this.job_detail_no = '';
    this.user_type_value = '0';
    // this.user_type_img = 'http://18.237.123.253:3000/api/uploads/template.jpg';
    this.pet_type_id = '';
    this.update_button = true;




    var datas = this.storage.get('joint_inspection_groupdetail');
    console.log(datas);
    this.joint_inspection_groupdetail = datas;

    this.listpettype();

  }



  listpettype() {
    let a = {
      job_id : this.joint_inspection_groupdetail.job_id._id,
      group_id : this.joint_inspection_groupdetail.group_id
    }
    this._api.Joint_inspection_jobdetail_sub_group_list(a).subscribe(
      (response: any) => {
        console.log(response.Data);
        // this.rows = response.Data;
        this.rows =  (response.Data.reduce((acc, val) => {
          if (!acc.find(el => el.sub_group_id.sub_group_detail_name === val.sub_group_id.sub_group_detail_name)) {
            acc.push(val);
          }
          return acc;
        }, []));
        console.log(this.rows);
      }
    );
  }


  cancel() {
    this.update_button = true;
    this.job_detail_no= undefined;
  }
  ////// Inserting Data

  Insert_pet_type_details() {


    if(this.job_detail_no == ''){
      //alert("Please enter the pet type")
      this.showWarning("Please enter the pet type")
    }else{
      console.log(this.activity_name);
    let a = {
     'activedetail__id' : this.activity_name._id,
     'job_detail_no' : this.job_detail_no,
     'job_detail_created_at' : new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
     'job_detail_update_at' : "",
     'job_detail_created_by' : new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}),
     'job_detail_updated_by' : "",
     'update_reason':""
      };
    console.log(a);
    this._api.jobdetail_insert(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      if ( response.Code === 200 ) {
        //alert('Added Successfully');
        this.showSuccess("Added Successfully")
      }else {
        //alert(response.Message);
        this.showError(response.Message)
      }
      this.ngOnInit();
    }
  );
    }
  }


  Edit_pet_type_details(){
    if(this.job_detail_no == ''){
      //alert("Please enter the pet type")
      this.showWarning("Please enter the pet type")
    }else{
    let a = {
      '_id' : this.pet_type_id,
      'job_detail_no' : this.job_detail_no,
     };
    this._api.jobdetail_edit(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      //alert("Updated Successfully");
      this.showSuccess("Updated Successfully")
      this.ngOnInit();
    }
  );
    }
  }



  Deletecompanydetails(data) {
    let a = {
      '_id' : data
     };
    console.log(a);
    this._api.jobdetail_delete(a).subscribe(
    (response: any) => {
      console.log(response.Data);
      //alert('Deleted Successfully');
      this.showSuccess("Deleted Successfully")
      this.ngOnInit();
    }
  );
  }


  Editcompanydetailsdata(data) {
    this.update_button = false;
    this.pet_type_id = data._id;
    this.job_detail_no = data.job_detail_no ;
  }

    filter_date() {
      if ( this.E_Date != undefined && this.S_Date != undefined) {
        // let yourDate = new Date(this.E_Date.getTime() + (1000 * 60 * 60 * 24));
        let yourDate= this.E_Date.setDate(this.E_Date.getDate() + 1);

        let a = {
          "fromdate":this.datePipe.transform(new Date(this.S_Date),'yyyy-MM-dd'),
          "todate" : this.datePipe.transform(new Date(yourDate),'yyyy-MM-dd')
          }
        console.log(a);
        this._api.jobdetail_filter_date(a).subscribe(
          (response: any) => {
            console.log(response.Data);
            this.rows = response.Data;
          }
        );
      }
      else{
        this.showWarning("Please select the startdate and enddate");
        //alert('Please select the startdate and enddate');
      }

    }
    refersh(){
      this.listpettype();this.E_Date = undefined ; this.S_Date = undefined;
    }

    showSuccess(msg) {
      this.toastr.successToastr(msg);
    }

    showError(msg) {
        this.toastr.errorToastr(msg);
    }

    showWarning(msg) {
        this.toastr.warningToastr(msg);
    }


    saverange() {
    }






    view_joint_inspe_details(data){
      console.log(data);
      this.storage.set('joint_inspection_detail',data);
      this.router.navigateByUrl('/admin/joininspection_details');
    }



}
