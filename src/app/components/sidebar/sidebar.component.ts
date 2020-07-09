import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() myuser;
  @Output()
  propagar = new EventEmitter<string>();

  text: string = ""
  mainText: string = ""
  extra: string = ""

  constructor(private router : Router) {
  }

  createTweet() {
    this.propagar.emit(this.text)
    this.text = '';
  }

  muchoTexto() {
    this.mainText = this.text.substr(0, 140)
    if (this.text.length > 140) {
      this.extra = this.text.substr(140)
    } else {
      this.extra = ''
    }
  }
}

