package api

import (
	"net/http"

	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/middleware"
	"github.com/johannzhang168/personal-website/backend/models"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func DeleteNewsLetter(app *fiber.App, collection *mongo.Collection) {
	app.Delete("/newsletters/delete/:id", func(c *fiber.Ctx) error {

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

		session, err := collection.Database().Client().StartSession()

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to start session",
			})
		}

		defer session.EndSession(context.Background())

		var deletedNewsletter models.DeletedNewsletter

		err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
			if err := session.StartTransaction(); err != nil {
				return err
			}
			var newsletter models.Newsletter

			err := collection.FindOne(sc, bson.M{"_id": objectID}).Decode(&newsletter)

			if err != nil {
				session.AbortTransaction(sc)
				return fiber.NewError(http.StatusNotFound, "Newsletter not found")
			}

			deletedNewsletter := &models.DeletedNewsletter{
				Title:         newsletter.Title,
				ImageURLs:     newsletter.ImageURLs,
				Content:       newsletter.Content,
				Published:     newsletter.Published,
				DatePublished: newsletter.DatePublished,
			}

			err = mgm.Coll(deletedNewsletter).Create(deletedNewsletter)

			if err != nil {
				session.AbortTransaction(sc)
				return err
			}

			_, err = collection.DeleteOne(sc, bson.M{"_id": objectID})

			if err != nil {
				session.AbortTransaction(sc)
				return err
			}

			if err := session.CommitTransaction(sc); err != nil {
				return err
			}

			return nil

		})

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": err.Error(),
			})
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"message":            "Newsletter deleted successfully",
			"deleted_newsletter": deletedNewsletter,
		})

	})
}
