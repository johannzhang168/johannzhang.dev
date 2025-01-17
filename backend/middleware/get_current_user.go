package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/johannzhang168/personal-website/backend/models"
	"github.com/kamva/mgm/v3"
)

var jwtSecret = []byte("secret")

func GetCurrentUser(c *fiber.Ctx) (*models.User, error) {
	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return nil, nil
	}

	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return nil, nil
	}

	tokenString := tokenParts[1]

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		return nil, nil
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, nil
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		return nil, nil
	}

	var user models.User
	err = mgm.Coll(&models.User{}).FindByID(userID, &user)
	if err != nil {
		return nil, nil
	}

	return &user, nil
}
