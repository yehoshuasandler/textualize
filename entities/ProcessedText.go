package entities

type ProcessedBoundingBox struct {
	X0 int32 `json:"x0"`
	Y0 int32 `json:"y0"`
	X1 int32 `json:"x1"`
	Y1 int32 `json:"y1"`
}

type ProcessedSymbol struct {
	Text        string               `json:"text"`
	Confidence  float32              `json:"confidence"`
	BoundingBox ProcessedBoundingBox `json:"boundingBox"`
}

type ProcessedWord struct {
	Id          string               `json:"id"`
	FullText    string               `json:"fullText"`
	Symbols     []ProcessedSymbol    `json:"symbols"`
	Confidence  float32              `json:"confidence"`
	Direction   string               `json:"direction"`
	BoundingBox ProcessedBoundingBox `json:"boundingBox"`
}

type ProcessedLine struct {
	Words []ProcessedWord `json:"words"`
}

type ProcessedArea struct {
	Id         string          `json:"id"`
	DocumentId string          `json:"documentId"`
	Order      int             `json:"order"`
	Lines      []ProcessedLine `json:"lines"`
}

type ProcessedTextCollection struct {
	Areas []ProcessedArea
}

type ProcessedUserMarkdown struct {
	Id         string `json:"id"`
	DocumentId string `json:"documentId"`
	Value      string `json:"value"`
}

type ProcessedUserMarkdownCollection struct {
	Values []ProcessedUserMarkdown `json:"values"`
}
