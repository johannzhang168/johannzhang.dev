package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/middleware"
	"github.com/johannzhang168/personal-website/backend/models"
)

func GetCurrentUserRoute(app *fiber.App) {
	app.Get("/current-user", func(c *fiber.Ctx) error {
		user, err := middleware.GetCurrentUser(c)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		}

		userResponse := &models.SafeUser{
			ID:        user.ID.Hex(),
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			Status:    user.Status,
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"user": userResponse,
		})

	})

}
