package src

// This module will be imported by main.go

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Result struct {
	ProductID   int64   `json:"product_id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	Image       string  `json:"image"`
}

var MONGO_URL = os.Getenv("MONGO_URL")

// Connects to Mongodb and returns the client and context
func GetMongoClient() (*mongo.Client, context.Context) {
	if MONGO_URL == "" {
		fmt.Print("MONGO_URL is not set, will use localhost instead which means you need to run mongodb locally")
		fmt.Print("If you are running this on a server, please set the MONGO_URL environment variable")
		MONGO_URL = "mongodb://root:root@localhost:27017"
	}
	// Connect to Mongodb
	fmt.Println("Connecting to Mongodb...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(MONGO_URL))
	if err != nil {
		panic(err)
	}

	return client, ctx
}

// Export function to be used by main.go
