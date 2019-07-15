var gulp = require('gulp');
var hint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');
var Files = ['*.js','src/**/*.js'];


gulp.task('style',function(){
    return gulp.src(Files)
    .pipe(hint());
});



gulp.task('bower', function () {
var wiredep = require('wiredep').stream;
var inject =  require('gulp-inject'); 
var injectSrc = gulp.src(['./public/css/*.css','./public/js/*.js']);
var injectOptions = {
    ignorePath: '/public/'
}
 return gulp.src('./src/views/*.ejs')
    .pipe(wiredep({
       bowerJson: require('./bower.json'),
       directory: './bower_components',
       ignorePath: '../../bower_components'
    }))
    .pipe(inject(injectSrc,injectOptions))
    .pipe(gulp.dest('./src/views'));
});

gulp.task('server',gulp.parallel('style','bower',function () {
    var options = {
        script: 'app.js',
        delayTime: 1,
        watch: Files
    }
    return nodemon(options)
        .on('restart',function(ev){
            console.log('restarting server...');
        })
}));

