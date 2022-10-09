import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  ngOnInit(): void {
   
  }
  public inject() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id! },
        func: addButton,
      });
    });
  }
}

const addButton = () => {
  let button = document.createElement("button")
  button.innerText = "hello world"
  document.querySelector(".chakra-stack")?.appendChild(button)
}