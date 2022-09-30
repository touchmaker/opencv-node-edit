Eel opencv node editor  

requirement:
```bash
pip install eel
pip install opencv-python
```
Cancel changes
file structure
```
eel_run.py     <-- Python scripts
switch.py
web/           <-- Web folder
  test01.jpg
  test02.jpg
  test03.jpg
  main.html
  css/
    menu.css
  js/
    litegraph.core.js
    comm.js
    curvenode.js
    nodecv.js
    menu.js
```

run application

```
python eel_run.py
```

now supported node

|name  |desc  |
|--|--|
| rgb | rgb |
|hsv	| hsv| 
| 	hsv2rgb| 	convert hsv2rgb| 
| 	rgb2hsv| 	convert rgb2hsv| 

	

### input
|name  |desc  |
|--|--|
|	image|	input local image|
|	camera|	camera|
|	weburl	|not yet now|

### output
|name  |desc  |
|--|--|
|Preview	|图像显示|
|	Save image|	图像保存|
		
### image utils
|name  |desc  |
|--|--|
|	rotate|rotate image|
|	scale|	resize iamge|
|	shape|	get size of image|
|	Split|	split rgb channel|
|	Merge	|merge channel|
|	connectedComponents|	connect components|

### image ops
|name  |desc chinese |
|--|--|
|Threshold|	旋转|
|	Canny	|拉伸|
|	Gauss|	高斯模糊|
|	Erode|	腐蚀|
|	Dilate|	和膨胀|
|	Filter|	筛选|

### image desc/labing
|name  |desc  |
|--|--|
|	Hist	|histogram|
|	Drawstr|	draw string on image|
|	Rect	|draw rect on image|
|	Line	|draw line on image|
		
array(not yet)
|name  |desc  |
|--|--|
|group|
|	each|	for each item in group|
