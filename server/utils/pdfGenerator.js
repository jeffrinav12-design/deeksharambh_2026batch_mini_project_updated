import PDFDocument from 'pdfkit';

// Helper for letterhead
function drawLetterhead(doc) {
  doc.font('Times-Bold').fontSize(14).text("SANKARA COLLEGE OF SCIENCE AND COMMERCE (Autonomous)", { align: 'center' });
  doc.font('Times-Roman').fontSize(9)
     .text("Affiliated to Bharathiar University, Coimbatore | Approved by AICTE, New Delhi", { align: 'center' })
     .text("Re-Accredited by NAAC with A+ Grade (Cycle II) | An ISO 9001:2015 Certified Institution", { align: 'center' })
     .text("Saravanampatty, Coimbatore, Tamilnadu | Pincode: 641035", { align: 'center' })
     .text("E-Mail: info@sankara.ac.in | Web: www.sankara.ac.in", { align: 'center' });
  
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(562, doc.y).strokeColor('#000').stroke();
  doc.moveDown(1);
}

// 1. Generate Result Analysis PDF
export function generateResultPdf(batch, results, rangeSummary, resStream) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(resStream);

  drawLetterhead(doc);

  doc.font('Times-Bold').fontSize(12).text(`BRIDGE COURSE RESULT ANALYSIS - BATCH ${batch.batchYearRange}`, { align: 'center' });
  doc.moveDown(1);

  // Result Table Headers
  const tableTop = doc.y;
  doc.font('Times-Bold').fontSize(9);
  doc.text("S.No", 50, tableTop);
  doc.text("Name", 90, tableTop);
  doc.text("Tamil", 240, tableTop);
  doc.text("English", 290, tableTop);
  doc.text("Maths", 340, tableTop);
  doc.text("Core", 390, tableTop);
  doc.text("Total", 440, tableTop);
  doc.text("Percentage", 490, tableTop);

  doc.moveTo(50, tableTop + 12).lineTo(562, tableTop + 12).stroke();

  let currentY = tableTop + 18;
  doc.font('Times-Roman');
  results.forEach(res => {
    // Page break handling
    if (currentY > 700) {
      doc.addPage();
      drawLetterhead(doc);
      doc.font('Times-Bold').fontSize(9);
      doc.text("S.No", 50, doc.y);
      doc.text("Name", 90, doc.y);
      doc.text("Tamil", 240, doc.y);
      doc.text("English", 290, doc.y);
      doc.text("Maths", 340, doc.y);
      doc.text("Core", 390, doc.y);
      doc.text("Total", 440, doc.y);
      doc.text("Percentage", 490, doc.y);
      doc.moveTo(50, doc.y + 12).lineTo(562, doc.y + 12).stroke();
      currentY = doc.y + 18;
      doc.font('Times-Roman');
    }

    doc.text(String(res.sNo), 50, currentY);
    doc.text(res.name, 90, currentY, { width: 140, height: 12, ellipsis: true });
    doc.text(String(res.tamil), 240, currentY);
    doc.text(String(res.english), 290, currentY);
    doc.text(String(res.maths), 340, currentY);
    doc.text(String(res.core), 390, currentY);
    doc.text(String(res.total), 440, currentY);
    doc.text(res.percentage === 'AB' ? 'AB' : `${res.percentage}%`, 490, currentY);
    currentY += 16;
  });

  doc.moveDown(2);
  currentY = doc.y;

  if (currentY > 550) {
    doc.addPage();
    drawLetterhead(doc);
    currentY = doc.y;
  }

  doc.font('Times-Bold').fontSize(11).text("RESULT RANGE SUMMARY", 50, currentY);
  doc.moveDown(0.5);
  currentY = doc.y;

  doc.text("Range", 50, currentY);
  doc.text("No. of Students", 200, currentY);
  doc.text("Percentage", 350, currentY);
  doc.moveTo(50, currentY + 12).lineTo(562, currentY + 12).stroke();
  currentY += 18;

  doc.font('Times-Roman').fontSize(10);
  rangeSummary.forEach(r => {
    doc.text(r.range, 50, currentY);
    doc.text(String(r.count), 200, currentY);
    doc.text(`${r.percent}%`, 350, currentY);
    currentY += 16;
  });

  doc.moveDown(1.5);
  doc.font('Times-Bold').fontSize(10).text("THOSE WHO GOT 70 AND ABOVE ARE THE ADVANCED LEARNERS AND OTHERS ARE SLOW LEARNERS.", 50, doc.y);
  
  doc.moveDown(2);
  const sigY = doc.y;
  doc.text("Tutor Signature", 50, sigY);
  doc.text("HOD / Principal Signature", 400, sigY);

  doc.end();
}

// 2. Generate SIP Report PDF
export function generateSipPdf(batch, reportText, objectives, resStream) {
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(resStream);

  drawLetterhead(doc);

  doc.font('Times-Bold').fontSize(12)
     .text(`STUDENT INDUCTION PROGRAMME ${batch.academicYear}`, { align: 'center' })
     .text(`Deeksharambh ${batch.deeksharambhVersion}`, { align: 'center' })
     .text("Department of Computer Science with Data Analytics", { align: 'center' })
     .text(`Student Induction Program (SIP) - Academic Year ${batch.academicYear}`, { align: 'center' });
  
  doc.moveDown(1);
  doc.text("REPORT", { align: 'center', underline: true });
  doc.moveDown(1);

  const mainText = reportText || `The Student Induction Program for the newly admitted first-year students for the academic year ${batch.academicYear} was conducted from ${batch.startDate} to ${batch.endDate}. Eminent personalities from various fields were invited to address the students throughout the program.`;
  
  doc.font('Times-Roman').fontSize(11).text(mainText, { align: 'justify', lineGap: 4 });
  doc.moveDown(1.5);

  doc.font('Times-Bold').fontSize(11).text("Objectives of the SIP:", { underline: true });
  doc.moveDown(0.5);

  doc.font('Times-Roman').fontSize(10);
  objectives.forEach(obj => {
    doc.text(`* ${obj}`, { indent: 20, lineGap: 3 });
  });

  doc.moveDown(3);
  const sigY = doc.y;
  doc.font('Times-Bold').fontSize(10);
  doc.text("Head of the Department", 50, sigY);
  doc.text("Principal", 450, sigY);

  doc.end();
}
