function extractFileExtension(fileName: string): string {
  const dotParts = fileName.split(".");
  const extension = dotParts[dotParts.length - 1] ?? "";

  return extension;
}

export { extractFileExtension };
