
define("ttl/DateTextBox2", [
	"dojo/_base/declare", // declare
	"dijit/form/DateTextBox",
	"ttl/utilities2"
	], function(declare, DateTextBox){
return declare("ttl.DateTextBox2",
	[DateTextBox],
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
	});
});