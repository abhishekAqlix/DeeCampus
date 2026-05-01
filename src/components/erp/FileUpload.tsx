import { useState, useCallback } from "react";
import { Upload, X, FileText, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export function FileUpload({ label = "Upload Files", accept, multiple = true, maxFiles = 5 }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback((newFiles: FileList) => {
    const toAdd = Array.from(newFiles).slice(0, maxFiles - files.length).map(f => ({ name: f.name, size: f.size, type: f.type }));
    setFiles(prev => [...prev, ...toAdd]);
  }, [files.length, maxFiles]);

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); }}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragging ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
        )}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = multiple;
          if (accept) input.accept = accept;
          input.onchange = (e) => {
            const f = (e.target as HTMLInputElement).files;
            if (f) addFiles(f);
          };
          input.click();
        }}
      >
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium">Drop files here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Max {maxFiles} files · PDF, JPG, PNG, DOC</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border bg-secondary/30">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center flex-shrink-0">
                {file.type.startsWith("image/") ? <Image className="h-4 w-4 text-accent" /> : <FileText className="h-4 w-4 text-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{formatSize(file.size)}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
