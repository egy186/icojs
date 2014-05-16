module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        bower: {
            install: {
                options: {
                    targetDir: './demo/lib',
                    layout: 'byComponent',
                    install: true,
                    verbose: true,
                    cleanTargetDir: true,
                    cleanBowerDir: false
                }
            }
        },
        uglify: {
            all: {
                files: {
                    "ico.min.js": ["ico.js"]
                },
                options: {
                    preserveComments: false,
                    sourceMap: "ico.js.map",
                    sourceMappingURL: "ico.min.map",
                    report: "min",
                    beautify: {
                        ascii_only: true
                    },
                    banner: "/*! <%= pkg.name %> v<%= pkg.version %> (c) <%= grunt.template.today('yyyy') %> <%= pkg.author %>; <%= pkg.license %> license */",
                    compress: {
                        hoist_funs: false,
                        loops: false,
                        unused: false
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("default", ["bower", "uglify"]);
};