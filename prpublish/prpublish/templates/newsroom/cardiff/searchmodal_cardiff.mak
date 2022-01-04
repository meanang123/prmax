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
<%include file="default_header_cardiff.mak"/>
<div class="content-width"></div>

<div class="search-modal">
    <div class="overlay"></div>
    <div class="modal">
        <div class="modal-header-cardiff">Detailed search </div>
        <form class="searchform" action="/searchcardiff" method="post" target="_parent">
            <div class="modal-form-cardiff">
                <label for="keywords">Keywords</label>
                <input type="text" name="keywords" value="" id="keywords" class="default-input">
                <div class="clear-fix"></div>
    
                <label for="headline">Headline</label>
                <input type="text" name="headline" value="" id="headline" class="default-input">
                <div class="clear-fix"></div>
    
                <label for="bodytext" style="float:left">Body text</label>
                <textarea resizible="false" name="bodytext" value="" class="default-textarea" id="bodytext" cols="30" rows="10"></textarea>
                <div class="clear-fix"></div>
    

                <label for="keytopics">Capital Ambition?</label>
                <select name="keytopics" id="keytopics">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
                <div class="clear-fix"></div>

                <label for="category">Category</label>
                <select name="seocategoryid" id="category">
                    <option value="-1">All Selections</option>
                    % for cat in categories:
                    <option value="${cat['seocategoryid']}">${cat['seocategorydescription']}</option>
                    %endfor
                </select>
                <div class="clear-fix"></div>
            </div>

            <div class="float-right mt20 mr20">
                <button class="prmax-cardiff-btn white-cardiff-btn"><a href="/nr/e2014">Cancel</a></button>
                <button class="prmax-cardiff-btn light-cardiff-btn" type="submit" value="Submit" >Submit</button>
            </div>
        <form>
    </div>
</div>
</body>
</html>
