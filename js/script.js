const pdfUrl = "pdf/DWM.pdf";

let pdfDoc = null;
let pageNum = Number(localStorage.getItem("lastPage")) || 1;
let totalPages = 0;

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

pdfjsLib.getDocument(pdfUrl).promise.then(function(pdf) {
  pdfDoc = pdf;
  totalPages = pdf.numPages;
  renderPage(pageNum);
});

function renderPage(num) {
  pdfDoc.getPage(num).then(function(page) {
    const viewport = page.getViewport({ scale: 1.4 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });

    localStorage.setItem("lastPage", num);
    updateProgress();
  });
}

function updateProgress() {
  const progress = Math.round((pageNum / totalPages) * 100);

  document.getElementById("pageInfo").textContent =
    `第 ${pageNum} 頁 / 共 ${totalPages} 頁`;

  document.getElementById("progressText").textContent =
    `閱讀進度：${progress}%`;

  document.getElementById("progressBar").style.width = progress + "%";
}

function nextPage() {
  if (pageNum < totalPages) {
    pageNum++;
    renderPage(pageNum);
  }
}

function prevPage() {
  if (pageNum > 1) {
    pageNum--;
    renderPage(pageNum);
  }
}