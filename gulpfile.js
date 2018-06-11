var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var exec = require('child_process').exec;

gulp.task('default', function(done) {
  command(`webpack --config ${path.join(__dirname, 'config/verification-webpack.js')}`);
  command(`webpack --config ${path.join(__dirname, 'config/typedown-webpack.js')}`);
  command(`webpack --config ${path.join(__dirname, 'config/email-webpack.js')}`);
  command(`webpack --config ${path.join(__dirname, 'config/global-intuitive-webpack.js')}`);
});

function command(commandToBeRun) {
  exec(commandToBeRun, function(e, o, se) {
    console.log(o);
  });
}
