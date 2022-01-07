// this file keeps track of the index of projects on the left side of the page
// after adding a new project to the directory must add 2 lines to update the index (top and bottom paths)

$(document).ready(function(){

	var index_top_html = " <li> <a  href='projects/xtSamp/xtSampindex.html'> Lewis and Frank (in press) </a></li>"
	index_top_html += " <li> <a  href='projects/RC/RCindex.html'> Lewis and Frank (2016) </a></li>"
	index_top_html += " <li> <a href='projects/tablet/tablet_index.html'> Frank et al. (2016) </a></li>"
	index_top_html += " <li> <a href='projects/RCI/RCI_index.html'> Lewis and Frank (2015) </a></li>"

	$("#index_top").html(index_top_html) 
	var index_bottom_html = " <li> <a  href='../xtSamp/xtSampindex.html'> Lewis and Frank (in press) </a></li>"
	index_bottom_html += " <li> <a  href='../RC/RCindex.html'> Lewis and Frank (2016) </a></li>"
	index_bottom_html += " <li> <a href='../tablet/tablet_index.html'> Frank et al. (2016) </a></li>"
	index_bottom_html += " <li> <a href='../RCI/RCI_index.html'> Lewis and Frank (2015) </a></li>"

	$("#index_bottom").html(index_bottom_html) 
})
