import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  init = true
  play = false
  setName = false
  tokens = []
  showSettingForName = false

  turn = false
  players =  {}

  message = ''

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  resetTokens(){
    this.tokens = [
      [0 ,0, 0],
      [0 ,0, 0],
      [0 ,0, 0]
    ]
  }


  onPlay(){
    this.resetTokens()
    this.init = false
    this.play = true

    if(!this.setName) this.reset()
  }

  reset(){
    this.play = true
    this.resetTokens()
    this.players =  {
      a: {
        name: '',
        score: 0,
        _id: ''
      },
      b: {
        name: '',
        score: 0,
        _id: ''
      }
    }
    this.showSettingForName = true
  }

  onSetName(){
    if(!(<any>this.players).a.name.trim() || !(<any>this.players).b.name.trim()){
      alert('Name is required')
      return
    }

    this.http.post(`${environment.api}/users`,
      {
        player1: (<any>this.players).a.name,
        player2: (<any>this.players).b.name
      }
    ).subscribe(data => {
      (<any>this.players).a._id = data[0]._id;
      (<any>this.players).b._id = data[1]._id;
      this.showSettingForName = false
      this.setName = true
    })
  }

  checkWinner(p, i){
    if(this.tokens[p][i]) return
    this.tokens[p][i] = this.turn ? 2 : 1
    let player = this.tokens[p][i]
    if(this.horizontal(p, player)) this.setWinner()
    else if(this.vertical(i, player)) this.setWinner()
    else if(this.diagonal(player)) this.setWinner()
    else if(this.draw()) this.setWinner(true)
    else this.turn = !this.turn
  }

  setWinner(draw = false){
    this.message = 'Draw'
    if(!draw){
      let winner = this.turn ? 'b' : 'a'
      this.players[winner].score++
      this.message = `Winner is ${this.players[winner].name}`

      this.http.post(`${environment.api}/scores/${this.players[winner]._id}`,{}).subscribe(data => {
      })
    }
    this.play = false
  }

  horizontal(parentIndex, player){
    for(let i of this.tokens[parentIndex]){
      if(i !== player) return
    }
    return true
  }

  vertical(itemIndex, player){
    for(let row of this.tokens){
      if(row[itemIndex] !== player) return
    }
    return true
  }

  diagonal(player){
    if(this.tokens[1][1] === player){
      if(this.tokens[0][0] === player && this.tokens[2][2] === player) return true
      if(this.tokens[0][2] === player && this.tokens[2][0] === player) return true
    }
    return
  }

  draw(){
    for(let row of this.tokens)
      for(let i of row)
        if(!i) return

    return true
  }
}
