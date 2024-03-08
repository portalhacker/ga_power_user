export function sortArrayByProperty(array: Array<{ [key: string]: any }>, property: string) {
  return array.sort((a, b) => {
      if (a[property] < b[property]) {
          return -1;
      }
      if (a[property] > b[property]) {
          return 1;
      }
      return 0;
  });
}
