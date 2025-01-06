package models

import "github.com/kamva/mgm/v3"

type Project struct {
	mgm.DefaultModel `bson:",inline"`
	Name             string `bson:"name"`
	Description      string `bson:"description"`
}
