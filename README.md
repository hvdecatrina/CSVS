CSVS
====
csvs是一个用于数据分类统计和分析的可视化应用。<br/>
------
### 所有用于csvs开发的软件都是开源的，具体描述如下：<br/>
* R是一门统计分析语言，csvs用R做服务器端，考虑其统计分析和绘图的先天优势，并方便操作数据库，用于可视化前期数据的处理很方便。<br/>
* shiny是一个R包，可以创建交互式的网站，实现前后端数据交互。感兴趣的同学可以去官网学习，有很多文档和案例，http://shiny.rstudio.com/。<br/>
* Leaflet是一个用于创建交互式地图的JavaScript库，其下还有几个扩展插件
  * Leaflet.draw可以在地图上绘制多边形，主要用于圈选多个区域，显示基于用户感兴趣的部分。
  * leaflet-sidebar在地图上创建侧边栏，用于显示辅助可视化图以及额外的信息。
  * Leaflet.EasyButton在地图上创建按钮，用于控制侧边栏，帮助实现多视图交互。
  * esri-leaflet在地图上添加底图，可以有很多种选择。
* juqery可以简化代码编辑，且解决了很多兼容性问题，并且使用shiny，jquery是必须的。
* select2是一个jQuery插件，用于创建下拉选择框。
* Font Awesome是一款很酷的icon
* D3.js是一个做数据可视化的JavaScript库，你想做的可视化在这里都可以实现，我用其实现了一个类sunburst图。
* echarts提供了很多类可视化图表，相对来说易上手，只需要找对应的图表api根据demo做就可以。
### csvs的功能
* 选择一个批次的数据，在地图中显示坐标点<br/>
![image](https://github.com/hvdecatrina/CSVS/blob/master/image/1.png)
* 点击点坐标，根据该坐标的数据生成可视化图形，点击分类按钮查看各分类下总体数据信息<br/>
![](https://https://github.com/hvdecatrina/CSVS/image/2.png)
* 与可视化图形交互，生成具体的分类统计图表<br/>
![](https://https://github.com/hvdecatrina/CSVS/image/3.png)
* 与统计图表交互，生成各分类下的详细数据信息<br/>
![](https://https://github.com/hvdecatrina/CSVS/image/4.png)
* 在地图中绘制多边形，可以是矩形也可以是多边形，选择感兴趣的位置点，生成可视化图形进行数据分析<br/>
![](https://https://github.com/hvdecatrina/CSVS/image/4.png)
