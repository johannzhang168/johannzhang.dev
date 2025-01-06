package api

import (
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/johannzhang168/personal-website/backend/models"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("secret")

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(app *fiber.App) {
	app.Post("/login", func(c *fiber.Ctx) error {
		var request LoginRequest

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

		if len(users) == 0 {
			return c.Status(http.StatusConflict).JSON(fiber.Map{
				"error": "No user with this email exists",
			})
		}

		var user models.User

		err = mgm.Coll(&models.User{}).First(bson.M{"email": request.Email}, &user)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error fetching user with this email",
				"error":   err,
			})
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.HashedPassword), []byte(request.Password)); err != nil {
			return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid Email or Password",
			})
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"user_id": user.ID.Hex(),
			"exp":     time.Now().Add(time.Hour * 72).Unix(),
		})

		tokenString, err := token.SignedString(jwtSecret)

		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to generate token",
			})
		}

		safeUser := &models.SafeUser{
			ID:        user.ID.Hex(),
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			Status:    user.Status,
		}

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"message": "Login successful",
			"token":   tokenString,
			"user":    safeUser,
		})
	})

}
