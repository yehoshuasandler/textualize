package entities

import (
	"errors"
	"fmt"
)

type IndependentTranslatedWord struct {
	Id              string
	ProcessedWordId string
	Value           string
}

type LinkedProcessedArea struct {
	Area     ProcessedArea
	Previous *LinkedProcessedArea
	Next     *LinkedProcessedArea
}

type SerializedLinkedProcessedArea struct {
	AreaId     string `json:"areaId"`
	PreviousId string `json:"previousId"`
	NextId     string `json:"nextId"`
}

type ContextGroupCollection struct {
	Groups []LinkedAreaList
}

type LinkedAreaList struct {
	Id              string
	DocumentId      string
	TranslationText string
	Head            *LinkedProcessedArea
	Tail            *LinkedProcessedArea
}

func (l *LinkedAreaList) First() *LinkedProcessedArea {
	return l.Head
}

func (linkedProcessedWord *LinkedProcessedArea) GetNext() *LinkedProcessedArea {
	return linkedProcessedWord.Next
}

func (linkedProcessedWord *LinkedProcessedArea) GetPrevious() *LinkedProcessedArea {
	return linkedProcessedWord.Previous
}

// Create new node with value
func (l *LinkedAreaList) Push(processedArea ProcessedArea) *LinkedAreaList {
	n := &LinkedProcessedArea{Area: processedArea}
	if l.Head == nil {
		l.Head = n // First node
	} else {
		l.Tail.Next = n     // Add after prev last node
		n.Previous = l.Tail // Link back to prev last node
	}
	l.Tail = n // reset tail to newly added node
	return l
}

func (l *LinkedAreaList) Find(id string) *LinkedProcessedArea {
	found := false
	var ret *LinkedProcessedArea = nil
	for n := l.First(); n != nil && !found; n = n.GetNext() {
		if n.Area.Id == id {
			found = true
			ret = n
		}
	}
	return ret
}

func (l *LinkedAreaList) Delete(id string) bool {
	success := false
	node2del := l.Find(id)
	if node2del != nil {
		fmt.Println("Delete - FOUND: ", id)
		prev_node := node2del.Previous
		next_node := node2del.Next
		// Remove this node
		prev_node.Next = node2del.Next
		next_node.Previous = node2del.Previous
		success = true
	}
	return success
}

var errEmpty = errors.New("ERROR - List is empty")

// Pop last item from list
func (l *LinkedAreaList) Pop() (processedArea ProcessedArea, err error) {
	if l.Tail == nil {
		err = errEmpty
	} else {
		processedArea = l.Tail.Area
		l.Tail = l.Tail.Previous
		if l.Tail == nil {
			l.Head = nil
		}
	}
	return processedArea, err
}

func (l *LinkedAreaList) InsertAfter(id string, processedArea ProcessedArea) bool {
	found := false
	for n := l.First(); n != nil && !found; n = n.GetNext() {
		if n.Area.Id == id {
			found = true
			newNode := &LinkedProcessedArea{Area: processedArea}
			newNode.Next = n.Next
			newNode.Previous = n
			n.Next = newNode
		}
	}
	return found
}

func (l *LinkedAreaList) InsertBefore(id string, processedArea ProcessedArea) bool {
	found := false
	for n := l.First(); n != nil && !found; n = n.GetNext() {
		if n.Area.Id == id {
			found = true
			newNode := &LinkedProcessedArea{Area: processedArea}
			newNode.Next = n
			newNode.Previous = n.Previous
			n.Previous = newNode
		}
	}
	return found
}

func (l *LinkedAreaList) Serialize() []SerializedLinkedProcessedArea {
	var serialized []SerializedLinkedProcessedArea
	for n := l.First(); n != nil; n = n.GetNext() {
		areaId := n.Area.Id
		previousId := ""
		if n.Previous != nil {
			previousId = n.Previous.Area.Id
		}
		nextId := ""
		if n.Next != nil {
			nextId = n.Next.Area.Id
		}

		serialized = append(serialized, SerializedLinkedProcessedArea{
			AreaId:     areaId,
			PreviousId: previousId,
			NextId:     nextId,
		})
	}
	return serialized
}

func DeserializeLinkedAreaList(serialized []SerializedLinkedProcessedArea) LinkedAreaList {
	linkedAreaList := LinkedAreaList{}
	for _, serializedLinkedProcessedArea := range serialized {
		linkedAreaList.Push(ProcessedArea{
			Id: serializedLinkedProcessedArea.AreaId,
		})
	}
	for _, serializedLinkedProcessedArea := range serialized {
		linkedProcessedArea := linkedAreaList.Find(serializedLinkedProcessedArea.AreaId)
		if serializedLinkedProcessedArea.PreviousId != "" {
			linkedProcessedArea.Previous = linkedAreaList.Find(serializedLinkedProcessedArea.PreviousId)
		}
		if serializedLinkedProcessedArea.NextId != "" {
			linkedProcessedArea.Next = linkedAreaList.Find(serializedLinkedProcessedArea.NextId)
		}
	}
	return linkedAreaList
}
