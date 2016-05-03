// @file gulpfile.js
var gulp = require('gulp');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var clean = require('gulp-clean');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var css = require('gulp-postcss');
var postcss = require('gulp-postcss');
var watch = require('gulp-watch');

//ローカルサーバー
gulp.task('browser-sync', function () {
  // proxyサーバ
  var bs = browserSync({
    ghostMode: false,
    server   : ['tmp','src'],
    port     : 8000,
    online   : true,
    open     : 'external'
  });
});

//jade
function compileJade() {
  return gulp.src(['src/jade/**/*.jade', '!src/jade/**/_*.jade'])
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('tmp/'))
}
gulp.task('jade', function () {
  return compileJade();
})

//css
function compileCss() {
  return gulp.src(['./src/**/*.css', '!src/**/_*.css'], {base:'src'})         //src下にある.cssファイルを指定
    .pipe(postcss([
      require('postcss-easy-import')({glob:true,prefix:'_'}),
      require('postcss-cssnext')(),
      require('postcss-mixins')(),
      require('postcss-nested')(),
      require('postcss-simple-vars')()
    ]))              //PostCSSにファイルを処理してもらう
    .pipe(gulp.dest('./tmp'));          //生成されたCSSをdist下に配置
}
gulp.task('css', function () {           //”css”タスクを登録
  return compileCss();
});
　

//htmlタスク
gulp.task('clean-dist', function () {
  return gulp.src('dist').pipe(clean());
});

gulp.task('clean-tmp', function () {
  return gulp.src('tmp').pipe(clean());
});

gulp.task('imagemin', function () {
  return gulp.src(['src/images/**/*.*'])
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('dist/images'));
});


//ファイルの監視
gulp.task('watch',function(cb){
  watch([
    'src/css/**/*'
  ], compileCss);
  watch([
    'src/**/*.jade'
  ], compileJade)
  watch([
    'src/js/**/*.js', //jsファイルを監視
    'tmp/**/*.html'
  ], function() {
    browserSync.reload();
  });
  watch([
    'tmp/**/*.css'
  ], function() {
    browserSync.reload('*.css');
  });
});

gulp.task('default', function (cb) {
  runSequence('clean-tmp', ['css', 'jade'], ['watch','browser-sync'], cb);
});

// gulp.task('build', function (cb) {
//   runSequence('clean-dist', 'sass', 'jade', ['copy-all', 'imagemin'], cb);
// });

