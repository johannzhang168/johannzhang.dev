package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InitializeMgm() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file: ", err)
	}
	MONGODBURI := os.Getenv("MONGODB_URI")

	err = mgm.SetDefaultConfig(nil, "dev", options.Client().ApplyURI(MONGODBURI))
	if err != nil {
		log.Fatal("Failed to initialize mgm:", err)
	}
	log.Println("mgm successfully initialized")
}
