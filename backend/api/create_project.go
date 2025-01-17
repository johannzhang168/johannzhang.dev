package api

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/middleware"
	"github.com/johannzhang168/personal-website/backend/models"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProjectRequest struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Link        string   `json:"link"`
	Image       string   `json:"image"`
	Tags        []string `json:"tags"`
}

func CreateProject(app *fiber.App, collection *mongo.Collection) {
	app.Post("/projects", func(c *fiber.Ctx) error {
		user, err := middleware.GetCurrentUser(c)

		if err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		}

		if user == nil || user.Status != "ADMIN" {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized access",
			})
		}

		var request ProjectRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "Invalid request body",
				"error":   err,
			})
		}

		if request.Name == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Title is required",
			})
		}

		if request.Link == "" {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Link to project is required",
			})
		}

		project := &models.Project{
			Name:        request.Name,
			Description: request.Description,
			Link:        request.Link,
			Image:       request.Image,
			Tags:        request.Tags,
		}

		err = mgm.Coll(project).Create(project)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create newsletter",
			})
		}

		return c.Status(http.StatusCreated).JSON(project)

	})
}
