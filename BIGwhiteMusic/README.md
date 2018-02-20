###  播放器 2.0 版本更新 完美适配移动端

> 历史版本：  [播放器1.0](http://www.yni63.win/index.php/archives/7/)


hello 大家好！  经历了一个多月我还是憋不住更新了，这次更新全面适配移动端，优化了界面，并且修复了若干细微bug。 OK！下面就和我一起欣赏一下最新版本吧！

**界面欣赏**
![music](http://my-code.nos-eastchina1.126.net/jsrun/music/music_2_1.png)

![music](http://my-code.nos-eastchina1.126.net/jsrun/music/music_2_2.png)



<center>
    <img src="http://my-code.nos-eastchina1.126.net/jsrun/music/music_2_3.png">
    <img src="http://my-code.nos-eastchina1.126.net/jsrun/music/music_2_4.png">
</center>

-----

体验地址：[传送门](http://www.inkgn.site)


下载地址：[传送门](https://github.com/Yin63/Yin63)



### 注意事项
-----
#### 运行环境
php 5.4+, curl_exec, file_get_contents, json_decode, openssl_encrypt

#### 兼容性
本播放器设计支持 IE10及以上的现代浏览器。并且已在 Chrome、firefox、IE11 等浏览器测试使用正常。

#### 待解决问题

- 下一版本将进行页面大调整
- 完善正则匹配
- 添加网页储存功能，支持离线使用
- 解决低版本IE兼容

### 常见问题
-----
**歌单读取失败 - 404**

本程序需要上传至网站空间(服务器)使用，不支持在本地打开


**歌单读取失败 - 200**

请确保你的服务器支持 PHP ，并且 PHP 版本 >= 5.4


**歌单页封面显示不出来**

请打开 `api.php`，将第十行的 `define('HTTPS', true);` 修改为 `define('HTTPS', false);`

> 版本  2.0   后续将持续更新，敬请期待！

**更新日志**
>  v2.0版本  2018/2/20 
- 支持移动端
- 修复歌曲循环bug 
- 修复播放器图片抖动
- 改变在线音乐切换

-----
> v1.0版本  2018/01/16
-	基本功能已完善（旧版本，已废弃）

**意见反馈**

作者博客：[www.yni63.win](http://www.yni63.win)



