package api

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetAllProjects(app *fiber.App, collection *mongo.Collection) {
	app.Get("/projects/get", func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		findOptions := options.Find()
		findOptions.SetSort(bson.D{{Key: "created_at", Value: -1}})
		cursor, err := collection.Find(ctx, bson.D{}, findOptions)

		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to fetch projects",
			})
		}

		defer cursor.Close(ctx)

		projects := []models.Project{}

		if err := cursor.All(ctx, &projects); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse projects",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"projects": projects,
		})
	})
}
