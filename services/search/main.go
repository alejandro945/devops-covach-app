package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"search/consumer"
	"search/src"
	"strconv"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var collection *mongo.Collection

func SearchHandler(response http.ResponseWriter, request *http.Request) {
	// Get the query parameters
	query := request.URL.Query()

	// Check if name is present
	name := query["name"]

	// Check if price is present
	price := query["price"]

	fmt.Println("Query: ", query)
	response.Header().Set("content-type", "application/json")

	// Create a mongodb query based on the query parameters
	filter := bson.M{}

	if len(name) > 0 {
		// name is case insensitive and contains the value
		filter["name"] = bson.M{"$regex": name[0], "$options": "i"}
	}

	if len(price) > 0 {
		// Price is lower than the value
		priceFloat, _ := strconv.ParseFloat(price[0], 64)
		filter["price"] = bson.M{"$lt": priceFloat}
	}

	fmt.Println("Filter: ", filter)

	// Find the results

	var results []src.Result

	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		fmt.Println(err)
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}

	if err = cursor.All(ctx, &results); err != nil {
		fmt.Println(err)
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}

	json.NewEncoder(response).Encode(results)

}

func main() {
	var IS_CONSUMER = os.Getenv("IS_CONSUMER")
	// Try to cast the IS_CONSUMER to bool
	isConsumer, _ := strconv.ParseBool(IS_CONSUMER)

	// If IS_CONSUMER is true, then we will use the consumer module
	if isConsumer {
		fmt.Println("Using consumer module")
		consumer.StartConsumer()
	} else {
		fmt.Println("Starting the application...")
		client, _ := src.GetMongoClient()

		collection = client.Database("search-db").Collection("search-collection")
		fmt.Println("Collection: ", collection)

		router := mux.NewRouter()

		router.Use(mux.CORSMethodMiddleware(router))

		router.HandleFunc("/search", SearchHandler).Methods("GET")

		http.ListenAndServe(":9000", handlers.CORS(
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}))(router),
		)

	}
}
