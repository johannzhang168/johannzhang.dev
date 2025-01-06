package models

import (
	"time"

	"github.com/kamva/mgm/v3"
)

type TextSpan struct {
	Text      string `bson:"text"`
	Bold      bool   `bson:"bold,omitempty"`
	Italic    bool   `bson:"italic,omitempty"`
	Underline bool   `bson:"underline,omitempty"`
	Font      string `bson:"font,omitempty"`
	FontSize  int    `bson:"font_size,omitempty"`
	FontColor string `bson:"font_color,omitempty"`
}

type ContentBlock struct {
	Alignment   string     `bson:"alignment,omitempty"`
	Indentation int        `bson:"indentation,omitempty"`
	Spans       []TextSpan `bson:"spans"`
}

type Newsletter struct {
	mgm.DefaultModel `bson:",inline"`
	Title            string         `bson:"title"`
	ImageURLs        []string       `bson:"image_urls"`
	Content          []ContentBlock `bson:"content"`
	Published        bool           `bson:"published"`
	DatePublished    *time.Time     `bson:"date_published,omitempty"`
}

type DeletedNewsletter struct {
	mgm.DefaultModel `bson:",inline"`
	Title            string         `bson:"title"`
	ImageURLs        []string       `bson:"image_urls"`
	Content          []ContentBlock `bson:"content"`
	Published        bool           `bson:"published"`
	DatePublished    *time.Time     `bson:"date_published,omitempty"`
}
