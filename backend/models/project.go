package models

import "github.com/kamva/mgm/v3"

type Project struct {
	mgm.DefaultModel `bson:",inline"`
	Name             string   `bson:"name"`
	Description      string   `bson:"description"`
	Link             string   `bson:"link"`
	Image            string   `bson:"image"`
	Tags             []string `bson:"tags"`
}

type DeletedProject struct {
	mgm.DefaultModel `bson:",inline"`
	Name             string   `bson:"name"`
	Description      string   `bson:"description"`
	Link             string   `bson:"link"`
	Image            string   `bson:"image"`
	Tags             []string `bson:"tags"`
}
