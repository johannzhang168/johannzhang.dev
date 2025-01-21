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

var newsletterCollection *mongo.Collection
var projectCollection *mongo.Collection

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

	newsletterCollection = client.Database("dev").Collection("newsletters")
	projectCollection = client.Database("dev").Collection("projects")

	app := fiber.New()

	// ORIGINS := os.Getenv("ORIGINS")

	app.Use(cors.New(cors.Config{
		AllowOrigins: "https://johannzhang.dev",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization, X-Source-Page",
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	api.CreateNewsletter(app, newsletterCollection)
	api.UpdateNewsletter(app, newsletterCollection)
	api.DeleteNewsLetter(app, newsletterCollection)
	api.Register(app)
	api.Login(app)
	api.GetCurrentUserRoute(app)
	api.GetNewsletter(app, newsletterCollection)
	api.UploadToS3(app)
	api.GetAllNewsletters(app, newsletterCollection)
	api.CreateProject(app, projectCollection)
	api.GetAllProjects(app, projectCollection)
	api.GetProject(app, projectCollection)
	api.UpdateProject(app, projectCollection)
	api.DeleteProject(app, projectCollection)

	certFile := os.Getenv("SSL_CERT_FILE")
	keyFile := os.Getenv("SSL_KEY_FILE")

	log.Fatal(app.ListenTLS(":"+port, certFile, keyFile))

}
