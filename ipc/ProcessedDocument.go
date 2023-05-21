package ipc

import (
	"sort"
	document "textualize/core/Document"
)

func serializeBoundingBox(bbox document.ProcessedBoundingBox) ProcessedBoundingBox {
	return ProcessedBoundingBox{
		X0: bbox.X0,
		Y0: bbox.Y0,
		X1: bbox.X1,
		Y1: bbox.Y1,
	}
}

func serializeSymbol(symbol document.ProcessedSymbol) ProcessedSymbol {
	return ProcessedSymbol{
		Text:        symbol.Text,
		Confidence:  symbol.Confidence,
		BoundingBox: serializeBoundingBox(symbol.BoundingBox),
	}
}

func serialzeWord(word document.ProcessedWord) ProcessedWord {
	var symbols []ProcessedSymbol

	for _, symbol := range word.Symbols {
		symbols = append(symbols, serializeSymbol(symbol))
	}

	return ProcessedWord{
		FullText:    word.FullText,
		Symbols:     symbols,
		Confidence:  word.Confidence,
		Direction:   word.Direction,
		BoundingBox: serializeBoundingBox(word.BoundingBox),
	}
}

func serializeLine(line document.ProcessedLine) ProcessedLine {
	var words []ProcessedWord

	for _, word := range line.Words {
		words = append(words, serialzeWord((word)))
	}

	return ProcessedLine{
		FullText: line.FullText,
		Words:    words,
	}
}

func serializeProcessedArea(area document.ProcessedArea) ProcessedArea {
	var lines []ProcessedLine

	for _, line := range area.Lines {
		lines = append(lines, serializeLine(line))
	}

	return ProcessedArea{
		Id:         area.Id,
		DocumentId: area.DocumentId,
		FullText:   area.FullText,
		Order:      area.Order,
		Lines:      lines,
	}
}

func (c *Channel) GetProcessedAreasByDocumentId(id string) []ProcessedArea {
	areas := document.GetProcessedAreaCollection().GetAreasByDocumentId(id)

	var response []ProcessedArea

	for _, a := range areas {
		response = append(response, serializeProcessedArea(*a))
	}

	sort.Slice(response, func(i, j int) bool {
		return response[i].Order < response[j].Order
	})

	return response
}

func deserializeBoundingBox(bbox ProcessedBoundingBox) document.ProcessedBoundingBox {
	return document.ProcessedBoundingBox{
		X0: bbox.X0,
		Y0: bbox.Y0,
		X1: bbox.X1,
		Y1: bbox.Y1,
	}
}

func deserializeSymbol(symbol ProcessedSymbol) document.ProcessedSymbol {
	return document.ProcessedSymbol{
		Text:        symbol.Text,
		Confidence:  symbol.Confidence,
		BoundingBox: deserializeBoundingBox(symbol.BoundingBox),
	}
}

func deserialzeWord(word ProcessedWord) document.ProcessedWord {
	var symbols []document.ProcessedSymbol

	for _, symbol := range word.Symbols {
		symbols = append(symbols, deserializeSymbol(symbol))
	}

	return document.ProcessedWord{
		FullText:    word.FullText,
		Symbols:     symbols,
		Confidence:  word.Confidence,
		Direction:   word.Direction,
		BoundingBox: deserializeBoundingBox(word.BoundingBox),
	}
}

func deserializeLine(line ProcessedLine) document.ProcessedLine {
	var words []document.ProcessedWord

	for _, word := range line.Words {
		words = append(words, deserialzeWord((word)))
	}

	return document.ProcessedLine{
		FullText: line.FullText,
		Words:    words,
	}
}

func deserializeProcessedArea(area ProcessedArea) document.ProcessedArea {
	var lines []document.ProcessedLine

	for _, line := range area.Lines {
		lines = append(lines, deserializeLine(line))
	}

	return document.ProcessedArea{
		Id:         area.Id,
		DocumentId: area.DocumentId,
		Order:      area.Order,
		FullText:   area.FullText,
		Lines:      lines,
	}
}

func (c *Channel) RequestAddProcessedArea(processedArea ProcessedArea) ProcessedArea {
	// doesAreaAlreadyExist := false
	// processedAreasOfDocuments := document.GetProcessedAreaCollection().GetAreasByDocumentId(processedArea.DocumentId)

	// for _, a := range processedAreasOfDocuments {
	// 	if a.Order == processedArea.Order {
	// 		doesAreaAlreadyExist = true
	// 		break
	// 	}
	// }

	deserializedProcessedArea := deserializeProcessedArea(processedArea)

	// if doesAreaAlreadyExist {
	// 	storedProcessedArea := document.GetProcessedAreaCollection().GetAreaById(processedArea.Id)
	// 	if storedProcessedArea.Id != "" {
	// 		storedProcessedArea = &deserializedProcessedArea
	// 	}
	// } else {
	document.GetProcessedAreaCollection().AddProcessedArea((deserializedProcessedArea))
	// }

	return processedArea
}
