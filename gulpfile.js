let gulp = require('gulp');
let babel = require('gulp-babel');
let rename = require('gulp-rename');
let sass = require('gulp-sass');
let del = require('del');
let changed = require('gulp-changed');

//Aura Variables
let AURA_SRC_DIR = 'PATH_TO_YOUR_AURA_PATH'; // force-app/main/default/aura
let AURA_SASS_DIR = 'PATH TO WHERE YOU WANT YOUR AURA SCSS TO BE LOCATED'; // /aura-scss


// LWC Variables
let LWC_SRC_DIR = 'PATH_TO_YOUR_LWC_PATH'; //force-app/main/default/lwc
let lWC_SASS_DIR = 'PATH TO WHERE YOU WANT YOUR LWC SCSS TO BE LOCATED'; //lwc-scss-styles



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
        .pipe(changed(AURA_SASS_DIR))
        .pipe(gulp.dest(AURA_SRC_DIR, { overwrite: true }));

}


/*
* @Description  This command will watch for any changes in sass directory and run the copy sass to the aura directory. 
                Making it easier for development.
*/
gulp.task('aura-watcher', function () {
    gulp.watch(AURA_SASS_DIR, gulp.series('copy-sass'));
})

/*
* @Description  Create a sass directory. Only Run this the first time you install this package.
*/
gulp.task('create-sass', createSass);

/*
* @Description  Copy the sass directory into the aura directory
*/
gulp.task('copy-sass', copySass);



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