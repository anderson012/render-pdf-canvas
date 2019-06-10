// main entry point/function for loop
const canvas = document.createElement("canvas"); // single off-screen canvas
let ctx = canvas.getContext("2d"), // to render to
  pages = [],
  currentPage = 1,
  scaleRel = 1.5;

const getPage = async pdf => {
  // when promise is returned do as usual
  const page = await pdf.getPage(currentPage);
  const viewport = page.getViewport(scaleRel);

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  var renderContext = {
    canvasContext: ctx,
    viewport
  };

  // now, tap into the returned promise from render:
  await page.render(renderContext);
  // store compressed image data in array
  pages.push(canvas.toDataURL());

  if (currentPage < pdf.numPages) {
    currentPage++;
    await getPage(pdf); // get next page
  } else {
    return;
  }
};

/* To avoid too many levels, which easily happen when using chained promises,
the function is separated and just referenced in the first promise callback
*/
const iterate = pdf => {
  // init parsing of first page
  if (currentPage <= pdf.numPages) {
    return getPage(pdf);
  }
};

const render = async (urlDocument = "", scale) => {
  scaleRel = scale;
  if (urlDocument === "") {
    alert("The document path is invalid!");
    return;
  }

  const pdf = await pdfjsLib.getDocument(urlDocument);
  await iterate(pdf);
  const pdfMeta = await pdf.getMetadata();

  return {
    pages,
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    title: pdf.title,
    info: pdfMeta.info
  };
};

export default render;
