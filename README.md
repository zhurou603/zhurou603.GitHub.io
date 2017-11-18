<h2 align="center">天意人间舫</h2>

>**微注：**个人主博客(基于 `Hexo`)地址是: [https://jeffjade.com](https://jeffjade.com)；此博客原作者博文地址：[http://yansu.org](http://yansu.org)，Fork 于 2016 年初；对风格做了蛮多改变，同时对访问速度有所优化。

### Fork 说明
14 年有用 `Jekyll` 搭建过博客；无奈那时 `Jekyll` 还无中文文档以及资料; 每每折腾起来，颇为费劲；15 年初有转投 `Hexo` 怀抱，即便现在使用 `Hexo` 也觉其很是方便。
怎奈养成了对于不错主题就想一试其美的冲动；故而此次回归于 `Jekyll`，欲成就另一个私人空间的同时，也是想试用下写得不错的响应式主题。对于这**天意人间舫**，有留一篇拙章为之记：[晚晴幽草轩,天意人间舫](https://jeffjade.com/2016/01/22/2016-01-22-jeffjade-and-nicejade/)。

### 安装说明

1. 注册 Github 账号，并 fork 库到自己的 github(须验证邮箱)；
2. 进入 Setting, 修改名字为：`username.github.io`,并启用 github Page 服务；
3. clone 库到本地，参考 `_posts` 中的目录结构自己创建适合自己的文章目录结构；
4. 修改 CNAME （如果无个人域名，可删掉这个文件，使用默认域名）；
5. 修改 `_config.yml` 配置项，然后就大功告成了！当然，你可以修改更多。

### 分支说明

- 三栏布局（master分支，基于[3-Jekyll](https://github.com/P233/3-Jekyll)）
- 三栏布局 (bootstrap-based分支，基于Bootstrap)
- 单栏布局（first-ui分支，基于Bootstrap）

>**微注：** 对 `.scss` 文件的转化，只需执行： `sass --watch _sass\style.scss:css\style.css --trace`,当然，这需要注意下相对路径；具体可参见[SASS用法指南](http://www.ruanyifeng.com/blog/2012/06/sass.html),如是生产环境，执行 `　sass --style compressed .\_sass\style.scss .\css\style.css` 命令即可。

[![天意人间舫](https://i.loli.net/2017/08/03/5983094a78592.jpg)](https://imgly.net/i/CfH)
