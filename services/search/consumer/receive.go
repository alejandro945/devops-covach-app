package consumer

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"search/src"

	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"go.mongodb.org/mongo-driver/mongo"
)

func failOnErrorReceive(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

var searchCollection *mongo.Collection

func StartConsumer() {
	var RABBITMQ_CONNECTION_URL = os.Getenv("RABBITMQ_CONNECTION_URL")
	if RABBITMQ_CONNECTION_URL == "" {
		panic("RABBITMQ_CONNECTION_URL is not set")
	}

	// Connect to RabbitMQ
	fmt.Println("Connecting to RabbitMQ...")
	conn, err := amqp.Dial(RABBITMQ_CONNECTION_URL)
	failOnErrorReceive(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	ch, err := conn.Channel()
	failOnErrorReceive(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"products_search", // name
		true,              // durable
		false,             // delete when unused
		false,             // exclusive
		false,             // no-wait
		nil,               // arguments
	)
	failOnErrorReceive(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnErrorReceive(err, "Failed to register a consumer")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)
			var body = d.Body
			// Parse body to a struct
			var result src.Result = src.Result{}
			err := json.Unmarshal(body, &result)
			if err != nil {
				fmt.Println("Error: ", err)
			}
			fmt.Println("Result: ", result)

			// Insert to PostgreSQL
			ctxMongo, cancelMongo := context.WithTimeout(context.Background(), 10*time.Second)
			defer cancelMongo()
			client, _ := src.GetMongoClient()
			searchCollection = client.Database("search-db").Collection("search-collection")
			_, err = searchCollection.InsertOne(ctxMongo, result)
			if err != nil {
				fmt.Println("Not possible to save in mongodb: ", err)
			} else {
				fmt.Println("Saved product in mongodb", result.Name)
				// Acknowledge
				d.Ack(false)
				// Disconnect from mongodb
				client.Disconnect(ctxMongo)
			}
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
