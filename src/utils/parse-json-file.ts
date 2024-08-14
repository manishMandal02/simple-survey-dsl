export const parseJsonFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = ev => resolve(ev.target?.result as string);
    fileReader.onerror = error => reject(error);
    fileReader.readAsText(file);
  });
};
