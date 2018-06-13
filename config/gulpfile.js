var gulp = require('gulp');
var webpack = require('webpack');
var path = require('path');
var exec = require('child_process').exec;

gulp.task('default', function(done) {
  command(`webpack --config ${path.join(__dirname, 'verification-webpack.js')}`);
  command(`webpack --config ${path.join(__dirname, 'typedown-webpack.js')}`);
  command(`webpack --config ${path.join(__dirname, 'email-webpack.js')}`);
  command(`webpack --config ${path.join(__dirname, 'phone-webpack.js')}`);
  command(`webpack --config ${path.join(__dirname, 'global-intuitive-webpack.js')}`);
});

function command(commandToBeRun) {
  exec(commandToBeRun, function(e, o, se) {
    console.log(o);
  });
}
