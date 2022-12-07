package ipc

type Channel struct{}

var channelInstance *Channel

func GetInstance() *Channel {
	if channelInstance == nil {
		channelInstance = &Channel{}
	}

	return channelInstance
}
