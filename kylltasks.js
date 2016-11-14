var exports = module.exports = {};

var gulp            = require('gulp');
var exec            = require('child_process').execSync;
var through         = require('through2');
var rename          = require("gulp-rename");
var del             = require('del');
var string          = require('string');
var commandExists   = require('command-exists');
var fs              = require('fs');
var chalk           = require('chalk'); 
var cheerio         = require('cheerio');
var yaml            = require('yaml');
var progress        = require('ts-progress');
var _               = require('underscore');                                                                      

var filelist        = ['_posts', '_styles', '_templates', '_images'];
var templateslist   = ['post.html', 'home.html'];
var styleslist      = ['post.css','home.css'];
var postMetaList    = [];
var bar;

exports.createPost = function(title) {
   var fileName = string(title.replace(/\s\s+/g, ' ').trim().toLowerCase()).replaceAll(' ', '-').s;
   var time = new Date().getTime();
   var data = "---\n    title: " + title + "\n    time: " + time + "\n---"; // YAML Front Matter
   fs.writeFileSync('_posts/' + fileName + '.md', data);
   console.log(chalk.green('Success : Find your new post in', chalk.bold.yellow('_posts'), 'folder'));    
};

exports.clean = function() {
    del.sync('_site');
};

exports.build = function() {
    buildDirectory(); 
    var posts = getPosts();
    copyStaticFiles();
    var postTemplate = fs.readFileSync('_templates/post.html', 'utf-8');
    buildPosts(posts, postTemplate);
    buildHome();
};

var buildDirectory = function() {
    var files = fs.readdirSync('.');
    var proceed = _.every(filelist, function(file) { return _.contains(files, file); });

    if(!proceed) {
        console.log(chalk.red('Current directory does not look like a kyll project'));
        return;
    }

    fs.mkdirSync('_site');
    fs.mkdirSync('_site/css');
    fs.mkdirSync('_site/images');

    var templates = fs.readdirSync('_templates');
    proceed = _.every(templateslist, function(file) { return _.contains(templates, file); }); 

    if(!proceed) {
        console.log('Some template files are missing');
        return;
    }

    var styles = fs.readdirSync('_styles');
    proceed = _.every(styleslist, function(file) { return _.contains(styles, file); });

    if(!proceed) {
        console.log('Some styles files are missing');
        return;
    }
};

var getPosts = function() {
    var posts = _.filter(fs.readdirSync('_posts'), function(postName) {
        return postName.endsWith('.md');
    });
    bar = progress.create({total: 5 + posts.length});
    bar.update();
    return posts;
};

var copyStaticFiles = function() {
    gulp.src('_images/*.*').pipe(gulp.dest('_site/images'));
    gulp.src('_styles/*.css').pipe(gulp.dest('_site/css'));
    bar.update();
};

var buildPosts = function(posts, postTemplate) {
    _.each(posts, function(postName) {
        if(postName != 'home.md') {
            var dom = cheerio.load(postTemplate);
            var body = dom('body').html();
            var command = 'pandoc _posts/' + postName;
            var result = exec(command).toString();
            result = string(result).replaceAll('../_images/', 'images/').s;
            dom('body').html(result + body);
        
            var postString = fs.readFileSync('_posts/' + postName, 'utf-8');
            var yamlClose = postString.substring(3, postString.length).indexOf("---") + 3;
            var yamlMatter = postString.substring(0, yamlClose);
            var yamlData = yaml.eval(yamlMatter);
            var targetFileName = postName.replace(".md", ".html");
            var meta = {};
            meta.link = targetFileName;
            meta.title = yamlData.title;
            postMetaList.push(meta);

            fs.writeFileSync('_site/' + targetFileName, dom.html(), 'utf-8');
            bar.update();
        }
    });
};

var buildHome = function() {
    var homeTemplate = fs.readFileSync('_templates/home.html', 'utf-8');
    bar.update();
    var linkTemplate = '<li><a href="{{target}}">{{title}}</a></li>';
    var allLinks = '';
    _.each(postMetaList, function(meta) {
        allLinks += linkTemplate.replace('{{target}}', meta.link).replace('{{title}}', meta.title);
    });
    bar.update();
    var homeContent = exec('pandoc _posts/home.md');
    homeContent = string(homeContent).replaceAll('../_images/', 'images/').s;
    var dom = cheerio.load(homeTemplate);
    dom('body').html(homeContent + '<ul>' + allLinks + '</ul>');
    bar.update();
    fs.writeFileSync('_site/index.html', dom.html(), 'utf-8');
    bar.update();
};


