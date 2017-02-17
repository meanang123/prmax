dojo.provide("ttl.DateTextBox");

dojo.require("dijit.form.DateTextBox");
dojo.require("ttl.utilities");

dojo.declare(
	"ttl.DateTextBox",
	dijit.form.DateTextBox,
	{
		_getValueISOAttr:function()
		{
			var pData = this.textbox.value;
			if ( pData.length > 0 )
			{
				var tmp = pData.split("/");
				if ( tmp.length >=3 )
					return tmp[2] + "/" + tmp[1]  + "/" + tmp[0] ;
			}
			return "";
		}
	}
);