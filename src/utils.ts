export const dotedBadge = (str: string): string => {
  let len: number = str.length;
  let ret: string = str;
  if (len > 6) {
    ret = str.substring(0, 6) + '...';
  }
  return ret;
};

export const dotedTitle = (str: string): string => {
  let len: number = str.length;
  let ret: string = str;
  if (len > 8) {
    ret = str.substring(0, 8) + '...';
  }
  return ret;
};
