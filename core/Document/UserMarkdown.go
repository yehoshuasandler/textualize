package document

type UserMarkdown struct {
	Id         string
	DocumentId string
	Value      string
}

type UserMarkdownCollection struct {
	Values []UserMarkdown
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

func (collection *UserMarkdownCollection) GetUserMarkdownByDocumentId(documentId string) *UserMarkdown {
	var foundUserMarkdown *UserMarkdown

	for index, m := range collection.Values {
		if m.DocumentId == documentId {
			foundUserMarkdown = &collection.Values[index]
			break
		}
	}

	return foundUserMarkdown
}

func (collection *UserMarkdownCollection) AddUserMarkdown(userMarkdown UserMarkdown) UserMarkdown {
	collection.Values = append(collection.Values, userMarkdown)
	return userMarkdown
}

func (collection *UserMarkdownCollection) UpdateUserMarkdown(userMarkdown UserMarkdown) UserMarkdown {
	currentUserMarkdown := collection.GetUserMarkdownByDocumentId(userMarkdown.DocumentId)

	if currentUserMarkdown != nil {
		currentUserMarkdown.Value = userMarkdown.Value
	} else {
		collection.AddUserMarkdown(userMarkdown)
	}

	return userMarkdown
}
