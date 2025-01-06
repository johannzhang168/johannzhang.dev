package api

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/middleware"
	"github.com/johannzhang168/personal-website/backend/models"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo"
)

type NewsletterRequest struct {
	Title     string                `json:"title"`
	ImageURLs []string              `json:"image_urls"`
	Content   []models.ContentBlock `json:"content"`
}

func CreateNewsletter(app *fiber.App, collection *mongo.Collection) {
	app.Post("/newsletters", func(c *fiber.Ctx) error {

		user, err := middleware.GetCurrentUser(c)

		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		}

		if user == nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "User not authenticated",
			})
		}

		if user.Status != "ADMIN" {
			return c.Status(http.StatusForbidden).JSON(fiber.Map{
				"error": "User does not have access to this route",
			})
		}

		var request NewsletterRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "Invalid request body",
				"error":   err,
			})
		}

		if request.Title == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Title is required",
			})
		}

		newsletter := &models.Newsletter{
			Title:         request.Title,
			ImageURLs:     request.ImageURLs,
			Content:       request.Content,
			Published:     false,
			DatePublished: nil,
		}

		err = mgm.Coll(newsletter).Create(newsletter)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create newsletter",
			})
		}

		return c.Status(http.StatusCreated).JSON(newsletter)
	})
}
