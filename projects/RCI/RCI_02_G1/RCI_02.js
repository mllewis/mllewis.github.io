// RCI_02 -- referential complexity memory errors
// Overview: 
//      (1) Helper
//      (2) Parameters and Stimulus Setup 
//      (3) Control Flow


// ---------------- 1. HELPER ------------------
// show slide function
function showSlide(id) {
    $(".slide").hide(); //jquery - all elements with class of slide - hide
    $("#"+id).show(); //jquery - element with given id - show
}

// shuffle function
function shuffle (a) { 
    var o = [];
    for ( var i=0; i < a.length; i++) { o[i] = a[i]; }
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), 
	 x = o[--i], o[i] = o[j], o[j] = x); 
    return o;
}

function contains(b, obj) {
    for (var i = 0; i < b.length; i++) {
        if (b[i] === obj) {
            return true;
        }
    }
    return false;
}

// create 2d array
function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

// ---------------- 2. STIMULUS SETUP ------------------
// Stimulus variables
var numPics = 10 
var totalPics = 60
var num_repetitions =  4

// -- Images--
// quintiles based on complicated norms
var q_one = shuffle([54, 57, 19, 28, 3, 59, 20, 46, 44, 13, 15, 29])
var q_two = shuffle([22, 6, 17, 5, 34, 2, 55, 9, 4,  49, 37, 10])
var q_three = shuffle([12, 50, 7,  8, 48, 16, 1, 39, 40, 56, 24, 60])
var q_four = shuffle([26, 18, 11, 47, 42, 30, 23, 31, 51, 58, 41, 45])
var q_five = shuffle([32, 43, 33, 25, 21, 52, 14, 53, 27, 36, 38, 35])

var obj_q = Create2DArray(5);

for (i=0;i<5;i++){
	for (j=0; j<12; j++) {
		if (i == 0) {obj_q[i][j] = q_one[j]} 
		else if (i == 1)  {obj_q[i][j] = q_two[j]} 
		else if (i == 2)  {obj_q[i][j] = q_three[j]} 
		else if (i == 3)  {obj_q[i][j] = q_four[j]} 
		else if (i == 4)  {obj_q[i][j] = q_five[j]} 
	}
}

var is = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
var q_is = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4,]
var obj_is = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]			

var ratingImagesNum = []
for (i=0;i<10; i++) {
	ratingImagesNum[i] = obj_q[q_is[is[i]]][obj_is[is[i]]]
}

// -- Words--
var langConds = shuffle(["one", "one", "two", "two", "three", "three", "four", "four", "five", "five"])

// create nonce words (shuffle all syllables and then concatenate)
var syllables = ["bax", "bip", "bup", "pag", "pim",  "pum", "mig", "mog", "mup", "nad", "nid", "nop", "nur", "tib", "tob", "tud",  "dax", "dop", "dut", "kig", "kug", "gan", "gir", "gog", "gup"]

var nonceWords = []
var duplicate = true

for (i=0;i<numPics;i++) {
    syllables = shuffle(syllables)
    while (duplicate) {
        if (langConds[i] == "one") {
             new_word = syllables[0]
        } else if (langConds[i] == "two") {
             new_word = syllables[0].substring(0,2) + syllables[1] 
        } else if (langConds[i] == "three") {
            new_word = syllables[0].substring(0,2) + syllables[1].substring(0,2) + syllables[2]
        } else if (langConds[i] == "four") {
            new_word= syllables[0].substring(0,2) + syllables[1].substring(0,2) + 
                syllables[2].substring(0,2) + syllables[3] 
        } else if (langConds[i] == "five"){
            new_word = syllables[0].substring(0,2) + syllables[1].substring(0,2) + 
                syllables[2].substring(0,2) + syllables[3].substring(0,2) + syllables[4] 
        }  
        duplicate = contains(nonceWords, new_word)
    }
    nonceWords[i] = new_word  
    
    duplicate = true
}

// ---------------- 3. CONTROL FLOW ------------------
// preload images
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<ratingImagesNum.length;i++) {
    images[i] = new Image()
    var num = i+1
    images[i].src = "real_novel_objects/obj_" + ratingImagesNum[i] + ".jpg"   
}

// initialize experimental variables
var num_ratings = 0
var current_repetition = 0
var current_training_is = [0, 1, 2, 3, 4, 5, 6, 7, 8 ,9]

// START experiment
showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
	
    // TRAINING PICTURES
    training: function() {	
		
		// reset if new repetition
        if (num_ratings == numPics) {
                num_ratings = 0
                current_repetition = current_repetition + 1
				current_training_is = shuffle(current_training_is)
        }
		
        // Allow experiment to start if it's a turk worker OR if it's a test run
        if (window.self == window.top | turk.workerId.length > 0) {
            rating_image_html = '<img src="real_novel_objects/obj_' + ratingImagesNum[current_training_is[num_ratings]]
            rating_image_html += '.jpg" alt="' + ratingImagesNum[current_training_is[num_ratings]] + '" id="objImage"/>'
            $("#ratingimage").html(rating_image_html)

            $("#label").html('<font size="20" face = "Arial">' + 
							 nonceWords[current_training_is[num_ratings]] + '</font>')               
            $("#counter").html((numPics*current_repetition)+num_ratings + 1 + ' / ' + num_repetitions*numPics) 
			
			// save information about object and label
			if (current_repetition == 0) {
			 eval('experiment.obj_' + num_ratings + "$index=" +  "'" + 
				  ratingImagesNum[current_training_is[num_ratings]]  +  "'")
			 eval('experiment.obj_' + num_ratings + "$label=" +  "'" + 
				  nonceWords[current_training_is[num_ratings]] +   "'")
			 eval('experiment.obj_' + num_ratings + "$labelLen=" +  "'" + langConds[num_ratings]   +  "'")
			
			 var current_quintile = q_is[is[num_ratings]] + 1 //add one (zero indexed for array above)
			 eval('experiment.obj_' + num_ratings + "$quintile=" + "'" + current_quintile +  "'")
			}

            experiment.getRT()
            
            if (num_ratings == 0 ) {
              showSlide("train");
            }     
        }
    },
    
    getRT: function(){
        var startTime = (new Date()).getTime()
        $(document).keydown(function(event) {
            var keyCode = event.which
            if (keyCode == 32) {
				
                $(document).unbind("keydown")
                var endTime = (new Date()).getTime()
                var rt = endTime-startTime
    
                eval('experiment.obj_' + num_ratings + "$RT" + current_repetition + "=" + rt)
				
                num_ratings = num_ratings + 1
                if ((current_repetition*numPics)+num_ratings == (num_repetitions*numPics)){
                    showSlide("test_inst")
                    num_ratings = 0
                } else {
                   experiment.training()
                }
            }
        })
    },

    // TESTING PICTURES
    testing: function(){
        showSlide("test")
        
	    // Create the object table (tr=table row; td= table data)
	    var objects_html = '<table align="center" cellspacing="10"><tr>'
        name = 'real_novel_objects/obj_' + ratingImagesNum[num_ratings] + '.jpg'
        objects_html += '<td align="center"><img  src="' + name +  '"alt="' + name +'" id="objImage"/></td>'
        objects_html += '</tr><tr>'
        objects_html += '<td align="center"><input type = "text" style="font-size:20pt" style="font-family:arial" id="guessed_name" rows="1" cols="30"></input></td>' 

        objects_html += '</tr></table>'
        $("#objects").html(objects_html) 
        
        $("#counter2").html(num_ratings + 1 + ' / ' + numPics) 
       
	    var message_html = '<table cellspacing="2" align="center"><tr> <td id="messagesum"></td></tr></table>'
	    $("#message").html(message_html) 
    },
    
    
  // SELECT FUNCTION (called in stage slide)
    test_check: function () {
		if (document.getElementById("guessed_name").value.length > 0){ //  is description lengther longer than 0?
                
			// save data
                description = document.getElementById("guessed_name").value.replace(/(\r\n|\n|\r)/gm," ");
                eval('experiment.obj_'+ num_ratings + '$guessedLabel="' + description + '"')
	            eval('experiment.obj_'+ num_ratings + '$guessedLabelLen=' + 
                     document.getElementById("guessed_name").value.length + '')

                if (num_ratings + 1 < numPics){
                    num_ratings = num_ratings + 1

                    $("#objects").html("");
                    $("#stage").hide();

                    experiment.testing()
                } else {
                    showSlide("check")
                }

		} else {
			$("#messagesum").html('<font color="red">Please type the name of the object.</font>');
		}
    },
    
    // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">Please make sure you have answered all the questions!</font>');

		} else {
			experiment.about = document.getElementById("about").value;
			experiment.comment = document.getElementById("comments").value;
			experiment.end();
		}
    },

    // END FUNCTION 
    end: function () {
        showSlide("finished");
        setTimeout(function () {
            turk.submit(experiment);
        }, 500) 
    }
}