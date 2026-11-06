package main

import "fmt"

type Player struct {
	Name string
	Score int
}

func main(){
	for i:=0;i<5;i++{
		fmt.Println("Hello World")
	}

	hero := Player{Name:"Sachin Tendulkar", Score:200}

	hero.DisplayInfo()
	hero.IncrementScore()
	hero.DisplayInfo()
}



func (p Player) DisplayInfo(){
	fmt.Printf("Player: %s | Score: %d\n", p.Name, p.Score)
}

func (p *Player) IncrementScore(){
	p.Score++;
}