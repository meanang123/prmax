<%def name="create_trail(resultcount, criteria, offset, blocks=15)">
<div class="trail">
<%
  # setup number of pages
  pages = resultcount/blocks
  if resultcount > blocks and resultcount%blocks != 0:
    pages += 1

  #  get nbr of record on last page
  last_section = 0
  lsections = pages
  if offset == pages:
    last_section = resultcount%blocks

  # get start point of number sequence
  startpoint = offset
  if startpoint < 9:
    startpoint = 1

  # move sequence for more than 10 pages cope with page is end page
  if startpoint + lsections > pages and startpoint >9:
    startpoint= startpoint - 9
    if startpoint != pages:
      startpoint += 1
    lsections = 10

  # define range variables
  show_low = ((offset-1)*blocks)+1
  showing2 = offset
  if offset >1:
    showing2 -= 1
  show_high = (showing2*blocks)+last_section

  # encode url
  from urllib import urlencode
%>
 <!--<p>${offset}|${pages}|${startpoint}|${min(lsections,10)}|${lsections}</p> -->
%if pages>1:
<p class="showing">Showing ${show_low} - ${show_high} of ${resultcount}</p>
<p class="bread">
%for x in xrange(startpoint,startpoint + min(lsections,10)):
<%
  if x == offset:
    lclass = "selected"
  else:
    lclass = ""
%>
  <a class="${lclass}" href="/search_results?${urlencode(dict(o=x,s=criteria))}">Pg:${x}</a>
% endfor
%if offset >1:
  <a href="/search_results?${urlencode(dict(s=criteria,o=offset-1))}">Prev</a>
% endif
%if offset < pages:
  <a href="/search_results?${urlencode(dict(s=criteria,o=offset+1))}">Next</a>
% endif
</p>
%endif
</div>
</%def>