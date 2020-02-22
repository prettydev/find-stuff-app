export const dotedBadge = (str: string): string => {
  let len: number = str.length;
  let ret: string = str;
  if (len > 6) {
    ret = str.substring(0, 6) + '...';
  }
  return ret;
};
