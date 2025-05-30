"use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");

const gulp = require("gulp");
const { series } = require("gulp");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const clean = require("gulp-clean");
const fileinclude = require("gulp-file-include");
const zip = require("gulp-zip");
const path = require("path");
const glob = require("glob");
const replace = require("gulp-replace");
const fs = require("fs");

const subDirs = glob.sync("./dist/*");

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
  });
  done();
}

// Fonts task

function fonts() {
  return Promise.all(
    subDirs.map((subDir) => {
      const sizedBanners = glob.sync(subDir + "/*/*", {
        ignore: [subDir + "/*.html"],
      });
      return Promise.all(
        sizedBanners.map((sizedBanner) => {
          const pattern = "./source/**/shared/fonts";

          // Find matching paths
          glob(pattern, (err, files) => {
            if (err) {
              console.error("Error:", err);
              return;
            }
            
            const fontsSourceDir = files[0];

            if (sizedBanner.includes("\\")) {
              const parentFolder = sizedBanner.split(path.sep);
              console.log(parentFolder);
              if (!parentFolder.includes("shared")) {
                const fontsDestDir = path.resolve(sizedBanner, "fonts");
                return gulp
                  .src(path.join(fontsSourceDir, "*"))
                  .pipe(gulp.dest(fontsDestDir));
              }
            } else {
              const parentFolder = sizedBanner.split("/");
              console.log(parentFolder);
              if (!parentFolder.includes("shared")) {
                const fontsDestDir = path.resolve(sizedBanner + "/fonts/");
                return gulp
                  .src(fontsSourceDir + "/*")
                  .pipe(gulp.dest(fontsDestDir));
              }
            }
          });
        })
      );
    })
  );
}

// If the fonts source directory exists, then run fonts()
function buildFonts(done) {
  return gulp
    .src("./source/*/shared/fonts/*.*")
    .on("end", function () {
      console.log("Fonts source directory contains files.");
      fonts().then(done);
    })
    .on("error", function () {
      console.log("Fonts source directory is empty or does not exist.");
      done();
    });
}

// CSS task
function css() {
  return gulp
    .src(["./source/**/**/**/*.scss", "./source/**/shared/*.scss"])
    .pipe(plumber())
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .on("error", sass.logError)
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(cleanCSS())
    .pipe(gulp.dest("./dist"))
    .pipe(browsersync.stream());
}

// JS task
function js() {
  return gulp
    .src("./source/**/**/**/*.js")
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./dist"))
    .pipe(browsersync.stream());
}

// HTML task
function html() {
  return gulp
    .src(["./source/**/**/**/*.html", "!./source/**/IsiContent.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )

    .pipe(gulp.dest("./dist"))
    .pipe(browsersync.stream());
}

// Image task
function img() {
  return gulp.src("./source/**/**/**/img/*").pipe(gulp.dest("./dist"));
}

// Delete build directory if build directory exists
function deleteBuild(done) {
  glob("./dist", function (err, files) {
    if (err) {
      console.error("Error while checking directory:", err);
    } else if (files.length > 0) {
      return gulp.src("./dist", { read: false }).pipe(clean());
    } else {
      console.log("Directory does not exist");
    }
  });
  done();
}

// Create Lasso banners from source files
function copySource() {
  return gulp
    .src("./dist/**/*")
    .pipe(
      rename(function (path) {
        // Get the parent folder name
        let parentFolder;

        if (path.dirname.includes("\\")) {
          parentFolder = path.dirname.split("\\")[0];
        } else {
          parentFolder = path.dirname.split("/")[0];
        }

        // Rename the parent folder to 'lasso'
        if (parentFolder !== ".") {
          path.dirname = path.dirname.replace(
            parentFolder,
            parentFolder + "-lasso"
          );
        }
      })
    )
    .pipe(gulp.dest("./dist"));
}

// Add Lasso library and clickTag
function injectLasso(done) {
  const lassoScript =
    '<script type="text/javascript" src="https://acdn.adnxs.com/html5-lib/1.3.0/appnexus-html5-lib.min.js"></script>';
  const lassoClickTag = "APPNEXUS.getClickTag()";

  const lassoDir = glob.sync("./dist/*");

  lassoDir.forEach((folder) => {
    if (path.parse(folder).name.includes("lasso")) {
      const newDirName = path.parse(folder).name;

      return gulp
        .src("./dist/" + newDirName + "/**/**/index.html")

        .pipe(replace("<!-- click tags -->", lassoScript))
        .pipe(replace(/(var clickTag = ).*?(;)/gs, `$1${lassoClickTag}$2`))
        .pipe(gulp.dest("./dist/" + newDirName));
    }
  });
  done();
}


// Copy screenshot PDF files into dist
function copyScreenshots() {
  return gulp
    .src("./tools/screenshots/output/*.pdf")
    .pipe(gulp.dest("./dist/screenshots/"));
}

// Watch and build files
function watchFiles() {
  gulp.watch(["./source/**/**/**/*.scss", "./source/**/shared/*.scss"], css);
  gulp.watch("./source/**/**/**/*.js", js);
  gulp.watch(["./source/**/**/*.html", "./source/**/IsiContent.html"], html);
  gulp.watch("./source/**/**/img/*", img);
}

// Zip up build files for handoff
function zipit(done) {
  const repoPath = path.resolve("../").split("/").pop();

  console.log(repoPath);
  subDirs.forEach((subDir) => {
    const sizedBanners1 = glob.sync(subDir + "/*");
    sizedBanners1.forEach((sizedBanner) => {
      const parentFolder = sizedBanner.split("/");
      // Rename the parent folder to 'lasso'
      if (!parentFolder.includes("shared")) {
        const newName =
          path.parse(repoPath).name +
          "-" +
          path.parse(subDir).name +
          "-" +
          path.parse(sizedBanner).name +
          "-banner";
        gulp
          .src(sizedBanner + "/**/*")
          .pipe(zip(sizedBanner - "/**/*" + ".zip"))
          .pipe(
            rename(function (path) {
              path.basename = newName;
            })
          )
          .pipe(gulp.dest("./dist/zipped"));
      }
    });
  });
  done();
}

// Create a function to generate the index HTML content
function generateIndexContent() {
  // name of repo
  const repoName = path.resolve("../").split("/").pop();
  const repoNameClean = repoName.replaceAll("-", " ");

  // clean name of repo
  const repoNameCase = repoNameClean
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  // last updated date
  const theDate = new Date();
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "US/Eastern",
  };
  const formattedDate = theDate.toLocaleDateString("en-US", dateOptions);

  // Initialize an array to store banner links
  const bannerLinks = [];

  // Initialize an array to store banner texts
  const bannerTexts = [];

  // Iterate through all the subdirectories in the "dist" directory
  subDirs.forEach((subDir) => {
    // Find all the directories in each subdirectory
    const bannerDirectories = glob.sync(subDir + "/*/*");
    bannerDirectories.forEach((bannerDirectory) => {
      const bannerURL = bannerDirectory.replace(/^\.\/dist\//, "");
      const bannerText = bannerURL.replaceAll("/", " -- ");
      const bannerLink = `<a href="${bannerURL}/index.html" target="_blank">${bannerText}</a>`;
      // Create text for each banner and add it to the array
      bannerTexts.push(bannerText);

      // Create a link for each banner and add it to the array
      bannerLinks.push(bannerLink);
    });
  });

  // zip files
  const zipFiles = glob.sync("./dist/zipped/*.zip");

  const zipLinks = zipFiles.map((zipFile) => {
    const fileName = path.basename(zipFile);
    const link = `<a href="./zipped/${fileName}" download="${fileName}">${fileName}</a>`;
    return link;
  });

  // screenshot files
  const screenshotFiles = glob.sync("./dist/screenshots/*.pdf");

  const screenshotLinks = screenshotFiles.map((screenshotFile) => {
    const fileName = path.basename(screenshotFile);
    const link = `<a href="./screenshots/${fileName}" download="${fileName}">${fileName}</a>`;
    return link; 
  });

  const indexHTMLContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${repoNameCase} Banners</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
  </head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
    
    body {
      font-family: "Inter", sans-serif;
      font-size: 1.1rem;
      line-height: normal;
      background-color: #f2f2f2;
      color: #000;
      padding: 3rem 0;
    }
    h1, h2 {
      margin: 0 0 1rem 0;
    }
    h1 {
      font-size: 1.6rem;
      font-weight: 500;
    }
    h2 {
      font-size: 1.4rem;
      font-weight: 400;
    }
    a {
      color: #1778F2;
      transition: all 0.3s ease;
    }
    a:hover {
      color: #000;
      text-decoration: none;
    }
    ul {
      margin: 0;
      padding-left: 23px;
    }
    ul li {
      color: #696969;
      padding: .75rem .5rem;
    }
    ul li:nth-child(odd) {
      background-color: #f2f2f2;
    }
    ul li span {
      color: #000;
    }
    header, footer {
      text-align: center;
      padding: 0 1rem;
    }
    section {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    section .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .row {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(2, 1fr);
    }
    .col {
      padding: 2rem 1.5rem;
      border-radius: 15px;
      border: 1px solid #eee;
      background-color: #fff;
      transition: all .2s ease;
    }
    .col-view {
     grid-row: 1 / 3;
    }
    .col-screenshot {
      grid-column: 2 / 3;
    }
    .col:hover {
      box-shadow: 0px 0px 18px 7px rgba(0,0,0,0.1);  
    }
    footer p {
      font-size: .7rem;
    }
    @media screen and (max-width: 600px) {
      .row {
        grid-template-columns: 1fr;
      }
      .col-view {
        grid-row: auto;
      }
      .col-screenshot {
        grid-column: auto;
      }
    }
  </style>
<body>
	<header>
		<h1>${repoNameCase} Banners</h1>
	</header>
	<main>
		<section>
			<div class="container">
				<div class="row">
					<div class="col col-view">
						<h2>
							<i class="fa-solid fa-magnifying-glass"></i> View Banners
						</h2>
						<ul>
              ${bannerLinks
                .map(
                  (link) => `
							<li>
								<span>${link}</span>
							</li>`
                )
                .join("\n")}  
						</ul>
					</div>
					<div class="col col-screenshot">
						<h2>
							<i class="fa-solid fa-camera"></i> Download Screenshots
						</h2>
						<ul>
                ${screenshotLinks
                  .map(
                    (link) => `
							<li>
								<span>${link}</span>
							</li>`
                  )
                  .join("\n")}
						</ul>
					</div>
          <div class="col col-zip">
						<h2>
							<i class="fa-solid fa-download"></i> Download Zip Files
						</h2>
						<ul>
                ${zipLinks
                  .map(
                    (link) => `
							<li>
								<span>${link}</span>
							</li>`
                  )
                  .join("\n")}
						</ul>
					</div>
				</div>
			</div>
		</section>
	</main>
	<footer>
		<p>Last updated ${formattedDate} EST</p>
		<p>
			<a href="https://gitlab.com/hm-devs/${repoName}" target="_blank">GitLab Repository</a>
		</p>
	</footer>
</body></html>
  `;

  return indexHTMLContent;
}

// Task to create the index.html file
function buildIndex(done) {
  const indexHTMLContent = generateIndexContent();
  fs.writeFileSync("./dist/index.html", indexHTMLContent);
  done();
}

// Define complex tasks
const watch = gulp.parallel(css, js, html, img, watchFiles, browserSync);

// Export tasks
exports.zipit = zipit;
exports.buildFonts = buildFonts;
exports.copyScreenshots = copyScreenshots;
exports.buildIndex = buildIndex;
exports.watch = watch;

// Run 'gulp build' to build the banners and lasso to dist and also create the zip files
exports.build = series(
  deleteBuild,
  css,
  js,
  html,
  img,
  copySource,
  injectLasso
);
