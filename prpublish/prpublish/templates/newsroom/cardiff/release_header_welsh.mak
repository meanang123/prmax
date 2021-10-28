<%
from datetime import date
%>

<div class="main-header-cardiff">
    <div class="top-bar-newsroom-cardiff">
        <div class="content-width">
            % if seorelease and seorelease['cardiff_release'] != None:
                <span class="menu-boxes-first">
                    <a href="https://www.cardiffnewsroom.co.uk/releases/c25/${seorelease['cardiff_release'].translatedseoreleaseid}.html">English</a>
                </span>
            %else:
                <span class="menu-boxes-first">English</span>
            %endif   
            <span class="menu-boxes"><a href="http://cardifffilmoffice.co.uk/cymraeg/" target="_blank">Ffilmio yng Nghaerdydd</a></span>
            <span class="menu-boxes-last"><a href="https://www.newyddioncaerdydd.co.uk/contacts_welsh" target="_self">Cysylltu a ni</a></span>
            <span class="menu-boxes" align="right">
                <a title="RSS" class="rss float-right" target="_blank" href="https://www.newyddioncaerdydd.co.uk/rss_welsh.xml"></a>
                <a title="LinkedIn" class="linkedin float-right" target="_blank" href="https://uk.linkedin.com/company/cardiff-county-council"></a>
                <a title="Instagram" class="instagram float-right" target="_blank" href="https://www.instagram.com/cardiff_council/"></a>
                <a title="Twitter" class="twitter float-right" target="_blank" href="https://twitter.com/cyngorcaerdydd"></a>
                <a title="Facebook" class="facebook float-right" target="_blank" href="https://www.facebook.com/cardiff.council1/"></a>
                <a title="YouTube" class="youtube float-right" target="_blank" href="http://www.youtube.com/cardiffcouncil"></a>  
            </span>
        </div>
    </div>
    <div><a href="https://www.newyddioncaerdydd.co.uk"><div class="second-top-bar-newsroom-welsh"></div></a></div>
    
    <div class="search-bar">
        <div class="content-width">
            <form action="/searchwelsh" method="post" target="_parent">
                <button class="prmax-cardiff-btn dark-cardiff-btn latest-news"><a href="/" title="Newyddion Diweddaraf"><span>Newyddion Diweddaraf</span></a></button>
                <button class="prmax-cardiff-btn dark-cardiff-btn key-topics" name='keytopics' id="keytopics"><a href="/" title="Prif Pynciau"><span>Prif Pynciau</span></a></button>
                <div class="search-menu-bar">
                    <div class="float-right">
                        <input type="text" class="default-input search" placeholder="Chwilio" name="search" id="search">
                        <button class="detailed-search prmax-cardiff-btn dark-cardiff-btn"><a href="https://www.newyddioncaerdydd.co.uk/searchmodal_welsh">Mwy</a></button>
                        <div class="menu-trigger-cardiff"> <span>Categoriau</span>
                            <div class="menu-categories">
                                <div><%include file="categories_welsh.mak"/></div>
                            </div>
                        </div>
                    </div>                
                </div>
            </form>
        </div>
    </div>     
</div>

