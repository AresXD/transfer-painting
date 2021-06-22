# transfer-painting


该项目以参照图片与待处理图片作为输入，结合 K-平均算法和去阴影算法提取图片的色彩分布，运用“搬土距离”刻画并寻找两分布间最短转化路径，综合重着色算法与插值优化法对待处理图片重着色，并将更改配色后的待处理图片作为输出呈现，将设计流程中的整体颜色风格替换“自动化”。





使用方法：从本地上传待修改及参照图片
<img width="1172" alt="image" src="https://user-images.githubusercontent.com/48643924/122646840-dd496e80-d153-11eb-869e-fb43683d095b.png">


上传成功后显示聚类后提取的矢量图色块
<img width="1008" alt="image" src="https://user-images.githubusercontent.com/48643924/122646818-bc811900-d153-11eb-9bbd-f90fe504d083.png">



点击迁移得到结果（在风景类图像上表现较好）


结果示例：
![结果图片1](https://user-images.githubusercontent.com/48643924/122893535-00089c80-d379-11eb-8208-9e3ab141b565.jpg)



![结果图片2](https://user-images.githubusercontent.com/48643924/122893577-06971400-d379-11eb-88aa-5f0d2ccbc713.jpg)


