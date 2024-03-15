export const timeAndDate = (timestamp) => {
  if (timestamp == null) {
    return "Now";
  }

  const dateObject = timestamp.toDate();
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);

  if (
    dateObject.getDate() === currentDate.getDate() &&
    dateObject.getMonth() === currentDate.getMonth() &&
    dateObject.getFullYear() === currentDate.getFullYear()
  ) {
    return dateObject.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (
    dateObject.getDate() === yesterday.getDate() &&
    dateObject.getMonth() === yesterday.getMonth() &&
    dateObject.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  } else {
    return dateObject.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
