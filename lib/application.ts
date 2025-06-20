export const handleCustomContextMenuClose = () => {
  const targetElement = document.querySelector(".joseph") as HTMLElement;
  if (targetElement) {
    targetElement.style.pointerEvents = "all";
  }
};