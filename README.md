# Kyll - A Simple Blog Engine

Kyll is a simple blog engine, for those who care. It is named after Jekyll, a very powerful blog engine. For most users, Jekyll would work better, and I wrote this for my personal use, for making things easier. The program expects the following directory structure.

![](https://github.com/subinsebastien/kyll/blob/master/files.png?raw=true)

As you can see, all your posts goes into `_posts` and images to `_images` and so on. Templates folder contains two files, `home.html` and `post.html`. Edit these files to adjust your post formatting. All CSS files will be found under `_styles`. When everything is ready, you may start writing posts by running.

```shell
$ node kyll
```

Which will present you with a nice menu. Once you complete your post, you may build the content using the **Build Site** option.

## License

```
DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                    Version 2, December 2004 

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 

 Everyone is permitted to copy and distribute verbatim or modified 
 copies of this license document, and changing it is allowed as long 
 as the name is changed. 

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

  0. You just DO WHAT THE FUCK YOU WANT TO.
```

Read More : http://www.wtfpl.net/about/