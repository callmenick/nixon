module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsdoc : {
      dist : {
        src: ['src/**/*.js'],
        options: {
          destination: 'doc',
          template : 'node_modules/ink-docstrap/template',
          configure : './jsdoc.conf.json'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.registerTask('default', ['jsdoc']);

};
