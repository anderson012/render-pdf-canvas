import render from "./renderPDF.js";
const canvas = document.createElement("canvas"); // single off-screen canvas
let ctx = canvas.getContext("2d"); // to render to

function drawPage(page, width, height) {
  var img = new Image();
  return new Promise(r => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      r(img);
    };

    img.src = page;
    img.classList.add("pdf-page");
  });
}

/**
 *
 * @param {HTMLBodyElement} appendOn elemento onde será adicionado as paginas do relatorio
 */
const start = async ({ appendOn = null, title = null, scale = 1.5 }) => {
  const { pages, width, height, info } = await render(
    "./documents/example.pdf",
    scale
  );
  for (var i = 0; i < pages.length; i++) {
    const page = pages[i];
    const img = await drawPage(page, width, height);
    img.classList.add("hide");
    if (!appendOn) {
      document.body.append(img);
    } else {
      appendOn.append(img);
    }
    setTimeout(() => {
      img.classList.remove("hide");
    }, 300);

    if (!title) {
      document.head.querySelector("title").textContent = info.Title;
    } else {
      title.textContent = info.Title;
    }
  }
  return info;
};

export default start;
