import PDFDocument from "pdfkit";
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createPdf(req, res) {
  console.log("createPDF : ");
  const doc = new PDFDocument({size: 'A4'});
  const { name, date, message, doctor, job, hospital } = req.body;
  console.log("BODY :", req.body);

  const imagePath = join(__dirname, '../public', 'image', 'NextHosp.png');
  doc.image(imagePath, 50, 25, {width: 130})

  const imgCaducee = join(__dirname, '../public', 'image', 'caducee.png');
  const up = 250;
  const left = 250;
  doc.image(imgCaducee, left + 120, up, {width: doc.page.width - up, height: doc.page.height - left});

  
  doc.fillColor("#000")
    .text("", 72, 70, {align: "right"})
  .fontSize(13)
  .moveDown()
  .text(`${doctor}`, {align: "right"})
  .text(`${job}`, {align: "right"})
  .text(`${hospital}`, {align: "right"});

  //  [COMMENT] A blank line between Balance Due and Billing Address.
  const _kPAGE_BEGIN = 25;
  const _kPAGE_END = 587;
//  [COMMENT] Draw a horizontal line.
  doc.moveDown(3);
  doc.moveTo(_kPAGE_BEGIN, 190)
        .lineTo(_kPAGE_END, 190)
        .stroke();
  // doc.moveDown();
  doc.fontSize(25)
      .text('PRESCRIPTION', 72, 220, {align: "center"});

  doc.moveDown(3);

  doc.fontSize(15)
      .text(`Date :`, 72, 270, {underline: true})
      .text(`${date}`, 190, 270)
      .text(`Patient's name :`, 72, 290, {underline: true})
      .text(`${name}`, 190, 290)
      .text(`Prescription :`, 72, 320, {underline: true})
      .text(`${message}`, 190, 320)


  doc.pipe(fs.createWriteStream("output.pdf"));
  doc.pipe(res);
  doc.end();
}

export function form(req, res) {
  res.render("prescription");
}

const prescriptionCtrl = {
  createPdf,
  form,
};

export default prescriptionCtrl;
