let gulp = require('gulp');
let rename = require('gulp-rename');
let sass = require('gulp-dart-sass');
let changed = require('gulp-changed');
let postcss = require('gulp-postcss');
let cleanCSS = require('gulp-clean-css');
let purgecss = require('gulp-purgecss');
const atimport = require('postcss-import');
const tailwindcss = require('tailwindcss');
let tailwindConfig = 'tailwind.config.js';

//Aura Variables
let AURA_SRC_DIR = 'force-app/main/default/aura'; // force-app/main/default/aura
let AURA_SASS_DIR = 'aura-scss-styles'; // /aura-scss-styles


// LWC Variables
let LWC_SRC_DIR = 'force-app/main/default/lwc'; //
let lWC_SASS_DIR = 'lwc-scss-styles'; //



// Aura Setup 


/*
* @Description  Copy all files from aura that include css into the aura-scss directory.  Will not override existing files.
                Files with .css extension are changed to .scss.
                Only run this command 1 time
*/
function createSass() {
    //copy all css files, change extension to .scss
    return gulp.src(AURA_SRC_DIR + '/*/**.css')
        .pipe(rename(function (path) {
            path.extname = '.scss';
        }))
        .pipe(gulp.dest(AURA_SASS_DIR, { overwrite: false }));
}

/*
* @Description  Copy SASS files to aura directory. Compile scss files to css.
                You can run this script each time you want to update your aura component.
                Only the sass files that were updated will update in the aura directory
*/
function copySass() {


    //copy all scss files, change extension to .css
    return gulp.src(AURA_SASS_DIR + '/*/**.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(postcss([
            // ...
            require('tailwindcss'),
            require('autoprefixer'),
            // ...
        ]))
        .pipe(cleanCSS())
        .pipe(changed(AURA_SASS_DIR))
        .pipe(gulp.dest(AURA_SRC_DIR, { overwrite: true }));

}

function generateTailwindBase() {
    console.log(`generating tailwindcss styles into ${process.env.STATIC_PATH}/Tailwind_Base.css`);
    return gulp.src(`${process.env.STATIC_PATH}/Tailwind_Base.css`)
        .pipe(postcss([
            require('tailwindcss'),
            require('autoprefixer'),
        ]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(process.env.STATIC_PATH, { overwrite: true }));
}

gulp.task('tailwind', generateTailwindBase);

/*
* @Description  This command will watch for any changes in sass directory and run the copy sass to the aura directory. 
                Making it easier for development.
*/
gulp.task('aura-watcher', function () {
    gulp.watch(AURA_SASS_DIR, gulp.series('copy-aura-sass'));
})

/*
* @Description  Create a sass directory. Only Run this the first time you install this package.
*/
gulp.task('create-aura-sass', createSass);

/*
* @Description  Copy the sass directory into the aura directory
*/
gulp.task('copy-aura-sass', copySass);



// LWC Setup

/*
* @Description  Copy all files from lwc that include css into the lwc-scss directory.  Will not override existing files.
                Files with .css extension are changed to .scss.
                Only run this command 1 time
*/
function createLwcSass() {
    //copy all css files, change extension to .scss
    return gulp.src(LWC_SRC_DIR + '/*/**.css')
        .pipe(rename(function (path) {
            path.extname = '.scss';
        }))
        .pipe(gulp.dest(lWC_SASS_DIR, { overwrite: false }));
}


/*
* @Description  Copy SASS files to lwc directory. Compile scss files to css.
                You can run this script each time you want to update your lwc component.
                Only the sass files that were updated will update in the lwc directory
*/
function copyLwcSass() {
    //copy all scss files, change extension to .css
    return gulp.src(lWC_SASS_DIR + '/*/**.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(postcss([
            // ...
            require('tailwindcss'),
            require('autoprefixer'),
            // ...
        ]))
        .pipe(cleanCSS())
        .pipe(changed(lWC_SASS_DIR))
        .pipe(gulp.dest(LWC_SRC_DIR, { overwrite: true }));
}



/*
* @Description  Create a sass directory. Only Run this the first time you install this package.
*/
gulp.task('create-lwc-sass', createLwcSass);


/*
* @Description  Copy the sass directory into the lwc directory
*/
gulp.task('copy-lwc-sass', copyLwcSass);


/*
* @Description  This command will watch for any changes in sass directory and run the copy sass to the lwc directory. 
                Making it easier for development.
*/
gulp.task('lwc-watcher', function () {
    gulp.watch(lWC_SASS_DIR, gulp.series('copy-lwc-sass'));
})



/*
* @Description This is a task to make the css file in static resources smaller
*/
// gulp.task('purgecss', () => {
//     return gulp.src('./Tailwind_Base.css', { allowEmpty: true })
//         .pipe(purgecss({
//             content: [
//                 AURA_SRC_DIR + '/*/**.cmp',
//                 LWC_SRC_DIR + '/*/**.html'
//             ]
//         }))
//         .pipe(gulp.dest('./newbase.css'))
// })

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 
 */
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-z0-9-:\/]+/g);
    }
}

/**
 * PurgeCSS remove the unused css style class that werent used in the cmp and html files
 */
gulp.task("purgeIt", function () {

    return gulp
        .src('./force-app/main/default/staticresources/Tailwind_Base.css')
        .pipe(postcss([atimport(), tailwindcss(tailwindConfig)]))
        .pipe(
            purgecss({
                content: [
                    AURA_SRC_DIR + '/*/**.cmp',
                    LWC_SRC_DIR + '/*/**.html'
                ],

                extractors: [
                    {
                        extractor: TailwindExtractor,
                        extensions: ["cmp", "html"]
                    }
                ]
            })
        )
        // .pipe(gulp.dest(AURA_SRC_DIR, { overwrite: true }));
        .pipe(gulp.dest("./force-app/main/default/staticresources", { overwrite: true }));
});
