package api

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/johannzhang168/personal-website/backend/models"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

func Register(app *fiber.App) {
	app.Post("/register", func(c *fiber.Ctx) error {
		var request RegisterRequest
		if err := c.BodyParser(&request); err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		var users []models.User

		err := mgm.Coll(&models.User{}).SimpleFind(&users, bson.M{"email": request.Email})

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to check if user exists",
			})
		}

		if len(users) != 0 {
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"error": "User with this email already exists",
			})
		}

		hashedpassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to hash password",
			})
		}

		user := &models.User{
			FirstName:      request.FirstName,
			LastName:       request.LastName,
			Name:           request.FirstName + " " + request.LastName,
			Email:          request.Email,
			HashedPassword: string(hashedpassword),
			Status:         "USER",
		}

		if err := mgm.Coll(user).Create(user); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create user",
			})
		}

		return c.Status(http.StatusCreated).JSON(fiber.Map{
			"message": "User registered successfully",
			"user":    user,
		})
	})
}
