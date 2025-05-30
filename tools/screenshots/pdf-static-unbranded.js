let fs = require("fs");
let PDFDocument = require("pdfkit");
let sizeOf = require("image-size");
let ora = require("ora");

const bannertypeArray = ["unbranded-1-static","unbranded-2-static"];
var j = 0, length = bannertypeArray.length;
for (; j < length; j++) {
let devices = [
  {
    type: "banner",
    name: "banner",
    dpi: 1
  },
];
let createdPdf = false;
let doc;
const spinner = ora("Banner: calculating letiables").start();
spinner.color = "red";
spinner.text = "Making PDF...";
devices.forEach(function (device) {
  let images = [];
  if(this.bannertypeArray ==  "unbranded-1-static"){
    images = getFiles("./tools/screenshots/output/" + device.name + "/unbranded-1-static");
    console.log('Images (unbranded static 1): ', images);
  }
  if(this.bannertypeArray ==  "unbranded-2-static"){
    images = getFiles("./tools/screenshots/output/" + device.name + "/unbranded-2-static");
    console.log('Images (unbranded static 2): ', images);
  }
  var index = 0, length = images.length;
  for (; index < length; index++) {
    let imgSize = [sizeOf(images[index]).width, sizeOf(images[index]).height];   
    var size = images[index].split("/"); 
    console.log('Size: ', size);
    var size1 = size[6].split("-");
    console.log('Size1: ', size1);
    const lineHeight = 26;
    if( size1[5] == "static"){ 
      var size2 = size1[6].split("X");
      console.log('size2 (static): ', size2);
      var type = size1[8];
      console.log('type (static): ', type);
      const str1 = size1[5].charAt(0).toUpperCase() + size1[5].slice(1);
      const str2 = size1[3].charAt(0).toUpperCase() + size1[3].slice(1);
      var bannername = str1+" "+ str2 +" Banner "+ size1[4];
      var bannername1 = str1+" "+ str2 +" Banner "+ size1[4];
      var bannersize = size2[0] +" x " + size2[1] + " pixels";
      if (size1[4] == 1) { var code = "ONC-US-2400450 08/24"; }
      if (size1[4] == 2) { var code = "ONC-US-2400451 08/24"; } 
      if(size1[4] == 3){ var code = "US-314876"; }  
    } 
    if( size1[5] == "static"){ 
      let imgObj = {
        pdfConfig: {
          size: [1542, 996],
          margin: [100, 100, 100, 100],
        }
      };
      const imageWidth = parseInt(size2[0]); // sizeOf(images[index]).width;
      const imageHeight = parseInt(size2[1]);  //sizeOf(images[index]).height ;
      const imageX = 145;
      const imageY = 145;
      if (size2[0] > 500) {
        if (!createdPdf) {
          doc = new PDFDocument(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]});
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .text("Frame 1", imageX, imageY + 80);
          doc.text( bannername1, imageX, imageY);
                    doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
          createdPdf = true;
        } else {
          doc.addPage(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]});
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .text("Frame 1", imageX, imageY + 80);
          doc.text( bannername1, imageX, imageY);
                    doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
        }
      } else {
        if (!createdPdf) {
          doc = new PDFDocument(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]});
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .text("Frame 1", imageX, imageY + 80);
          doc.text( bannername1, imageX, imageY);
                    doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
          createdPdf = true;
        } else {
          doc.addPage(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]});
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .text("Frame 1", imageX, imageY + 80);
          doc.text( bannername1, imageX, imageY);
                    doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
        }
      }
    }
  }
}, { bannertypeArray: bannertypeArray[j]} );
  doc.pipe(
    fs.createWriteStream(
      "./tools/screenshots/output/bms-opdivo-rcc-edetail-w25-xxx-"+bannertypeArray[j]+".pdf"
    )
  );
  doc.end();
  spinner.info('See "./tools/screenshots/output" folder for sources');
}
// Function
function getFiles(dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (let i in files) {
    if (!files[i].includes(".DS_Store")) {
      let name = dir + "/" + files[i];
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
  }
  return files_;
}