import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-high-scores',
  templateUrl: './high-scores.component.html',
  styleUrls: ['./high-scores.component.scss']
})
export class HighScoresComponent implements OnInit {

  scores = []
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(`${environment.api}/scores`).subscribe(data => {
      this.scores = <any>data
    })
  }

}
