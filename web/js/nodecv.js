if(typeof(LiteGraph) != "undefined")
{

	function image2Base64(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    }

	function rgb2hex(rgb) {
		var aRgb = rgb instanceof Array ? rgb : (rgb.split(',') || [0, 0, 0]);
		var temp;
		return [
			(temp = Number(aRgb[0]).toString(16)).length == 1 ? ('0' + temp) : temp,
			(temp = Number(aRgb[1]).toString(16)).length == 1 ? ('0' + temp) : temp,
			(temp = Number(aRgb[2]).toString(16)).length == 1 ? ('0' + temp) : temp,
		].join('');
	}

	function _rgb2hsv(arr) {
	    var h = 0, s = 0, v = 0;
	    var r = arr[0], g = arr[1], b = arr[2];
	    arr.sort(function (a, b) {
	        return a - b;
	    })
	    var max = arr[2]
	    var min = arr[0];
	    v = max / 255;
	    if (max === 0) {
	        s = 0;
	    } else {
	        s = 1 - (min / max);
	    }
	    if (max === min) {
	        h = 0;//事实上，max===min的时候，h无论为多少都无所谓
	    } else if (max === r && g >= b) {
	        h = 60 * ((g - b) / (max - min)) + 0;
	    } else if (max === r && g < b) {
	        h = 60 * ((g - b) / (max - min)) + 360
	    } else if (max === g) {
	        h = 60 * ((b - r) / (max - min)) + 120
	    } else if (max === b) {
	        h = 60 * ((r - g) / (max - min)) + 240
	    }
	    h = parseInt(h);
	    s = parseInt(s * 100);
	    v = parseInt(v * 100);
	    return [h, s, v]
	}

	function _hsv2rgb(arr) {
	    var h = arr[0], s = arr[1], v = arr[2];
	    s = s / 100;
	    v = v / 100;
	    var r = 0, g = 0, b = 0;
	    var i = parseInt((h / 60) % 6);
	    var f = h / 60 - i;
	    var p = v * (1 - s);
	    var q = v * (1 - f * s);
	    var t = v * (1 - (1 - f) * s);
	    switch (i) {
	        case 0:
	            r = v; g = t; b = p;
	            break;
	        case 1:
	            r = q; g = v; b = p;
	            break;
	        case 2:
	            r = p; g = v; b = t;
	            break;
	        case 3:
	            r = p; g = q; b = v;
	            break;
	        case 4:
	            r = t; g = p; b = v;
	            break;
	        case 5:
	            r = v; g = p; b = q;
	            break;
	        default:
	            break;
	    }
	    r = parseInt(r * 255.0)
	    g = parseInt(g * 255.0)
	    b = parseInt(b * 255.0)
	    return [r, g, b];
	}

	function hex2rgb(hex) {
		if (hex.length == 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		return [
			parseInt(hex[0] + hex[1], 16),
			parseInt(hex[2] + hex[3], 16),
			parseInt(hex[4] + hex[5], 16),
		].join();
	}

	function rgb2str(rgb){
		return "rgb("+[
			rgb[0].toString(),
			rgb[1].toString(),
			rgb[2].toString(),
		].join(",")+")"
	}

	//color picker rgb
	function colorrgb(){
		this.addOutput("color","color");
		this.size = [200, 150];
		this.properties ={
			red:128,
			green:128,
			blue:128
		};
		this.node_color = [115,255,105];
		this.bgcolor = 'rgb(128,128,128)'
		var that = this;
		this.slider_widget_r = this.addWidget(
			"slider",
			"red",
			 this.properties.red,
			 function(v){
			 	that.properties.red = parseInt(v);
			 	color = [that.properties.red,that.properties.green,that.properties.blue]
			 	that.node_color = color;
			 	that.bgcolor = rgb2str(color)
			 },
			 { min: 1, max: 255} 
		);
		this.slider_widget_g = this.addWidget(
			"slider",
			"green",
			 this.properties.green,
			 function(v){
			 	that.properties.green = parseInt(v);
			 	color = [that.properties.red,that.properties.green,that.properties.blue]
			 	that.node_color = color;
			 	// console.log()
			 	// alert(rgb2str(that.node_color))
			 	that.bgcolor = rgb2str(color)
			 },
			 { min: 1, max: 255} 
		);
		this.slider_widget_b = this.addWidget(
			"slider",
			"blue",
			 this.properties.blue,
			 function(v){
			 	that.properties.blue = parseInt(v);
			 	color = [that.properties.red,that.properties.green,that.properties.blue]
			 	that.node_color = color;
			 	that.bgcolor = rgb2str(color)
			 },
			 { min: 1, max: 255} 
		);
	}

	// colorPicker.prototype.onDrawForeground = function(ctx, graphcanvas)
	// {
	// 	if(this.flags.collapsed){
	// 		return;
	// 	}

	// 	ctx.save();
	// 	ctx.fillStyle = rgb2str(this.node_color);
	// 	ctx.fillRect(0,150,64,64);
	// 	ctx.restore();
	// }

	colorrgb.title = "rgb";
	colorrgb.desc ='color Picker rgb'

	colorrgb.prototype.onExecute = function() {
		this.setOutputData(0,this.node_color);
	}

	LiteGraph.registerNodeType("color/rgb",colorrgb)

	////
	//color picker rgb
	function colorhsv(){
		this.addOutput("color","color");
		this.properties = {
			Hue:115,
			Saturation:255,
			Value:105
		};
		this.node_color = [115,255,105];
		this.bgcolor =  rgb2str(_hsv2rgb(this.node_color))
		var that = this;
		this.slider_widget_h = this.addWidget(
			"slider",
			"Hue",
			 this.properties.Hue,
			 function(v){
			 	that.properties.Hue = parseInt(v);
			 	var color = [that.properties.Hue,that.properties.Saturation,that.properties.Value]
			 	that.node_color = color;
			 	that.bgcolor = rgb2str(_hsv2rgb(color))
			 },
			 { min: 1, max: 255} 
		);
		this.slider_widget_s = this.addWidget(
			"slider",
			"Stauration",
			 this.properties.Saturation,
			 function(v){
			 	that.properties.Saturation = parseInt(v);
			 	var color = [that.properties.Hue,that.properties.Saturation,that.properties.Value]
			 	that.node_color = color;
			 	// console.log()
			 	// alert(rgb2str(that.node_color))
			 	that.bgcolor = rgb2str(_hsv2rgb(color))
			 },
			 { min: 1, max: 255} 
		);
		this.slider_widget_v = this.addWidget(
			"slider",
			"Value",
			 this.properties.Value,
			 function(v){
			 	that.properties.Value = parseInt(v);
			 	var color = [that.properties.Hue,that.properties.Saturation,that.properties.Value]
			 	that.node_color = color;
			 	that.bgcolor = rgb2str(_hsv2rgb(color))
			 },
			 { min: 1, max: 255} 
		);
	}

	colorhsv.title = "hsv";
	colorhsv.desc ='color Picker hsv'

	colorhsv.prototype.onExecute = function() {
		this.setOutputData(0,this.node_color);
	}

	LiteGraph.registerNodeType("color/hsv",colorhsv)


	///rgb2hsv
	function rgb2hsv() {
		this.addInput("rgb","color")
		// this.addInput("B","number")
		this.addOutput("hsv","color");
	}

	rgb2hsv.title = "rgb2hsv";
	rgb2hsv.desc ='rgb2hsv'

	rgb2hsv.prototype.onExecute = function() {
		var A = this.getInputData(0);
		if (A === undefined){
			this.setOutputData(0,[0,0,0])
		}
		else{
			var B = _rgb2hsv(A);
			console.log(B)
			this.setOutputData(0,B);
		}
	}

	LiteGraph.registerNodeType("color/rgb2hsv",rgb2hsv)



	//imageNode
	function imageNode(){
		// this.addInput("A","mesh")
		// this.addInput("B","number")
		this.addOutput("image","image");
		this.base64_code = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
		this.image_base = document.createElement("img");
		this.image_base.src = "test01.jpg";

		this.properties = {
            image_url: "test01.jpg",
        };

        var that = this;
		this.combo_widget = this.addWidget("combo","", "test01.jpg", 
			function(v){
				that.properties.image_url = v;
				// alert(v)
				this.base64_code = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
				that.image_base.src = that.properties.image_url;
				// graph.runStep();
			},
			{ values:["test01.jpg","test02.jpg","test03.jpg"]}
		);
		
		this.image_base.onload = function(){
			var b64  = image2Base64(that.image_base);
			that.base64_code = b64;
			graph.runStep();
			canvas.setDirty(true,true)
		}
	}

	imageNode.title = "image";
	imageNode.desc ='load image'

	imageNode.prototype.onExecute = function() {
		this.setOutputData(0,this.base64_code);
	}

	LiteGraph.registerNodeType("input/image",imageNode)

	//threshold
	function thresholdNode(){
		this.addInput("image","image")
		this.addOutput("image","image")
		this.input = "";
		this.output = "";
		this.properties = {
            threshold: 100,
            thres_type:"THRESH_BINARY"
        };
        var that = this;
		this.slider_widget = this.addWidget(
			"slider",
			"threshold",
			 this.properties.threshold,
			 function(v){
			 	that.properties.threshold = parseInt(v);
			 	graph.runStep();
			 },
			 { min: 1, max: 255} 
		);
		this.combo_widget = this.addWidget("combo","", "THRESH_BINARY", 
			function(v){
				that.properties.thres_type = v;
				// alert(v)
				graph.runStep();
			},
			{ values:["THRESH_BINARY","THRESH_BINARY_INV","THRESH_TRUNC","THRESH_TOZERO","THRESH_TOZERO_INV"]}
		);
		this.addWidget("button","threshold image", null, 
			function(v){
				var A = that.getInputData(0);
				if (A === undefined){
					that.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
				}
				else {
					var A = that.getInputData(0);
					var B = eel.threshold(A,that.properties.threshold,that.properties.thres_type);
					B().then(
						(data)=>{that.output = data},
						(err)=>{that.output = A}
					)
				}
			},
			{}
		);
	}

	thresholdNode.title = "threshold";
	thresholdNode.desc = "threshold single channel image";

	thresholdNode.prototype.onExecute = function() {
		var A = this.getInputData(0)
		if (A === undefined)
		{
			this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}	
		else{
			var A = this.getInputData(0);
			var B = eel.threshold(A,this.properties.threshold,this.properties.thres_type);
			B().then(
				(data)=>{this.output = data;
						this.setOutputData(0,this.output)
				},
				(err)=>{this.output = A;
						that.setOutputData(0,this.output)
				}
			)
		}	
	}


	LiteGraph.registerNodeType("image/threshold",thresholdNode)

	//////////////////////

	//preview
	function previewNode(){
		this.addInput("image","image")
		this.base64 = '';
		this.loaded = false;
		this.size = [200, 80];
		this.imgpre = document.createElement("img");
	}

	previewNode.title = "preview"

	previewNode.prototype.onExecute = function(){
		var A = this.getInputData(0)
		if (A === undefined)//digit 4
			A = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
		this.base64 = A;
	}

	previewNode.prototype.onDrawForeground = function(ctx, graphcanvas)
	{
	  if(this.flags.collapsed){
	  	return;
	  }
	  	// alert(this.base64)
		this.imgpre.src = this.base64;
		// ctx.save();
		ctx.fillColor = "black";
		ctx.fillRect(0,0,this.size[0],this.size[1]);
		ctx.drawImage(this.imgpre, 0, 0);
		// ctx.restore();
	}

	LiteGraph.registerNodeType("output/preview",previewNode)

	//canny
	function cannyNode(){
		this.addInput("image","image")
		this.addOutput("image","image")
		this.input = "";
		this.output = "";
		this.properties = {
            threshold1: 50,
            threshold2: 150,
        };
        var that = this;
		this.slider_widget_th1 = this.addWidget(
			"slider",
			"threshold1",
			 this.properties.threshold1,
			 function(v){
			 	that.properties.threshold1 = parseInt(v);
			 },
			 { min: 1, max: 255} 
		);
		this.slider_widget_th2 = this.addWidget(
			"slider",
			"threshold2",
			 this.properties.threshold2,
			 function(v){
			 	that.properties.threshold2 = parseInt(v);
			 },
			 { min: 1, max: 255} 
		);
	}

	cannyNode.title = "canny";
	cannyNode.desc = "canny single channel image";

	cannyNode.prototype.onExecute = function() {
		var A = this.getInputData(0);
		if (A === undefined){
			that.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}
		else{
			var B = eel.canny(A,this.properties.threshold1,this.properties.threshold2);
			B().then(
				(data)=>{this.output = data;
						 this.setOutputData(0,this.output);
						},
				(err)=>{this.output = A;
						this.setOutputData(0,this.output);
					}
			)
		}
	}

	LiteGraph.registerNodeType("image/canny",cannyNode);

	//gauss blur
	function gaussNode(){
		this.addInput("image","image")
		this.addOutput("image","image");
		this.properties = {
            size:3,
        };
		that = this;
		this.addWidget("combo","kernal size", "3", 
			function(v){
				that.properties.size = v;
			},
			{ values:[3,5,7,11]} 
		);
	}

	gaussNode.title = "gauss";
	gaussNode.desc = "gauss Blur single";

	gaussNode.prototype.onExecute = function() {
		var A = this.getInputData(0);
		if (A === undefined){
			that.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}
		else{
			var A = this.getInputData(0);
			var B = eel.gaussBlur(A,this.properties.size);

			B().then(
				(data)=>{this.output = data;
						 this.setOutputData(0,this.output);
					},
				(err)=>{this.output = A;
						this.setOutputData(0,this.output);
					}
			)
		}

	}

	LiteGraph.registerNodeType("image/gauss",gaussNode)

	// erode
    function erode(){
    	this.addInput("image","image");
    	this.addOutput("erode","image");
    	this.properties = {
            kernel_size: 5,
            iterate_times: 1,
            kernel_type:"MORPH_RECT",
        };
    	var that = this;
    	this.kernal_type = this.addWidget(
    		"combo",
    		"",
    		"MORPH_RECT",
    		function(v){
				that.properties.kernel_type = v;
			},
			{ values:["MORPH_RECT","MORPH_ELLIPSE","MORPH_CROSS"]}

    	);

    	this.slider_widget_kernel = this.addWidget(
			"slider",
			"kernel_size",
			 this.properties.kernel_size,
			 function(v){
			 	that.properties.kernel_size = parseInt(v);
			 },
			 { min: 1, max: 15} 
		);
    	this.slider_widget_iterate = this.addWidget(
			"slider",
			"iterate",
			 this.properties.iterate_times,
			 function(v){
			 	that.properties.iterate_times = parseInt(v);
			 },
			 { min: 1, max: 4} 
		);
    }

    erode.title = "erode";
    erode.desc = "erode image";

    erode.prototype.onExecute = function(){
		var A = this.getInputData(0);
		if (A === undefined){
			this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}
		else{
			var B = eel.erode(A,this.properties.kernel_size,this.properties.kernel_type,this.properties.iterate_times);

			B().then(
				(data)=>{
					this.setOutputData(0,data);},
				(err)=>{
					this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=");
				}
			)
		}

    }

    LiteGraph.registerNodeType("image/erode", erode);

    ////

    // dilate
    function dilate(){
    	this.addInput("image","image");
    	this.addOutput("dilate","image");
    	this.properties = {
            kernel_size: 5,
            iterate_times: 1,
            kernel_type:"MORPH_RECT",
        };
    	var that = this;
    	this.kernal_type = this.addWidget(
    		"combo",
    		"",
    		"MORPH_RECT",
    		function(v){
				that.properties.kernel_type = v;
			},
			{ values:["MORPH_RECT","MORPH_ELLIPSE","MORPH_CROSS"]}

    	);

    	this.slider_widget_kernel = this.addWidget(
			"slider",
			"kernel_size",
			 this.properties.kernel_size,
			 function(v){
			 	that.properties.kernel_size = parseInt(v);
			 },
			 { min: 1, max: 15} 
		);
    	this.slider_widget_iterate = this.addWidget(
			"slider",
			"iterate",
			 this.properties.iterate_times,
			 function(v){
			 	that.properties.iterate_times = parseInt(v);
			 },
			 { min: 1, max: 4} 
		);
    }

    dilate.title = "dilate";
    dilate.desc = "dilate image";

    dilate.prototype.onExecute = function(){
		var A = this.getInputData(0);
		if (A === undefined){
			this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}
		else{
			var B = eel.dilate(A,this.properties.kernel_size,this.properties.kernel_type,this.properties.iterate_times);

			B().then(
				(data)=>{
					this.setOutputData(0,data);},
				(err)=>{
					this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=");
				}
			)
		}

    }

    LiteGraph.registerNodeType("image/dilate", dilate);


    // Split_Red
    function Split_Channel(){
    	this.addInput("image","image");
    	this.addOutput("red","image");
    	this.addOutput("green","image");
    	this.addOutput("blue","image");
    }

    Split_Channel.title = "split"

    Split_Channel.prototype.onExecute = function(){
		var A = this.getInputData(0);
		if (A === undefined){
			this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}
		else{
			var B = eel.split_red(A);

			B().then(
				(data)=>{
					this.setOutputData(0,data[0]);
					this.setOutputData(1,data[1]);
					this.setOutputData(2,data[2]);
				},
				(err)=>{this.setOutputData(0,A);}
			)
		}
    }
    LiteGraph.registerNodeType("image/split", Split_Channel);

    //info
    function Info(){
    	this.addInput("image","image");
    	this.addOutput("width","number");
    	this.addOutput("height","number");
    	this.img = document.createElement("img");
    	that = this;
    	this.addWidget("button","get size", null, 
			function(v){
				if(that.inputs[0]){
					var A = that.getInputData(0);
					that.img.src = A;
					that.setOutputData(0,that.img.width);
					that.setOutputData(1,that.img.height);	
				}
			},
		{});
    	this.value = [0,0];
    }

    Info.title = "info"
    Info.desc = "get Image infomation "

    Info.prototype.onExecute = function(){
    	if(this.inputs[0]){
			var A = this.getInputData(0);
			this.img.src = A;
			this.setOutputData(0,this.img.width);
			this.setOutputData(1,this.img.height);	
		}
    }
    LiteGraph.registerNodeType("image/info", Info);

    //color filter
    function filter(){
    	this.addInput("image","image");
    	this.addInput("low","color");
    	this.addInput("upper","color");
    	this.addOutput("filter","image");
    }

    filter.title = "filter"
    filter.desc = "filter Image"

    filter.prototype.onExecute = function(){
    	var A = this.getInputData(0);
		if (A === undefined){
			this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}
		else{

			var low = this.getInputData(1);
			var upper = this.getInputData(2);

			if (low === undefined){
				low = [60, 35, 140]
			}

			if (upper === undefined){
				upper = [180, 255, 255]
			}

			var B = eel.color_filter(A,low,upper);

			B().then(
				(data)=>{
					this.setOutputData(0,data);
				},
				(err)=>{this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=");}
			)
		}    	
    }

    LiteGraph.registerNodeType("image/filter", filter);

    function Watch() {
        this.size = [60, 30];
        this.addInput("value", 0, { label: "" });
        this.edit = this.addWidget("text","","");
        this.value = 0;
    }

    Watch.title = "Watch";
    Watch.desc = "Show value of input";

    Watch.prototype.onExecute = function() {
        if (this.inputs[0]) {
            this.value = this.getInputData(0);
            this.edit.value = this.value;
        }
    };

    Watch.prototype.getTitle = function() {
        if (this.flags.collapsed) {
            return this.inputs[0].label;
        }
        return this.title;
    };

    Watch.toString = function(o) {
        if (o == null) {
            return "null";
        } else if (o.constructor === Number) {
            return o.toFixed(3);
        } else if (o.constructor === Array) {
            var str = "[";
            for (var i = 0; i < o.length; ++i) {
                str += Watch.toString(o[i]) + (i + 1 != o.length ? "," : "");
            }
            str += "]";
            return str;
        } else {
            return String(o);
        }
    };


    LiteGraph.registerNodeType("debug/watch", Watch);

    ///
    function histogram() {
        this.addInput("image","image");
        this.addOutput("image","image");
        this.properties = {
            channel:0,
        };
        var that = this;
    	this.kernal_type = this.addWidget(
    		"combo",
    		"",
    		"0",
    		function(v){
				that.properties.channel = v;
			},
			{ values:[0,1,2,3]}

    	);
    }

    histogram.title = "histogram";
    histogram.desc = "calc histogram";

    histogram.prototype.onExecute = function() {
    	var A = this.getInputData(0);
		if (A === undefined){
			this.setOutputData(0,"error")
		}
		else{
			var B = eel.hist(A,this.properties.channel);

			B().then(
				(data)=>{
					this.setOutputData(0,data);
					// alert(data)
				},
				(err)=>{this.setOutputData(0,"error");}
			)
		}
    };

    LiteGraph.registerNodeType("image/histogram", histogram);

    ///
    ///
    function chart() {
        this.addInput("image","image");

        this.data_serial = [0,255];
    }

    chart.title = "chart";
    chart.desc = "Show histogram chart";

    chart.prototype.onExecute = function() {
    	var A = this.getInputData(0);
		if (A === undefined){
			this.data_serial=[0,255];
		}
		else{
			this.data_serial = A.split(',');
		}
    };

    chart.prototype.onDrawForeground = function(ctx, graphcanvas)
	{
		if(this.flags.collapsed){
			return;
		}

		ctx.save();
		ctx.fillColor = "grey";
		ctx.fillRect(0,0,140,128);
		var _len = this.data_serial.length;

		var max = Math.max(...this.data_serial);

		ctx.strokeStyle="#000000";
		ctx.fillStyle="#000000";
		ctx.beginPath();
		ctx.moveTo(0,128);
		for(i=0;i<_len;i++){
			var cv = parseInt (this.data_serial[i])
			ctx.lineTo(i/256*140,128-128*(cv/max));
		}
		// ctx.stroke();
		ctx.lineTo(140,128);
		ctx.lineTo(0,128);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}

    LiteGraph.registerNodeType("image/chart", chart);

    ///
    function drawstr(){
    	this.addInput("image","image");
    	this.addInput("string","string");
    	this.addOutput("output","image");
    	// this.addWidget("string",this.properties.text);
    	this.properties = {
            pos_x: 50,
            pos_y: 150,
            text:"demo"
        };
        var that = this;
    	this.slider_widget_x = this.addWidget(
			"slider",
			"",
			this.properties.pos_x,
			function(v){
			 	that.properties.pos_x = parseInt(v);
			 },
			 { min: 1, max: 512} 
		);
		this.slider_widget_y = this.addWidget(
			"slider",
			"",
			 this.properties.pos_y,
			 function(v){
			 	that.properties.pos_y = parseInt(v);
			 },
			 { min: 1, max: 512} 
		);
    }

    drawstr.title = "drawstr";

    drawstr.prototype.onExecute = function() {
    	var A = this.getInputData(0);
    	var Text = this.getInputData(1);

		if (A === undefined){
			this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=");
		}
		else{
			if (Text == undefined) {
				Text = "none";
			}

			var B = eel.drawStr(A,Text,this.properties.pos_x,this.properties.pos_y);

			B().then(
				(data)=>{
					this.setOutputData(0,data);
				},
				(err)=>{this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=");}
			)
		}



	}

    LiteGraph.registerNodeType("image/drawstr", drawstr);

    function connectComponents(){
    	this.addInput("image","image");
    	this.addOutput("states","array");
    }

    LiteGraph.registerNodeType("image/connectComps", connectComponents);


    function arreach(){
    	this.addInput("array","array");
    	this.addOutput("item","string");
    }

    LiteGraph.registerNodeType("array/each", arreach);

    /// rotate
    function rotate(){
    	this.addInput("image","image");
    	this.addOutput("filter","image");
    	this.properties = {
    		angle:0,
    		size:false
    	};

    	var that = this;
    	this.slider_widget_angle = this.addWidget(
			"slider",
			"angle",
			 this.properties.angle,
			 function(v){
			 	that.properties.angle = v;
			 },
			 { min: 0, max: 180} 
		);

		this.addWidget("toggle",
			"force size",
			false,
			function(v){
				// alert(v)
				that.properties.size = v; 
			}
			);

    }

    rotate.title = "rotate";
    rotate.desc = "rotate Image";

    rotate.prototype.onExecute = function(){
    	var A = this.getInputData(0);
		if (A === undefined){
			this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=")
		}
		else{
			var B = null;
			if(this.properties.size == true){
				B = eel.rotate(A,this.properties.angle);
			}
			else{
				B = eel.rotate_b(A,this.properties.angle);
			}

			B().then(
				(data)=>{
					this.setOutputData(0,data);
				},
				(err)=>{this.setOutputData(0,"data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=");}
			)
		}    	
    }

    LiteGraph.registerNodeType("image/rotate", rotate);


}