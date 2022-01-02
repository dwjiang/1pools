export const shortenWalletAddress = (text) => {
  if (!text)
    return "";
  return text.length > 15 ? `${text.slice(0, 9)}...${text.slice(-4)}` : text;
}

export const copyToClipboard = async (text) => {
  if ("clipboard" in navigator) {
    await navigator.clipboard.writeText(text);
  } else {
    document.execCommand("copy", true, text);
  }
}
