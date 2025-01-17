package api

import (
	"bytes"
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gofiber/fiber/v2"
)

func UploadToS3(app *fiber.App) {
	app.Post("/upload", func(c *fiber.Ctx) error {
		fileHeader, err := c.FormFile("file")
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to get file from request",
			})
		}

		file, err := fileHeader.Open()
		if err != nil {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Failed to open file",
			})
		}
		defer file.Close()

		buf := new(bytes.Buffer)
		_, err = buf.ReadFrom(file)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to read uploaded file",
			})
		}

		accessPointArn := "arn:aws:s3:us-east-2:484907531451:accesspoint/" + os.Getenv("AWS_S3_ACCESS_POINT")
		awsRegion := os.Getenv("AWS_REGION")
		awsAccessKey := os.Getenv("AWS_ACCESS_KEY_ID")
		awsSecretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
		awsBucket := os.Getenv("S3_BUCKET_NAME")

		sourcePage := c.Get("X-Source-Page")

		var objectKey string

		if sourcePage == "newsletters" {
			objectKey = "newsletterImages/" + fileHeader.Filename
		} else if sourcePage == "projects" {
			objectKey = "projectImages/" + fileHeader.Filename
		} else {
			return c.Status(http.StatusBadRequest).JSON(fiber.Map{
				"error": "Improper source page",
			})
		}

		cfg, err := config.LoadDefaultConfig(
			context.TODO(),
			config.WithRegion(awsRegion),
			config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(awsAccessKey, awsSecretKey, "")),
		)
		if err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create AWS session",
			})
		}

		s3Client := s3.NewFromConfig(cfg)

		_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
			Bucket:      aws.String(accessPointArn),
			Key:         aws.String(objectKey + ".jpg"),
			Body:        bytes.NewReader(buf.Bytes()),
			ContentType: aws.String(http.DetectContentType(buf.Bytes())),
		})

		if err != nil {
			fmt.Println(err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": fmt.Sprintf("Failed to upload file to S3: %v", err),
			})
		}

		fileURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s",
			awsBucket, awsRegion, objectKey+".jpg")

		return c.Status(http.StatusOK).JSON(fiber.Map{
			"message": "File uploaded successfully",
			"url":     fileURL,
		})
	})
}
