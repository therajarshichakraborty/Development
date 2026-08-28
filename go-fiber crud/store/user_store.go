package store

import "fiber-crud-api/models"

var Users = []models.User{
	{
		ID:    1,
		Name:  "Rajarshi",
		Email: "rajarshi@example.com",
		Age:   21,
	},
	{
		ID:    2,
		Name:  "John",
		Email: "john@example.com",
		Age:   25,
	},
}
