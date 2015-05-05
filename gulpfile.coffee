'use strict'
gulp =          require 'gulp'
browserify =    require 'browserify'
del =           require 'del'
source =        require 'vinyl-source-stream'
runSequence =   require 'run-sequence'
uglify =        require 'gulp-uglify'
rename =        require 'gulp-rename'
nodemon =       require 'gulp-nodemon'
htmlreplace =   require 'gulp-html-replace'
templateCache = require 'gulp-angular-templatecache'

paths =
  indexJs: [ './client/index.js' ]
  html: [ './client/views/*.html' ]
  indexHtml: [ './client/index.html' ]
  fonts: ['./client/fonts/*.*', './node_modules/bootstrap/fonts/*.*'],
  images: ['./client/images/*.gif', './client/images/*.jpg'],
  favicons: ['./client/favicon/*']

isDev = process.env.NODE_ENV != 'development'

gulp.task 'clean', (done) ->
  del [
    './dist'
    'index.html'
  ], done

gulp.task 'browserify', ->
  browserify debug: true
    .add paths.indexJs
    .bundle()
    .pipe source 'index.js'
    .pipe gulp.dest './dist'

gulp.task 'uglify', ->
  gulp.src './dist/index.js'
    .pipe uglify()
    .pipe rename 'index.min.js'
    .pipe gulp.dest './dist'

gulp.task 'index-html', ->
  gulp.src paths.indexHtml
    .pipe htmlreplace
      js: 'index.min.js'
    .pipe gulp.dest './dist'

gulp.task 'html', ->
  gulp.src paths.html
    .pipe templateCache 'templates.js',
      standalone: true
      moduleSystem: 'Browserify'
      root: 'views'
    .pipe gulp.dest './client'

gulp.task 'fonts', ->
  gulp.src paths.fonts
    .pipe gulp.dest './dist/fonts'

gulp.task 'images', ->
  gulp.src paths.images
    .pipe gulp.dest './dist/images'

gulp.task 'favicons', ->
  gulp.src paths.favicons
    .pipe gulp.dest './dist/favicon'

gulp.task 'build', (callback) ->
  runSequence 'clean',
    'html', [
      'browserify'
      'index-html'
      'fonts'
      'images'
      'favicons'
    ], 'uglify', callback

gulp.task 'watch', [ 'build' ], ->
  gulp.watch paths.indexHtml.concat(paths.indexJs), [ 'build' ]

gulp.task 'run', ['build'], ->
  nodemon
    script: 'server/index.js'
    tasks: ['build']


gulp.task 'default', [ 'watch' ]
