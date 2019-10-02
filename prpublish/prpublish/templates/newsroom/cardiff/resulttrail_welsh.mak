<%def name="create_trail(resultcount, criteria, offset, blocks=16)">
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
  show_high = ((showing2+1)*blocks)+last_section

  # encode url
  from urllib import urlencode
%>
%if pages>1:
<p class="bread">
%if offset >1:
  <a href="/search_results_welsh?${urlencode(dict(s=criteria,o=offset-1))}">Blaen &nbsp &nbsp</a>
% endif
%for x in xrange(startpoint,startpoint + min(lsections,10)):
<%
  if x == offset:
    lclass = "selected"
  else:
    lclass = ""
%>
  <a class="${lclass}" href="/search_results_welsh?${urlencode(dict(o=x,s=criteria))}">${x}&nbsp</a>
% endfor
%if offset < pages:
  <a href="/search_results_welsh?${urlencode(dict(s=criteria,o=offset+1))}">&nbsp &nbsp Nesaf</a>
% endif
</p>
%endif
</div>
</%def>