package main

import (
	"log"
	"fiber-crud-api/store"
	"github.com/gofiber/fiber/v3"
)

func main() {
	app := fiber.New()

	app.Get("/", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Hello from Fiber",
		})
	})

	app.Get("/api/v1/users", func(c fiber.Ctx) error {
		return c.JSON(store.Users)
	})

	log.Fatal(app.Listen(":3000"))
}