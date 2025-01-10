package api

import (
	"context"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetAllNewsletters(app *fiber.App, collection *mongo.Collection) {
	app.Get("/newsletters/get", func(c *fiber.Ctx) error {
		published := c.Query("published")

		var filter bson.M

		if published != "" {
			isPublished := published == "true"
			filter = bson.M{"published": isPublished}
		} else {

			filter = bson.M{"published": true}
		}

		findOptions := options.Find()
		findOptions.SetSort(bson.D{{Key: "date", Value: -1}})

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		cursor, err := collection.Find(ctx, filter, findOptions)
		if err != nil {
			fmt.Println(err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to fetch newsletters",
			})
		}
		defer cursor.Close(ctx)

		newsletters := []models.Newsletter{}
		if err := cursor.All(ctx, &newsletters); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to parse newsletters",
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"newsletters": newsletters,
		})
	})
}
