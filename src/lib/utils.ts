export const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const convertTime = (timestamp: string) => {
  const date = new Date(timestamp);

  // Get hours, minutes, and seconds with leading zeros
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);

  // Get the date in desired format
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  // Combine time and date
  const formattedTime = `${hours}:${minutes} - ${day}/${month}/${year}`;

  return formattedTime;
};
