package api

import "github.com/gofiber/fiber/v2"

func HealthCheck(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendStatus(200)
	})
}
