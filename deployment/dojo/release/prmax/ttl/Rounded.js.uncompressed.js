// wrapped by build app
define("ttl/Rounded", ["dijit","dojo","dojox","dojo/require!dijit/_Widget,dijit/_Templated"], function(dijit,dojo,dojox){
dojo.provide("ttl.Rounded");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");

dojo.declare("ttl.Rounded",
	[dijit._Widget, dijit._Templated], 
	{
	
	templateString:"<div class=\"Rounded\" dojoAttachPoint=\"outerNode\">\n\t<div class=\"RoundedContent\" dojoAttachPoint=\"roundedContent\">\n\t    <div class=\"RoundedTop\" dojoAttachPoint=\"roundedTop\"></div>\n\t    <div dojoAttachPoint=\"contentNode\">\n\t\t\t<div dojoAttachPoint='titleTextNode' class='RoundedTitle'>${title}</div>\n\t\t\t<div dojoAttachPoint=\"containerNode\"></div>\n\t\t</div>\n\t</div>\n\t<div class=\"RoundedBottom\" dojoAttachPoint=\"roundedBottom\"><div dojoAttachPoint=\"roundedBottomDiv\"></div>\n</div>",
	
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
});
