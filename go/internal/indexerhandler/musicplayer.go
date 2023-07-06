package indexerhandler

import (
	"encoding/json"

	wasmtypes "github.com/CosmWasm/wasmd/x/wasm/types"
	"github.com/TERITORI/teritori-dapp/go/internal/indexerdb"
	"github.com/pkg/errors"
)

type CreateMusicAlbumMsg struct {
	Identifier string `json:"identifier"`
	Category   uint32 `json:"category"`
	Metadata   string `json:"metadata"`
}

type ExecCreateMusicAlbumMsg struct {
	CreateMusicAlbum CreateMusicAlbumMsg `json:"create_music_album"`
}

func (h *Handler) handleExecuteCreateAlbum(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execCreateMusicAlbumMsg ExecCreateMusicAlbumMsg
	if err := json.Unmarshal(execMsg.Msg, &execCreateMusicAlbumMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute create album msg")
	}
	createMusicAlbumMsg := &execCreateMusicAlbumMsg.CreateMusicAlbum

	var metadataJSON map[string]interface{}
	if err := json.Unmarshal([]byte(createMusicAlbumMsg.Metadata), &metadataJSON); err != nil {
		return errors.Wrap(err, "failed to unmarshal metadata")
	}

	createdAt, err := e.GetBlockTime()
	if err != nil {
		return errors.Wrap(err, "failed to get block time")
	}

	musicAlbum := indexerdb.MusicAlbum{
		Identifier: createMusicAlbumMsg.Identifier,
		Category:   createMusicAlbumMsg.Category,
		Metadata:   metadataJSON,
		CreatedBy:  h.config.Network.UserID(execMsg.Sender),
		CreatedAt:  createdAt.Unix(),
	}

	if err := h.db.Create(&musicAlbum).Error; err != nil {
		return errors.Wrap(err, "failed to create music album")
	}
	return nil
}

type AddToLibraryMsg struct {
	Identifier string `json:"identifier"`
}

type ExecAddToLibraryMsg struct {
	AddToLibrary AddToLibraryMsg `json:"add_to_library"`
}

func (h *Handler) handleExecuteAddToLibrary(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execAddToLibraryMsg ExecAddToLibraryMsg
	if err := json.Unmarshal(execMsg.Msg, &execAddToLibraryMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute add_to_library msg")
	}
	addToLibraryMsg := &execAddToLibraryMsg.AddToLibrary

	musicLibrary := indexerdb.MusicLibrary{
		Identifier: addToLibraryMsg.Identifier,
		Owner:      h.config.Network.UserID(execMsg.Sender),
	}

	if err := h.db.Create(&musicLibrary).Error; err != nil {
		return errors.Wrap(err, "failed to add to library")
	}
	return nil
}

type RemoveFromLibraryMsg struct {
	Identifier string `json:"identifier"`
}

type ExecRemoveFromLibraryMsg struct {
	RemoveFromLibrary RemoveFromLibraryMsg `json:"remove_from_library"`
}

func (h *Handler) handleExecuteRemoveFromLibrary(e *Message, execMsg *wasmtypes.MsgExecuteContract) error {
	var execRemoveFromLibraryMsg ExecRemoveFromLibraryMsg
	if err := json.Unmarshal(execMsg.Msg, &execRemoveFromLibraryMsg); err != nil {
		return errors.Wrap(err, "failed to unmarshal execute remove_from_library msg")
	}
	removeFromLibraryMsg := &execRemoveFromLibraryMsg.RemoveFromLibrary

	musicLibrary := indexerdb.MusicLibrary{
		Identifier: removeFromLibraryMsg.Identifier,
		Owner:      h.config.Network.UserID(execMsg.Sender),
	}

	if err := h.db.Delete(&musicLibrary).Error; err != nil {
		return errors.Wrap(err, "failed to remove from library")
	}
	return nil
}
