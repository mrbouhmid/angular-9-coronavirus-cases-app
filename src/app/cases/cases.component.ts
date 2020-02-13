import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';
import { Cases } from '../cases';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'age', 'status'];
  data: Cases[] = [];
  isLoadingResults = true;

  constructor(private api: ApiService , private router : Router) { }

  ngOnInit(): void {
    this.api.getCases()
    .subscribe((res: any) => {
      this.data = res;
      console.log(this.data);
      this.isLoadingResults = false;
    }, err => {
      console.log(err);
      this.isLoadingResults = false;
    });
  }

  onViewCase(cases : Cases){
    this.router.navigate(['/cases-details/',cases.id]);
    //console.log(this.cases)
    //this.api.setData(cases);

}

}
