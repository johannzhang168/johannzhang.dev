package models

import "github.com/kamva/mgm/v3"

type SafeUser struct {
	ID        string `json:"id"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
	Status    string `json:"status"`
}

type User struct {
	mgm.DefaultModel `bson:",inline"`
	FirstName        string `bson:"firstName"`
	LastName         string `bson:"lastName"`
	Name             string `bson:"name"`
	Email            string `bson:"email"`
	HashedPassword   string `bson:"hashedPassword"`
	Status           string `bson:"status"`
}
