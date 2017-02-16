dojo.provide("ttl.Rounded");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("ttl.Rounded",
	[dijit._Widget, dijit._Templated], 
	{
	
	templatePath: dojo.moduleUrl("ttl","templates/Rounded.htm"),
	
	bgImg: "",		// standard background image (png)
	bgImgAlt: "",	// background image for ie6
	bgImgDefault:"/static/images/RoundedLight.png",
	title:"",
	
	postCreate: function() {
		if (this.title.length==0) dojo.style(this.titleTextNode,"display","none");
		if (this.bgImg.length==0) 
			this.bgImg = this.bgImgDefault;
			
		dojo.style(this.contentNode, "height", dojo.style(this.outerNode, "height")-10+'px'); // TODO: Calculate correct height
		
		var alt = (this.bgImgAlt.length && dojo.isIE < 7);
		dojo.forEach(["roundedContent","roundedTop","roundedBottom","roundedBottomDiv"],
			function(elName){
				dojo.style(this[elName],"backgroundImage", "url(" + (alt ? this.bgImgAlt : this.bgImg)  + ")");
			},
		this);
	}
});