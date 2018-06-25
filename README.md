# swiper
一个小小的面对对象形式的轮播插件,掺杂了es6的一些语法，并没有用babel转过码

### 项目地址: (`git clone`)

```shell
git clone https://github.com/myLB/touchSwiper
```

### 项目结构

<pre>
        //默认值
        el: '.lb-swiper',//特定节点
        speed: 2000,//多少毫秒完成动画
        spaceTime: 1000,//动画间隔时间
        welt: 100,//小于多少贴边，大于则开启动画到下一个li
        pagination: true,//是否需要分页器
        pageClick: false,//分页器是否可以点击
        pre: false,//向左移动
        next: false//向右移动
</pre>
