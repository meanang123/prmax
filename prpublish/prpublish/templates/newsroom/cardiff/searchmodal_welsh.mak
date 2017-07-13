<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<%include file="../../header_common.mak"/>
<title>PRnewslink - Search</title>
<meta name="description" content="The home page of the PRnewslink Press Release distribution, the essential journalist's news resource for News Releases, Financial Reports, Statements from hundreds of companies and organisations across the UK"></meta>
<meta name="keywords" content="PRnewslink Journalist News Press Distribution SEO Optimised Company, Information, new product information, Press release"></meta>
<%include file="../../header_google.mak"/>
</head>
<body class="cardiff">
<%include file="default_header_welsh.mak"/>
<div class="content-width"></div>

<div class="search-modal">
    <div class="overlay"></div>
    <div class="modal">
        <div class="modal-header-cardiff">Chwilio manwl </div>
        <form class="searchform" action="/searchwelsh" method="post" target="_parent">
            <div class="modal-form-cardiff">
                <label for="keywords">Geiriau allweddol</label>
                <input type="text" name="keywords" value="" id="keywords" class="default-input">
                <div class="clear-fix"></div>
    
                <label for="headline">Pennawd</label>
                <input type="text" name="headline" value="" id="headline" class="default-input">
                <div class="clear-fix"></div>
    
                <label for="bodytext" valign="top">Prif destun</label>
                <textarea resizible="false" name="bodytext" value="" class="default-textarea" id="bodytext" cols="30" rows="10"></textarea>
                <div class="clear-fix"></div>
    
                <label for="category">Categori</label>
                <select name="seocategoryid" id="category">
                    <option value="-1">Dewis popeth</option>
                    % for cat in categories:
                    <option value="${cat['seocategoryid']}">${cat['seocategorydescription_welsh']}</option>
                    %endfor
                </select>
                <div class="clear-fix"></div>
            </div>

            <div class="float-right mt20 mr20">
                <button class="prmax-cardiff-btn white-cardiff-btn"><a href="/">Canslo</a></button>
                <button class="prmax-cardiff-btn light-cardiff-btn" type="submit" value="Submit" >Cyflwyno</button>
            </div>
        <form>
    </div>
</div>
</body>
</html>
