"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileSelectProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label?: string;
  buttonText?: string;
  noFileText?: string;
  className?: string;
  onFileSelect?: (file: File | null) => void;
  value?: File | null;
}

export function FileSelect({
  label = "Select a file",
  buttonText = "Choose a file",
  noFileText = "No file chosen",
  className,
  onFileSelect,
  value = null,
  ...props
}: FileSelectProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setSelectedFile(value);
  }, [value]);

  const handleClick = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (inputRef.current) {
      inputRef.current.click();
  
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm text-slate-400">{label}</label>}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <input
          type="file"
          className="sr-only"
          ref={inputRef}
          onChange={handleFileChange}
          {...props}
        />

        <Button
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={(e) => handleClick(e)}
        >
          {buttonText}
        </Button>
        <p className="mt-2 text-sm text-slate-400">
          {selectedFile ? selectedFile.name : noFileText}
        </p>
      </div>
    </div>
  );
}
