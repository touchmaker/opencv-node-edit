if(typeof(LiteGraph) != "undefined")
{
    //Constant
    function ConstantNumber() {
        this.addOutput("value", "number");
        this.addProperty("value", 1.0);
        this.widget = this.addWidget("number","value",1,"value");
        this.widgets_up = true;
        this.size = [180, 30];
    }

    ConstantNumber.title = "number";
    ConstantNumber.desc = "Constant number";

    ConstantNumber.prototype.onExecute = function() {
        this.setOutputData(0, parseFloat(this.properties["value"]));
    };

    ConstantNumber.prototype.getTitle = function() {
        if (this.flags.collapsed) {
            return this.properties.value;
        }
        return this.title;
    };

    ConstantNumber.prototype.setValue = function(v)
    {
        this.setProperty("value",v);
    }

    ConstantNumber.prototype.onDrawBackground = function(ctx) {
        //show the current value
        this.outputs[0].label = this.properties["value"].toFixed(3);
    };

    LiteGraph.registerNodeType("basic/number", ConstantNumber);


    function ConstantString() {
        this.addOutput("string", "string");
        this.addProperty("value", "");
        this.widget = this.addWidget("text","value","","value");  //link to property value
        this.widgets_up = true;
        this.size = [180, 30];
    }

    ConstantString.title = "string";
    ConstantString.desc = "Constant string";

    ConstantString.prototype.getTitle = ConstantNumber.prototype.getTitle;

    ConstantString.prototype.onExecute = function() {
        this.setOutputData(0, this.properties["value"]);
    };

	ConstantString.prototype.setValue = ConstantNumber.prototype.setValue;

	ConstantString.prototype.onDropFile = function(file)
	{
		var that = this;
		var reader = new FileReader();
		reader.onload = function(e)
		{
			that.setProperty("value",e.target.result);
		}
		reader.readAsText(file);
	}

    LiteGraph.registerNodeType("basic/string", ConstantString);
}