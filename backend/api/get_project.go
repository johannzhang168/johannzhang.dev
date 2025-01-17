package api

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetProject(app *fiber.App, collection *mongo.Collection) {
	app.Get("/projects/get/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		objectID, err := primitive.ObjectIDFromHex(id)

		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid ID format",
			})
		}

		var project models.Project

		err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&project)
		if err != nil {
			return err
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"message": "Project found successfully",
			"project": project,
		})

	})
}
