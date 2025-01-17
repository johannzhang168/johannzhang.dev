package api

import (
	"context"
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/middleware"
	"github.com/johannzhang168/personal-website/backend/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UpdateProjectRequest struct {
	Name        *string   `json:"string,omitempty"`
	Description *string   `json:"description,omitempty"`
	Link        *string   `json:"link,omitempty"`
	Image       *string   `json:"image,omitempty"`
	Tags        *[]string `json:"tags,omitempty"`
}

func UpdateProject(app *fiber.App, collection *mongo.Collection) {
	app.Patch("/projects/edit/:id", func(c *fiber.Ctx) error {
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

		var request UpdateProjectRequest

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

		var updatedProject models.Project

		err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
			if err := session.StartTransaction(); err != nil {
				return err
			}

			update := bson.M{}

			if request.Name != nil {
				update["name"] = *request.Name
			}

			if request.Description != nil {
				update["description"] = *request.Description
			}

			if request.Image != nil {
				update["image"] = *request.Image
			}

			if request.Link != nil {
				update["link"] = *request.Link
			}

			if request.Tags != nil {
				update["tags"] = *request.Tags
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
				return fiber.NewError(http.StatusNotFound, "Project not found")
			}

			err = collection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&updatedProject)
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
			"message": "Project updated successfully",
			"Project": updatedProject,
		})

	})
}
