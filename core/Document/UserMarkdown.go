package document

import "textualize/entities"

type UserMarkdown entities.UserMarkdown

type UserMarkdownCollection struct {
	Values []entities.UserMarkdown
}

var userMarkdownCollection *UserMarkdownCollection

func GetUserMarkdownCollection() *UserMarkdownCollection {
	if userMarkdownCollection == nil {
		userMarkdownCollection = &UserMarkdownCollection{}
	}

	return userMarkdownCollection
}

func SetUserMarkdownCollection(collection UserMarkdownCollection) {
	userMarkdownCollection = &collection
}

func (collection *UserMarkdownCollection) GetUserMarkdownByDocumentId(documentId string) *entities.UserMarkdown {
	var foundUserMarkdown *entities.UserMarkdown

	for index, m := range collection.Values {
		if m.DocumentId == documentId {
			foundUserMarkdown = &collection.Values[index]
			break
		}
	}

	return foundUserMarkdown
}

func (collection *UserMarkdownCollection) AddUserMarkdown(userMarkdown entities.UserMarkdown) entities.UserMarkdown {
	collection.Values = append(collection.Values, userMarkdown)
	return userMarkdown
}

func (collection *UserMarkdownCollection) UpdateUserMarkdown(userMarkdown entities.UserMarkdown) entities.UserMarkdown {
	currentUserMarkdown := collection.GetUserMarkdownByDocumentId(userMarkdown.DocumentId)

	if currentUserMarkdown != nil {
		currentUserMarkdown.Value = userMarkdown.Value
	} else {
		collection.AddUserMarkdown(userMarkdown)
	}

	return userMarkdown
}
