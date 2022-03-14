import { Component, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';

import { KeyboardService } from './../keyboard.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {

  constructor(public keyboard: KeyboardService) { }

  ngOnInit(): void {
  }

  onKeyClick(char: string) {
    console.log(`KEY CLICK: ${char}`);
    this.keyboard.triggerKeyEvent(char);
  }

  originalOrder (a: KeyValue<string,number>, b: KeyValue<string,number>): number {
    return 0;
  }
}
