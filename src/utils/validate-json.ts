export const isJSON = (str: string) => {
  try {
    const obj = JSON.parse(str);

    console.log('🚀 ~ file: validate-json.ts:5 ~ isJSON ~ obj:', obj);

    if (obj instanceof Object) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};
