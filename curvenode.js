if(typeof(LiteGraph) != "undefined")
{

    ///curve
    function curve(){
    	this.curve_editor = null;
    	this._points = [[0,0],[1,1]];
    	this.curve_offset = 68;
    	this.size = [200,200];
    }

    curve.title ='curve'
    curve.desc = "polyon curve edit"

    curve.prototype.onExecute = function() {

    };

    curve.prototype.onDrawBackground = function(ctx, graphcanvas)
	{
		if(this.flags.collapsed)
			return;

		if(!this.curve_editor)
			this.curve_editor = new LiteGraph.CurveEditor(this._points);

		ctx.save();
		// ctx.translate(0,this.curve_offset);
		// this.curve_editor.points = this._points[channel];
		this.curve_editor.draw( ctx, [this.size[0],this.size[1]], 
			graphcanvas, 
			"green", 
			"red");
		ctx.restore();
	}

	curve.prototype.onMouseDown = function(e, localpos, graphcanvas)
	{
		if(this.curve_editor)
		{
			var r = this.curve_editor.onMouseDown([localpos[0],localpos[1]], graphcanvas);
			if(r)
				this.captureInput(true);
			return r;
		}
	}

	curve.prototype.onMouseMove = function(e, localpos, graphcanvas)
	{
		if(this.curve_editor)
			return this.curve_editor.onMouseMove([localpos[0],localpos[1]], graphcanvas);
	}

	curve.prototype.onMouseUp = function(e, localpos, graphcanvas)
	{
		if(this.curve_editor)
			return this.curve_editor.onMouseUp([localpos[0],localpos[1]], graphcanvas);
		this.captureInput(false);
	}

	LiteGraph.registerNodeType("curve/curve", curve);
}