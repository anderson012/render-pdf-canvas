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
    img.classList.add("pdf-page")
  });
}

const start = async () => {
  const {pages, width, height} = await render("./documents/example.pdf");
  for (var i = 0; i < pages.length; i++) {
    const page = pages[i];
    const img = await drawPage(page, width, height);
    document.body.append(img);
  }
};

export default start;
