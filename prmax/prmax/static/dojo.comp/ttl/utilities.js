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
			if (widget.attr("disabled")==true )
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
	var status = inDatum==true? 'checked.gif':'unchecked.gif';
	return '<img  height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/'+status+'" ></img>';
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
	}
	return "<div style='background-color:"+color + ";width:6px;height:100%'>&nbsp;</div>";
}

ttl.utilities.formatRowCtrl = function(inDatum) {
	return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/rowctrl.gif"></img>';
	}

ttl.utilities.formatRowCtrlLarge = function(inDatum) {
	return '<img height="20px" width="20px" style="padding:0x;margin:0px" src="/static/images/rowctrllarge.gif"></img>';
	}

ttl.utilities.formatDeletedCtrl = function(inDatum) {
	if ( inDatum == 2 )
		return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/delete.gif"></img>';
	else
		return "&nbsp;";
	}

ttl.utilities.deleteRowCtrl = function(inDatum) {
	return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/delete.gif"></img>';
	}

ttl.utilities.editRowCtrl = function(inDatum) {
	return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/edit.gif"></img>';
	}

