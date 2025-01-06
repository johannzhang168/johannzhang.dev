package main

import (
	"context"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/johannzhang168/personal-website/backend/api"
	"github.com/johannzhang168/personal-website/backend/config"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collection *mongo.Collection

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file: ", err)
	}
	config.InitializeMgm()

	MONGODBURI := os.Getenv("MONGODB_URI")

	clientOptions := options.Client().ApplyURI(MONGODBURI)

	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.Background(), nil)

	if err != nil {
		log.Fatal(err)
	}

	collection = client.Database("dev").Collection("newsletters")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	api.CreateNewsletter(app, collection)
	api.UpdateNewsletter(app, collection)
	api.DeleteNewsLetter(app, collection)
	api.Register(app)
	api.Login(app)
	api.GetCurrentUserRoute(app)

	log.Fatal(app.Listen("0.0.0.0:" + port))

}
