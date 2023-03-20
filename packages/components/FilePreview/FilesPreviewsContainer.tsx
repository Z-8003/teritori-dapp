import React, { useMemo } from "react";
import { View } from "react-native";
import { v4 as uuidv4 } from "uuid";

import { GIF_MIME_TYPE } from "../../utils/mime";
import { layout } from "../../utils/style/layout";
import { LocalFileData, RemoteFileData } from "../../utils/types/feed";
import { EditableAudioPreview } from "./EditableAudioPreview";
import { ImagesPreviews } from "./ImagesPreviews";
import { VideoPreview } from "./VideoPreview";

interface FilePreviewContainerProps {
  files?: LocalFileData[];
  gifs?: string[];
  onDelete: (file: LocalFileData | RemoteFileData) => void;
  onDeleteGIF: (url: string) => void;
  onAudioUpdate: (updatedFile: LocalFileData) => void;
}

export const convertGIFToLocalFileType = (
  gif: string,
  fileName: string
): LocalFileData => ({
  file: new File([], fileName),
  fileName,
  mimeType: GIF_MIME_TYPE,
  size: 120,
  url: gif,
  fileType: "image",
});

export const FilesPreviewsContainer: React.FC<FilePreviewContainerProps> = ({
  files,
  gifs,
  onDelete,
  onDeleteGIF,
  onAudioUpdate,
}) => {
  const audioFiles = useMemo(
    () => files?.filter((file) => file.fileType === "audio"),
    [files]
  );
  const imageFiles = useMemo(
    () => files?.filter((file) => file.fileType === "image"),
    [files]
  );
  const videoFiles = useMemo(
    () => files?.filter((file) => file.fileType === "video"),
    [files]
  );
  const gifsFiles = useMemo(() => {
    const fileName = "GIF-" + uuidv4();
    return gifs?.map((gif) => convertGIFToLocalFileType(gif, fileName));
  }, [gifs]);

  if (!files?.length && !gifs?.length) {
    return null;
  }
  return (
    <View
      style={[
        {
          width: "100%",
          marginBottom: layout.padding_x2,
          paddingHorizontal: layout.padding_x2,
        },
      ]}
    >
      {gifsFiles?.length || imageFiles?.length ? (
        <ImagesPreviews
          files={[...(gifsFiles || []), ...(imageFiles || [])]}
          onDelete={(file: LocalFileData | RemoteFileData) => {
            if (file.mimeType === GIF_MIME_TYPE) onDeleteGIF(file.url);
            else onDelete(file);
          }}
          isEditable
        />
      ) : null}

      {videoFiles?.map((file, index) => (
        <VideoPreview key={index} file={file} onDelete={onDelete} isEditable />
      ))}

      {audioFiles?.map((file, index) => (
        <EditableAudioPreview
          key={index}
          file={file}
          onDelete={(file: LocalFileData) => onDelete(file)}
          onUploadThumbnail={onAudioUpdate}
        />
      ))}
    </View>
  );
};
