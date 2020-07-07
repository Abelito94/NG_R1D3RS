import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() myuser;
  tags = this.myuser.tags;

  constructor(private router : Router) {
  }

  logout(){
    localStorage.clear();
   
    this.router.navigate(['sign']); 
  }
}

