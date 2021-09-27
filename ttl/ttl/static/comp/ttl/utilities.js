//-----------------------------------------------------------------------------
// Name:    utilities.js
// Author:  Chris Hoy
// Purpose: Common function what would be used by any dojo based web site
// Created: 04/01/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("ttl.utilities");

dojo.require("dojo.number");

//open a new popup window used for reports
ttl.utilities.gotoDialogPageStatic = function ( url )
{
	ttl.utilities.openPage(url , "_newtab");
}

//open a popup window used for reports this is the commom one work ok with
// most broswers exeption being IE
ttl.utilities.openCommonPage = function ( url )
{
	ttl.utilities.openPage(url , "_newtab");
}

ttl.utilities.openPage = function (url,name)
{
	// fix top make sure that report always appear fix fot IE
	var lname = name;
	if (dojo.isIE) lname = "_blank";
	var win = window.open(url,lname,"alwaysRaised status=0,menubar=0,resizable=1,width=640,height=480,scrollbars=1,addressbar=0,location=1");
	// This make sure that the iconized/background windows is brought to the front
	win.resizeTo(640,480);
	win.focus();
}

ttl.utilities.testPopUpBlocker = function()
{
	var popUpsBlocked = false;


	var mine = window.open('http://localhost/start','','directories=no,height=100,width=100,menubar=no,resizable=no,scrollbars=no,status=no,titlebar=no,top=0,location=no');
	 if(mine)
	    mine.close();
	 else
	    popUpsBlocked = true;

	return popUpsBlocked;
}

ttl.utilities.openStdWindow = function (url,name)
{
	// fix top make sure that report always appear fix fot IE
	var lname = name;
	if (dojo.isIE) lname = "_blank";
	var win = window.open(url,lname);
	win.focus();
}

ttl.utilities.defaultParams = {
	preventCache:true,
	timeout:30000,
	handleAs: 'json',
	url: "/error"
}
// Add standard parameters into a the xhrPost/xhrGet Functions if the incoming params
// have thery values they are used and not the default
ttl.utilities.makeParams = function(inParams)
{
	var res = dojo.mixin(
		ttl.utilities.defaultParams,
		inParams || {}
		);
	if (res["error"]==null)
		res["error"] = ttl.utilities.xhrPostError;

	return res;
}

ttl.utilities.makeParamsIgnore = function(inParams)
{
	var res = dojo.mixin(
		ttl.utilities.defaultParams,
		inParams || {}
		);
	res["error"] = ttl.utilities.globalerrorchecker;
	return res;
}

ttl.utilities.unescapeHtml=function(str)
{
	// returns: HTML String converted back to the normal text (unescaped) characters (<,>,&, ", etc,).
	str = str.replace(/&amp;/gm, "&").replace(/&lt;/gm, "<").replace(/&gt;/gm, ">").replace(/&quot;/gm, "\"");
	str = str.replace(/&#39;/gm, "'");
	return str;
}

//
// This takes the node name and work out type if the node exists and then set it to
// the default value
ttl.utilities.stdFormClearFunction=function(e)
{
	if (typeof(this[e]) != 'undefined')
	{
		// this if for a text node
		if (this[e].type=="text")
			this[e].setValue("");
		// this is for a checkbox
		if (this[e].type=="checkbox")
			this[e].setValue(false);
	}
}
// stand error message hanlder
ttl.utilities.xhrPostError=function(response, ioArgs)
{
	ttl.utilities.errorchecker(response);

	// no message
	if (TTL.isDebug==false) return;

	try
	{
		alert("Problem with call to server :\nstatus: "+response.status + "\nmessage :" + response.message+ "\nresponseText :" + response.responseText);
	}
	catch (e)
	{
		alert("Problem with call to server\n"+response);
	}
}

// stand error message hanlder
ttl.utilities.errorchecker=function(response)
{
	var security_failed = false;
	try
	{
		if ( response.status==403)
			security_failed =true;
	}
	catch(a) { }

	if (security_failed)
	{
		window.location.href = "/login";
		throw "Security Failure";
	}
}

ttl.utilities.globalerrorchecker=function()
{
	console.log("globalerrorchecker");
	console.log(arguments);
	console.log(arguments.length);
	if ( arguments.length==3)
	{
		ttl.utilities.errorchecker ( arguments[1]);
	}
	else if ( arguments.length==2)
	{
		ttl.utilities.errorchecker ( arguments[0]);
	}
}

ttl.utilities.onDownloadError=function(response)
{
	console.log(arguments);
	ttl.utilities.errorchecker(response);
	return this.errorMessage;
}

ttl.utilities.callFailedError=function(response)
{
	// no message
	if (TTL.isDebug==false) return;

	try
	{
		alert("Problem :\nError: "+response.data.error);
	}
	catch (e)
	{
		alert("Problem with call to server\n"+response);
	}
}


//  standard message system
ttl.utilities.showMessageStd=function(message,duration)
{
	var widget = dijit.byId('toast');
	if (widget)
	{
		widget.contentNode.innerHTML="";
		widget.setContent(message,'message',duration||1000);
		widget.show();
	}
}

ttl.utilities.showMessageError=function(message)
{
	var widget = dijit.byId('toast');
	if (widget)
	{
		widget.contentNode.innerHTML="";
		widget.setContent(message,'error',0);
		widget.show();
	}
}

ttl.utilities.hideMessage=function()
{
	var widget = dijit.byId('toast');
	if (widget)
	{
		widget.hide();
		widget.contentNode.innerHTML="";
	}
}

ttl.utilities.isNumber= function (number)
{
	var ok = true;
	var str = number;
    var re = /^[-]?\d*\.?\d*$/;
    str = str.toString();
    if (!str.match(re))
		ok = false;
	try
	{
		parseFloat(number);
	}
	catch(e) { ok = false ; }

	return ok;
}

ttl.utilities.getOuterSize=function(domNode)
{
	var c = dojo.coords(domNode);
	c.x=c.y=c.l=c.t = 0;
	console.log(c);
	return c ;
}

ttl.utilities.resize=function(obj)
{
	var c = this.getOuterSize(obj.parentNode||obj.parent);
	obj.domNode.style.height=c.h+"px";
	console.log(obj.domNode);
}

ttl.utilities.formValidator=function(form)
{
	var actForm = null;
	return dojo.every(form.getDescendants(),
		function(widget)
		{
			// ignore disabled ones
			if (widget.get("disabled")==true )
				return true;

			var rest = !widget.isValid || widget.isValid();
			if ( rest == false )
			{
				if (widget.isFocusable())
				{
					try{
						// if hidden this will throw an error
						widget.focus();
					} catch(e) {}
				}
				else
					rest = true ;
			}
			return rest;
	 	});
}

ttl.utilities.getPreventCache=function(inParams)
{
	return dojo.mixin(
			{"dojo.preventCache": new Date().valueOf()},
			inParams || {});
}

ttl.utilities.getTabButton = function(tabControl,bNumber)
{
	//var button = tabControl.tablist.pane2button[tabControl.getChildren()[bNumber]];
	var button = null;
	for ( var x = 0 ; x < tabControl.tablist._buttons.length; x++ )
	{
		if ( x == bNumber  )
		{
			button = tabControl.tablist._buttons[x];
			break;
		}
	}
	return button ;
}

ttl.utilities.round_decimals = function (original_number, decimals) {
    var result1 = original_number * Math.pow(10, decimals);
    var result2 = Math.round(result1);
    var result3 = result2 / Math.pow(10, decimals);
    return ttl.utilities.pad_with_zeros(result3, decimals);
}

ttl.utilities.pad_with_zeros = function (rounded_value, decimal_places) {

    // Convert the number to a string
    var value_string = rounded_value.toString()

    // Locate the decimal point
    var decimal_location = value_string.indexOf(".")

    // Is there a decimal point?
    if (decimal_location == -1) {

        // If no, then all decimal places will be padded with 0s
        decimal_part_length = 0

        // If decimal_places is greater than zero, tack on a decimal point
        value_string += decimal_places > 0 ? "." : ""
    }
    else {

        // If yes, then only the extra decimal places will be padded with 0s
        decimal_part_length = value_string.length - decimal_location - 1
    }

    // Calculate the number of decimal places that need to be padded with 0s
    var pad_total = decimal_places - decimal_part_length

    if (pad_total > 0) {

        // Pad the string with 0s
        for (var counter = 1; counter <= pad_total; counter++)
            value_string += "0"
        }
    return value_string
}

ttl.utilities.formatButtonCell = function(inDatum) {
	if (inDatum==true)
	{
		return '<i class="fa fa-check" style="color:blue"></i>';
	}
	else
	{
		return '<i class="fa fa-check" style="color:#f6f6f6"></i>';
		//return '<i class="far fa-square"></i>';
	}
//	var status = inDatum==true? 'checked.gif':'unchecked.gif';
//	return '<img  height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/'+status+'" ></img>';
	}


ttl.utilities.outletType = function(inDatum) {
	if (inDatum == null ) return "...";

	var color = "";

	switch ( inDatum )
	{
		case 'national':
			color="blue";
			break;
		case 'regional':
			color="green";
			break;
		case 'business':
			color="yellow";
			break;
		case 'consumer':
			color="orange";
			break;
		case 'television':
			color="purple";
			break;
		case 'radio':
			color="black";
			break;
		case 'internet':
			color="pink";
			break;
		case 'news':
			color="indigo";
			break;
		case 'others':
			color="white";
			break;
		case 'freelance':
			color="white";
			break;
		case 'parliamentary':
			color="gray";
			break;
	}
	return "<div style='background-color:"+color + ";width:6px;height:100%'>&nbsp;</div>";
}

ttl.utilities.formatRowCtrl = function(inDatum) {
	return '<i class="fa fa-chevron-right"></i>'
//	return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/rowctrl.gif"></img>';
	}

ttl.utilities.formatRowCtrlExists = function(inDatum)
{
	if ( inDatum == true )
	{
		return '<i class="fa fa-chevron-right"></i>'
		//return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/rowctrl.gif"></img>';
	}
	else
	{
	return "&nbsp;";
	}
}

ttl.utilities.format_row_ctrl = function(inDatum) {
	return '<i class="fa fa-bars" ></i>';
	}

ttl.utilities.formatRowCtrlLarge = function(inDatum) {
	return '<i class="fa fa-chevron-right fa-lg"></i>'
//	return '<img height="20px" width="20px" style="padding:0x;margin:0px" src="/prcommon/images/rowctrllarge.gif"></img>';
	}

ttl.utilities.formatDeletedCtrl = function(inDatum) {
	if ( inDatum == 2 )
		return '<i class="fa fa-times" style="color:red"></i>'

//		return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/delete.gif"></img>';
	else
		return "&nbsp;";
	}

ttl.utilities.deleteRowCtrl = function(inDatum) {
	return '<i class="fa fa-times" style="color:red"></i>'

//	return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/delete.gif"></img>';
	}

ttl.utilities.editRowCtrl = function(inDatum) {
	return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/edit.gif"></img>';
	}

ttl.utilities.formatCopyCtrl= function(inDatum) {
	return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/copy.gif"></img>';
	}

ttl.utilities.toJsonDate = function( inDate)
{
	if ( inDate == null )
		return "";
	else
		return inDate.getFullYear() + "-" + (inDate.getMonth() + 1 )  + "-" + inDate.getDate();
}

ttl.utilities.toJsonDate2 = function( inDate)
{
	if ( inDate == null )
		return "";
	else
		var y = inDate.getFullYear();
		var m = inDate.getMonth() + 1;
		var d = inDate.getDate();
		return y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
}

ttl.utilities.toJsonTime = function( inDate)
{
	if ( inDate == null )
		return "";
	else
		return inDate.getHours() + ":" + inDate.getMinutes() + ":" + inDate.getSeconds();
}

ttl.utilities.fromJsonDate = function( inDate )
{
	if ( inDate == null || inDate === "")
		return new Date();
	else
	{
		var f = inDate.split("-");
		return new Date ( parseInt(f[0]),parseInt(f[1])-1,parseInt(f[2]));
	}
}

ttl.utilities.fromObjectDate = function( inDate )
{
	if ( inDate == null || inDate === "")
		return new Date();
	else
	{
		return new Date ( new Date(inDate.year, inDate.month-1, inDate.day));
	}
}

ttl.utilities.parseDate = function( inDate )
{
	var tdate = null;

	var tmp = inDate.split("/");
	if ( tmp.length < 3 )
		tmp = inDate.split("-");

	if ( tmp.length == 3 )
		tdate = new Date ( parseInt(tmp[2]),
									parseInt(tmp[1])-1,
									parseInt(tmp[0]));

	return tdate;

}


ttl.utilities.getModelItem = function()
{
	if ( arguments[0].i.i !=null )
		this.tmp_row = arguments[0].i;
	else
		this.tmp_row = arguments[0];
}

ttl.utilities.sleepStupidly = function (usec)
{
	var endtime= new Date().getTime() + usec;
	while (new Date().getTime() < endtime);
}


ttl.utilities.open_close_panel = function ( button, pid )
{
	var ctrl = dojo.byId(pid);
	var newmode = dojo.style(ctrl,"display")=="block"? "none":"block";

	dojo.style(ctrl,"display",newmode);
	button.src = newmode == 'block'? '<i class="fa-minus-circle"></i>':'<i class="fa-plus-circle"></i>' 
//	button.src =  newmode=="block"?"/static/images/toclosed.gif":"/static/images/toopen.gif";
}


// formatter for contact type column
ttl.utilities.formatContactInfo = function(inDatum) {
		// need to check flag for private  is primary
		if (isNaN(inDatum) )
		{
			return "...";
		}
		else
		{
			if ( inDatum != -1 )
			{
				return "<img src='/static/images/private.gif' width='10' height='10' style='padding:0px;margin:0px'/>";
			}
			else
			{
				return "";
			}
		}
};

ttl.utilities.Display_Money = function(inDatum)
{
	if (isNaN(inDatum))	{	return '...'	}
	else
	{
		try	{
			return dojo.number.format (parseFloat ( inDatum ), {places:2});
		}
		catch ( e )		{
			return "0.00"
		}
	}
};

ttl.utilities.documentExists = function(inDatum) {
	if ( inDatum == null )
		return "...";

	if ( inDatum == true )
				return "<img src='/static/images/pdf.gif' width='16' height='16' style='padding:0px;margin:0px'/>";

	return "";
}

ttl.utilities.genericView = function(inDatum) {
	if ( inDatum == null )
		return "...";

	if ( inDatum == true )
				return "<img src='/static/images/view.png' width='16' height='16' style='padding:0px;margin:0px'/>";

	return "";
}

ttl.utilities.pdfView = function(inDatum) {
	return "<img src='/static/images/view.png' width='16' height='16' style='padding:0px;margin:0px'/>";
}

ttl.utilities.formatMb = function(inDatum)
{
	if ( inDatum == null )
		return "...";

	return dojo.number.format (parseFloat ( inDatum )/1000000, {places:2}) + "MB";
}

ttl.utilities.jscDate = function ( inDate )
{
	return new Date ( inDate.getFullYear(), inDate.getMonth() , inDate.getDate(),0,0,0,0);
}

ttl.utilities.Display_Int_Money = function(inDatum)
{
	try
	{
		return dojo.number.format (parseFloat ( inDatum )/100.00, {places:2});
	}
	catch ( e )
	{
		return "0.00";
	}
};

ttl.utilities.fonticon = function(inDatum) {
	if (inDatum == null ) return "...";

	var font_icon = "";

	switch ( inDatum )
	{
		case 'News':
			font_icon="fa fa-newspaper-o";
			break;
		case 'Twitter':
			font_icon="fa fa-twitter-square";
			break;
		case 'Facebook':
			font_icon="fa fa-facebook-square";
			break;
		case 'Forums':
			font_icon="fa fa-forumbee";
			break;
		case 'Blogs':
			font_icon="fa fa-bold";
			break;
		case 'Instagram':
			font_icon="fa fa-instagram";
			break;
		case 'YouTube':
			font_icon="fa fa-youtube-square";
			break;
		case 'GooglePlus':
			font_icon="fa fa-google-plus-official";
			break;
		case 'Tumblr':
			font_icon="fa fa-tumblr-square";
			break;
		case 'VKontakte':
			font_icon="fa fa-check-square";
			break;
		case 'Chat':
			font_icon="fa fa-weixin";
			break;
	}
	return "<div class='"+ font_icon + " fa-lg';width:6px;height:100%'>&nbsp;</div>";
};
