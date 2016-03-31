// Ref_complex #25
// Overview: (i) Helper (ii) Parameters (iii) Control Flow

// ---------------- HELPER ------------------

// show slide function
function showSlide(id) {
  $(".slide").hide(); //jquery - all elements with class of slide - hide
  $("#"+id).show(); //jquery - element with given id - show
}

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
// ---------------- PARAMETERS ------------------
var simple_pics = [3, 6, 13, 15, 19, 20, 22, 28, 29, 37, 44, 46, 54, 57, 59] //thes are correct pictures
var complicated_pics = [14, 18, 23, 25, 27, 31, 32, 33, 35, 36, 38, 43, 51, 52, 53]

simple_pics = shuffle(simple_pics)
complicated_pics = shuffle(complicated_pics)

var critImages = shuffle(simple_pics.slice(0,5).concat(complicated_pics.slice(0,5))) //shuffle all images
var current_trial = 1
			 			 
// ---------------- CONTROL FLOW ------------------
//PRE-LOAD IMAGES
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<10;i++) {
    images[i] = new Image()
    images[i].src =  "refComplex processed objects2/obj_" + critImages[i] + "_p2.jpg" 
} 

showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
  
    end: function () {
        showSlide("finished");
        setTimeout(function () {

            turk.submit(experiment);
        }, 1500); //function() - anonymous function
    },

  // MAIN DISPLAY FUNCTION
  	next: function() {
  		
    	showSlide("stage");
    	    	
	    // Create the object table (tr=table row; td= table data)
	    var objects_html = '<table align="center" cellspacing="10"><tr>'
        name = "refComplex processed objects2/obj_" + critImages[current_trial - 1] + "_p2.jpg" 
        objects_html += '<td align="center"><img  src="' + name +  '"alt="' + name +'" id="objImage"/></td>'
        objects_html += '</tr><tr>'
        objects_html += '<td align="center"><textarea  id="description" rows="1" cols="25"></textarea></td>'
        objects_html += '</tr></table>'
        $("#objects").html(objects_html) 
        
        $("#counter").html(current_trial + ' / ' + 10) 
       
	    var message_html = '<table cellspacing="2" align="center"><tr> <td id="messagesum"></td></tr></table>'
	    $("#message").html(message_html) 
  },

  // SELECT FUNCTION (called in stage slide)
    select: function () {
		if (document.getElementById("description").value.length > 0){ //  is description lenght longer than 0?
                // save data
                if (simple_pics.indexOf(critImages[current_trial-1]) != -1){
                      eval('experiment.cond_'+ current_trial + '= "simple"')
                } else {
                      eval('experiment.cond_'+ current_trial + '= "complex"')
                } 
                eval('experiment.pic_'+ current_trial + '=' + critImages[current_trial - 1])
                description = document.getElementById("description").value.replace(/(\r\n|\n|\r)/gm," ");
                description = description.replace(/"/g, "")
                eval('experiment.desc_'+ current_trial + '="' + description + '"')
                eval('experiment.descLength_'+ current_trial + '=' + document.getElementById("description").value.length + '')


                if (current_trial < 10){
                    current_trial = current_trial + 1

                    $("#objects").html("");
                    $("#stage").hide();

                    experiment.next()
                } else {
                    showSlide("check")
                }

		} else {
			$("#messagesum").html('<font color="red">Please give a name for the object!</font>');
		}
    },
    
    // called in check slide
    check_finished: function () {
    	if (document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">Please make sure you have answered all the questions!</font>');
		} else {
			experiment.about = document.getElementById("about").value;
			experiment.comment = document.getElementById("comments").value;
	
			experiment.end();
		}	
    }
}