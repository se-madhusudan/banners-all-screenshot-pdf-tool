let fs = require("fs");
let PDFDocument = require("pdfkit");
let sizeOf = require("image-size");
let ora = require("ora");

const bannertypeArray = ["branded-1","unbranded-1","unbranded-2","unbranded-1-static","unbranded-2-static"];
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
  if(this.bannertypeArray ==  "branded-1"){
    images = getFiles("./tools/screenshots/output/" + device.name + "/branded-1");
    console.log('Images (branded): ', images);
  }
  if(this.bannertypeArray ==  "unbranded-1"){
    images = getFiles("./tools/screenshots/output/" + device.name + "/unbranded-1");
    console.log('Images (unbranded 1): ', images);
  }
  if(this.bannertypeArray ==  "unbranded-2"){
    images = getFiles("./tools/screenshots/output/" + device.name + "/unbranded-2");
    console.log('Images (unbranded 2): ', images);
  }
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
    }else  if( size1[4] == "lasso"){
      var size2 = size1[6].split("X");
      console.log('size2 (lasso): ', size2);
      var type = size1[9];
      if(size1[3] == "unbranded"){        
      const str1 = size1[3].charAt(0).toUpperCase() + size1[3].slice(1);
      const str2 = size1[4].charAt(0).toUpperCase() + size1[4].slice(1);
      var bannername = "Animated " + str1 +" "+ str2 +" Banner "+ size1[5];
      var bannername1 = "Animated " + str1 +" "+ str2 +" Banner "+ size1[5];
        var bannerfooter1 = "";
        var bannerfooter2 = "";
        var bannerfooter21 = "";
        var bannerfooter3 = "";
        var bannerfooter31 = "";
        var bannerfooter4 = "";
        var bannerfooter41 = "";
      }else{
        const str1 = size1[3].charAt(0).toUpperCase() + size1[3].slice(1);
        const str2 = size1[4].charAt(0).toUpperCase() + size1[4].slice(1);
        var bannername = "Animated " + str1 +" "+ str2 + " Banner " + size1[4];
        var bannername1 = bannername;//"10/23 PRC-10438";
        var bannerfooter1 = "";
        var bannerfooter2 = "";
        var bannerfooter21 = "";
        var bannerfooter3 = "";
        var bannerfooter31 = "";
        var bannerfooter4 = "";
        var bannerfooter41 = "";
      }      
      var bannersize = size2[0] +" x " + size2[1] + " pixels";   
    }else{
      if(size1[3] == "unbranded"){
        const str1 = size1[3].charAt(0).toUpperCase() + size1[3].slice(1);
        var bannername = "Animated " + str1 +" Banner "+  size1[4];
        var bannername1 = "Animated " + str1 +" Banner "+  size1[4];
        if (size1[4] == 1) { var code = "ONC-US-2400448 08/24"; }
        if (size1[4] == 2) { var code = "ONC-US-2400449 08/24"; } 
        var bannerfooter1 = "";
        var bannerfooter2 = "";
        var bannerfooter21 = "";
        var bannerfooter3 = "";
        var bannerfooter31 = "";
        var bannerfooter4 = "";
        var bannerfooter41 = "";
      }else{       
        const str1 = size1[3].charAt(0).toUpperCase() + size1[3].slice(1);
        var bannername = "Animated " + str1 +" Banner " + size1[4];
        var bannername1 = bannername;//"10/23 PRC-10438";
        if(size1[4] == 1){ var code = "7356-US-2400427 08/24"; }
        // if(size1[4] == 2){ var code = "7356-US-2400427 08/24"; } 
        var bannerfooter1 = "";
        var bannerfooter2 = "";
        var bannerfooter21 = "";
        var bannerfooter3 = "";
        var bannerfooter31 = "";
        var bannerfooter4 = "";
        var bannerfooter41 = "";
      }
      var size2 = size1[5].split("X");      
     
      if(size1.length == 11 ){
        var type = size1[10];
      }else{
        var type = size1[8];
      }
      var bannersize = size2[0] +" x " + size2[1] + " pixels";   
    } 
    if (type == "ISI.png") {  
      const imageWidth = parseInt(size2[0]); //sizeOf(images[index]).width * 0.654; 
      const imageHeight = parseInt(size2[1]); // sizeOf(images[index]).height * 0.654; 
      const borderWidth = 2; 
      const borderColor = "black";
      const imageX = 100; 
      const imageY = 100; 
      const borderX = imageX - 1; 
      const borderY = imageY - 1;
      var isiheight  =  sizeOf(images[index]).height / 2;
      var totalImageWidth = 300 + borderWidth;
      if (size2[1] == 250) {
        var totalImageWidth = 300 + borderWidth; 
      }

      if (size2[1] == 600) {
        var totalImageWidth = 300 + borderWidth; 
      }

      if (size2[1] == 90) {
        var totalImageWidth = 300 + borderWidth; 
      }

      const totalImageHeight = isiheight + borderWidth;
      const ISIPDFHeight = isiheight + 350;
      let imgObj = {
        pdfConfig: {
          size: [1542 , ISIPDFHeight]
        }
      };
      
      if (!createdPdf) {
        doc = new PDFDocument(imgObj.pdfConfig).strokeColor(borderColor) 
        .font('Helvetica-Bold')
        .fontSize(14)
        .moveDown(lineHeight / 72)    
        .lineWidth(borderWidth).rect(borderX + imageWidth + 100, borderY + 20, totalImageWidth, totalImageHeight).stroke()
        .image(images[index - 1], imageX, imageY + 20, {fit: [imageWidth, imageHeight]})
        .image(images[index], imageX + imageWidth + 100, imageY + 20, {fit: [300, isiheight]})
        .text("Indication and ISI", imageX + imageWidth + 100, imageY)
        .text("Frame 4", imageX, imageY);
        createdPdf = true;
      } else {
        doc.addPage(imgObj.pdfConfig).strokeColor(borderColor)   
        .font('Helvetica-Bold')
        .fontSize(14)
        .moveDown(lineHeight / 72)          
        .lineWidth(borderWidth).rect(borderX + imageWidth + 100, borderY + 100, totalImageWidth, totalImageHeight).stroke()
        .image(images[index - 1], imageX, imageY + 100, {fit: [imageWidth, imageHeight]})
        .image(images[index], imageX + imageWidth + 100, imageY + 100, {fit: [300, isiheight]})
        .text("Indication and ISI", imageX + imageWidth + 100, imageY + 80)
        doc.text( bannername1, imageX, imageY);
        doc.text( code, imageX, imageY + 20)
        .text("Dimensions: " + bannersize, imageX, imageY + 40);
        doc.text("Frame 4", imageX, imageY + 80);
      }
    } else if( size1[5] == "static"){ 
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
    } else {
      if(size1[3] == "branded"){            
        if(size2[1] == 600){
          var pdfsize = [1542, 1600];
        }else{
          var pdfsize = [1542, 996];
        }
      }else{
        var pdfsize = [1542, 996];
      }
      let imgObj = {
        pdfConfig: {
          size: pdfsize,
          margin: [100, 100, 100, 100],
        }
      };
     
      const imageWidth = parseInt(size2[0]); // sizeOf(images[index]).width;
      const imageHeight = parseInt(size2[1]);  //sizeOf(images[index]).height ;
      const imageX = 100;
      const imageY = 100;
      if (size2[0] > 500) {
        if (!createdPdf) {
          doc = new PDFDocument(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 1], imageX, imageY + 250, {fit: [imageWidth, imageHeight]})
          .image(images[index + 2], imageX, imageY + 400, {fit: [imageWidth, imageHeight]});
          doc.image(images[index + 3], imageX, imageY + 550, {fit: [imageWidth, imageHeight]});  
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .moveDown(lineHeight / 72) 
          .text("Frame 1", imageX, imageY + 80)
          .text("Frame 2", imageX, imageY + 230)
          .text("Frame 3", imageX, imageY + 380)
          doc.text("Frame 4", imageX, imageY + 530)  

          doc.text(bannerfooter1, imageX + 750, imageY + 135)
          .text(bannerfooter2, imageX + 750, imageY + 275)
          .text(bannerfooter21, imageX + 750, imageY + 295)
          .text(bannerfooter3, imageX + 750, imageY + 425)
          .text(bannerfooter31, imageX + 750, imageY + 450);

          doc.text( bannername1, imageX, imageY);
           doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);

          createdPdf = true;
        } else {
          doc.addPage(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 1], imageX, imageY + 250, {fit: [imageWidth, imageHeight]})
          .image(images[index + 2], imageX, imageY + 400, {fit: [imageWidth, imageHeight]});
            doc.image(images[index + 3], imageX, imageY + 550, {fit: [imageWidth, imageHeight]});  
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .moveDown(lineHeight / 72) 
          .text("Frame 1", imageX, imageY + 80)
          .text("Frame 2", imageX, imageY + 230)
          .text("Frame 3", imageX, imageY + 380)  
            doc.text("Frame 4", imageX, imageY + 530)   
          doc.text(bannerfooter1, imageX + 750, imageY + 135)
          .text(bannerfooter2, imageX + 750, imageY + 275)
          .text(bannerfooter21, imageX + 750, imageY + 295)
          .text(bannerfooter3, imageX + 750, imageY + 425)
          .text(bannerfooter31, imageX + 750, imageY + 450);
          doc.text( bannername1, imageX, imageY);
          doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
          
        }
      } else if (size2[1] == 50) {
        if (!createdPdf) {
          doc = new PDFDocument(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 1], imageX, imageY + 210, {fit: [imageWidth, imageHeight]})
          .image(images[index + 2], imageX, imageY + 310, {fit: [imageWidth, imageHeight]});
          doc.image(images[index + 3], imageX, imageY + 410, {fit: [imageWidth, imageHeight]});  
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .moveDown(lineHeight / 72) 
          .text("Frame 1", imageX, imageY + 80)
          .text("Frame 2", imageX, imageY +190)
          .text("Frame 3", imageX, imageY + 290)     
          doc.text("Frame 4", imageX, imageY + 390)  
          doc.text( bannername1, imageX, imageY);
          doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);

          createdPdf = true;
        } else {
          doc.addPage(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 1], imageX, imageY + 210, {fit: [imageWidth, imageHeight]})
          .image(images[index + 2], imageX, imageY + 310, {fit: [imageWidth, imageHeight]});
          doc.image(images[index + 3], imageX, imageY + 410, {fit: [imageWidth, imageHeight]});  

          doc.font('Helvetica-Bold')
          .fontSize(14)
          .moveDown(lineHeight / 72) 
          .text("Frame 1", imageX, imageY + 80)
          .text("Frame 2", imageX, imageY + 190)
          .text("Frame 3", imageX, imageY + 290)   
           doc.text("Frame 4", imageX, imageY + 390)  

          doc.text( bannername1, imageX, imageY);          
          doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
          
        }
      } else {
        if (!createdPdf) {
          doc = new PDFDocument(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 1], imageX + 350, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 2], imageX + 700, imageY + 100, {fit: [imageWidth, imageHeight]});
            doc.image(images[index + 3], imageX + 1050, imageY + 100, {fit: [imageWidth, imageHeight]});

          doc.font('Helvetica-Bold')
          .fontSize(14)
          .moveDown(lineHeight / 72) 
          .text("Frame 1", imageX, imageY + 80)
          .text("Frame 2", imageX + 350, imageY + 80)
          .text("Frame 3", imageX + 700, imageY + 80);
            doc.text("Frame 4", imageX + 1050, imageY + 80);   

          doc.text(bannerfooter1, imageX + 60, imageY + 130 + imageHeight)
          .text(bannerfooter2, imageX + 350 + 60, imageY + 130 + imageHeight)
          .text(bannerfooter21, imageX + 350 + 60, imageY + 155 + imageHeight)
          .text(bannerfooter3, imageX + 700 + 60, imageY + 130 + imageHeight)
          .text(bannerfooter31, imageX + 700 + 60, imageY + 155 + imageHeight );
          doc.text( bannername1, imageX, imageY);
          doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
          createdPdf = true;
        } else {
          
          doc.addPage(imgObj.pdfConfig)
          .image(images[index], imageX, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 1], imageX + 350, imageY + 100, {fit: [imageWidth, imageHeight]})
          .image(images[index + 2], imageX + 700, imageY + 100, {fit: [imageWidth, imageHeight]});
            doc.image(images[index + 3], imageX + 1050, imageY + 100, {fit: [imageWidth, imageHeight]});
          
          doc.font('Helvetica-Bold')
          .fontSize(14)
          .moveDown(lineHeight / 72) 
          .text("Frame 1", imageX, imageY + 80)
          .text("Frame 2", imageX + 350, imageY + 80)
          .text("Frame 3", imageX + 700, imageY + 80);
            doc.text("Frame 4", imageX + 1050, imageY + 80);
          doc.text(bannerfooter1, imageX + 60, imageY + 130 + imageHeight)
          .text(bannerfooter2, imageX + 350 + 60, imageY + 130 + imageHeight)
          .text(bannerfooter21, imageX + 350 + 60, imageY + 155 + imageHeight)
          .text(bannerfooter3, imageX + 700 + 60, imageY + 130 + imageHeight)
          .text(bannerfooter31, imageX + 700 + 60, imageY + 155 + imageHeight );
          doc.text( bannername1, imageX, imageY);
          doc.text( code, imageX, imageY + 20)
          .text("Dimensions: " + bannersize, imageX, imageY + 40);
        }
      }
      index++;
      index++;  
      index++;
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