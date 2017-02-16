dojo.provide("prmax.email.emaileditorclear");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._editor._Plugin");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dojo.string");

dojo.declare("prmax.email.emaileditorclear",
	dijit._editor._Plugin,
	{
		buttonClass: dijit.form.Button,

		useDefaultCommand: false,
		command:"clearEditor",

		_initButton: function()
		{
			//this.inherited("_initButton", arguments);
			if(!this.button){
				var className = this.iconClassPrefix+" "+this.iconClassPrefix + this.command.charAt(0).toUpperCase() + this.command.substr(1);
				var props = dojo.mixin({
						label: "Clear",
						tabIndex: "-1"
					}, arguments || {});
					this.button =new dijit.form.Button(props);
				this.connect(this.button, "onClick", this._tabIndent);
			}
		},
		_tabIndent: function(){
			this.editor.set("value","");
		}
	}
);

// Register this plugin.
dojo.subscribe(dijit._scopeName + ".Editor.getPlugin",null,function(o){
	if(o.plugin){ return; }
	switch(o.args.name){
	case "clearEditor":
		o.plugin = new prmax.email.emaileditorclear({command: o.args.name});
	}
});
