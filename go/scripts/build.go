/* go:build ignore */
package main

import (
	"fmt"
	"os/exec"
)

func main(){
	 fmt.Println("Building application...")
	 cmd:= exec.Command("go", "build", "-o", "bin/app", "main.go")

	 if err := cmd.Run(); err != nil{
		fmt.Println("Build failed:", err)		
		return
	}

		fmt.Println("Build successful!")
}

