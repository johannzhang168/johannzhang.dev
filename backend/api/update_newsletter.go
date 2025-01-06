package api

import (
	"context"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/middleware"
	"github.com/johannzhang168/personal-website/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UpdateNewsletterRequest struct {
	Title     *string                `json:"title,omitempty"`
	ImageURLs *[]string              `json:"image_urls,omitempty"`
	Content   *[]models.ContentBlock `json:"content,omitempty"`
	Published *bool                  `json:"published,omitempty"`
}

func UpdateNewsletter(app *fiber.App, collection *mongo.Collection) {
	app.Put("/newsletters/:id", func(c *fiber.Ctx) error {
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
		id := c.Params("id")

		objectID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid ID format",
			})
		}

		var request UpdateNewsletterRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"message": "Invalid request body",
				"error":   err,
			})
		}

		session, err := collection.Database().Client().StartSession()

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to start session",
			})
		}

		defer session.EndSession(context.Background())

		var updatedNewsletter models.Newsletter

		err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
			if err := session.StartTransaction(); err != nil {
				return err
			}
			update := bson.M{}

			if request.Title != nil {
				update["title"] = *request.Title
			}
			if request.ImageURLs != nil {
				update["image_urls"] = *request.ImageURLs
			}
			if request.Content != nil {
				update["content"] = *request.Content
			}
			if request.Published != nil {
				update["published"] = *request.Published
				if *request.Published {
					now := primitive.NewDateTimeFromTime(time.Now())
					update["date_published"] = now
				} else {
					update["date_published"] = nil
				}
			}

			result, err := collection.UpdateOne(
				context.Background(),
				bson.M{"_id": objectID},
				bson.M{"$set": update},
			)

			if err != nil {
				return err
			}

			if result.MatchedCount == 0 {
				return fiber.NewError(http.StatusNotFound, "Newsletter not found")
			}

			err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&updatedNewsletter)
			if err != nil {
				return err
			}

			return nil
		})

		if err != nil {
			if mongo.IsDuplicateKeyError(err) {
				return c.Status(http.StatusConflict).JSON(fiber.Map{"error": "Duplicate key error"})
			}
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Transaction failed",
				"cause": err.Error(),
			})
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"message":    "Newsletter updated successfully",
			"newsletter": updatedNewsletter,
		})
	})
}
