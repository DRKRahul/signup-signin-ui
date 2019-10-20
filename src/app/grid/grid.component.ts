import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { GridService } from '../shared/grid.service';
import { AuthService } from '../shared/auth.service'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {
  usersData;
  updateForm: FormGroup;
  constructor(
    private gridService: GridService,
    private authService: AuthService,
    public router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.getAllUsers();
    this.createUpdateForm();
  }

  getAllUsers() {
    this.gridService.getAllUsers()
      .subscribe((res: any) => {
        this.usersData = res.data;
      }, (err) => {
        console.log("Errr*****", err);
      });
  }

  createUpdateForm() {
    this.updateForm = this.fb.group({
      id: ['',Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      hobbies: [''],
      location: ['']
    });
  }

  patchUpdateForm(data) {
    data.dob = data.dob.substring(0, 10);;
    this.updateForm.patchValue(data);
  }
  updateUserDetails() {
    //console.log(this.updateForm.value);
    this.gridService.updateUserDetails(this.updateForm.value)
      .subscribe((res:any) => {
        alert(res.message);
        this.updateForm.reset();
        this.getAllUsers();
      }, (err) => {
        alert(err.message);
        this.updateForm.reset();
      });
  }
  onLogout() {
    this.authService.logout();
  }
}
