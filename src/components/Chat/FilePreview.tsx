import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, X, FileText, Image, Video, FileAudio, File } from 'lucide-react';

interface FilePreviewProps {
  file: {
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, isOpen, onClose }) => {
  const [previewError, setPreviewError] = useState(false);

  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const isPDF = file.mimeType === 'application/pdf';
  const isAudio = file.mimeType?.startsWith('audio/');
  const isDocument = file.mimeType?.includes('document') || 
                     file.mimeType?.includes('word') || 
                     file.mimeType?.includes('excel') || 
                     file.mimeType?.includes('powerpoint') ||
                     file.originalName?.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (isImage) return <Image className="h-8 w-8" />;
    if (isVideo) return <Video className="h-8 w-8" />;
    if (isPDF) return <FileText className="h-8 w-8" />;
    if (isDocument) return <FileText className="h-8 w-8" />;
    if (isAudio) return <FileAudio className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const handleDownload = () => {
    window.open(file.url, '_blank');
  };

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon()}
            <span className="truncate">{file.originalName}</span>
            <span className="text-sm text-muted-foreground font-normal">
              ({formatFileSize(file.size)})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {previewError ? (
            <div className="text-center py-8">
              <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Unable to preview this file</p>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {isImage && (
                <div className="flex justify-center">
                  <img 
                    src={file.url} 
                    alt={file.originalName} 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    onError={handlePreviewError}
                  />
                </div>
              )}
              
              {isVideo && (
                <div className="flex justify-center">
                  <video 
                    src={file.url} 
                    controls 
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    onError={handlePreviewError}
                  />
                </div>
              )}
              
              {isPDF && (
                <div className="w-full h-[70vh]">
                  <iframe
                    src={`${file.url}#toolbar=0`}
                    className="w-full h-full rounded-lg border"
                    onError={handlePreviewError}
                  />
                </div>
              )}
              
              {isAudio && (
                <div className="flex justify-center">
                  <audio 
                    src={file.url} 
                    controls 
                    className="w-full max-w-md"
                    onError={handlePreviewError}
                  />
                </div>
              )}
              
              {!isImage && !isVideo && !isPDF && !isAudio && (
                <div className="text-center py-8">
                  <File className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Preview not available for this file type</p>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;
