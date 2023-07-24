package entities

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
)

type IndependentTranslatedWord struct {
	Id              string
	ProcessedWordId string
	Value           string
}

type LinkedProcessedArea struct {
	Area     ProcessedArea
	previous *LinkedProcessedArea
	next     *LinkedProcessedArea
}

type LinkedAreaList struct {
	head *LinkedProcessedArea
	tail *LinkedProcessedArea
}

func (l *LinkedAreaList) First() *LinkedProcessedArea {
	return l.head
}

func (linkedProcessedWord *LinkedProcessedArea) Next() *LinkedProcessedArea {
	return linkedProcessedWord.next
}

func (linkedProcessedWord *LinkedProcessedArea) Prev() *LinkedProcessedArea {
	return linkedProcessedWord.previous
}

// Create new node with value
func (l *LinkedAreaList) Push(processedArea ProcessedArea) *LinkedAreaList {
	n := &LinkedProcessedArea{Area: processedArea}
	if l.head == nil {
		l.head = n // First node
	} else {
		l.tail.next = n     // Add after prev last node
		n.previous = l.tail // Link back to prev last node
	}
	l.tail = n // reset tail to newly added node
	return l
}
func (l *LinkedAreaList) Find(id string) *LinkedProcessedArea {
	found := false
	var ret *LinkedProcessedArea = nil
	for n := l.First(); n != nil && !found; n = n.Next() {
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
		prev_node := node2del.previous
		next_node := node2del.next
		// Remove this node
		prev_node.next = node2del.next
		next_node.previous = node2del.previous
		success = true
	}
	return success
}

var errEmpty = errors.New("ERROR - List is empty")

// Pop last item from list
func (l *LinkedAreaList) Pop() (processedArea ProcessedArea, err error) {
	if l.tail == nil {
		err = errEmpty
	} else {
		processedArea = l.tail.Area
		l.tail = l.tail.previous
		if l.tail == nil {
			l.head = nil
		}
	}
	return processedArea, err
}

type ContextGroup struct { // TODO: possibly remove this and expand the LinkedAreaList struct instead
	Id              string
	DocumentId      string
	LinkedAreaList  LinkedAreaList
	TranslationText string
}

type ContextGroupCollection struct { // TODO: these methods should live in core not entitites
	Groups []ContextGroup
}

var contextGroupCollectionInstance *ContextGroupCollection

func GetContextGroupCollection() *ContextGroupCollection {
	if contextGroupCollectionInstance == nil {
		contextGroupCollectionInstance = &ContextGroupCollection{}
	}

	return contextGroupCollectionInstance
}

func SetContextGroupCollection(collection ContextGroupCollection) *ContextGroupCollection {
	contextGroupCollectionInstance = &collection
	return contextGroupCollectionInstance
}

func (collection *ContextGroupCollection) FindContextGroupByNodeId(id string) *ContextGroup {
	var foundContextGroup *ContextGroup
	for i, g := range collection.Groups {
		if g.LinkedAreaList.Find(id) != nil {
			foundContextGroup = &collection.Groups[i]
			break
		}
	}

	return foundContextGroup
}

func (collection *ContextGroupCollection) CreateContextGroupFromProcessedArea(area ProcessedArea) bool {
	fmt.Println("CreateContextGroupFromProcessedArea")

	newLinkedAreaList := LinkedAreaList{}
	newLinkedAreaList.Push(area)

	newContextGroup := ContextGroup{
		Id:             uuid.NewString(),
		DocumentId:     area.DocumentId,
		LinkedAreaList: newLinkedAreaList,
	}

	collection.Groups = append(collection.Groups, newContextGroup)
	return true
}

// TODO: completely rework this linked list and the collection
func (collection *ContextGroupCollection) ConnectAreaAsTailToNode(tailArea ProcessedArea, headArea ProcessedArea) bool {
	headNodeContextGroup := collection.FindContextGroupByNodeId(headArea.Id)

	if headNodeContextGroup == nil {
		collection.CreateContextGroupFromProcessedArea(headArea)
		headNodeContextGroup = collection.FindContextGroupByNodeId(headArea.Id)
	}

	headNode := headNodeContextGroup.LinkedAreaList.Find(headArea.Id)
	headNode.next = &LinkedProcessedArea{
		Area:     tailArea,
		previous: headNode,
	}

	return true
}
