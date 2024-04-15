// Hàm giới hạn từ
export const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength - 1) + "...";
  }
  return text;
};

// Hàm convert sang kiểu tiền việt
export const formatCurrency = (amount) => {
  if (typeof amount === "string") {
    const numericPrice = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    return numericPrice.toLocaleString("vi-VN");
  } else {
    return amount.toLocaleString("vi-VN");
  }
};
