// Ref_complex 16
// Sequential frequency
// Overview: 
//      (1) Helper
//      (2) Parameters and Stimulus Setup 
//      (3) Control Flow

// ---------------- 1. HELPER ------------------
// shuffle function
function shuffle (a) 
{ 
    var o = [];
    for ( var i=0; i < a.length; i++) { o[i] = a[i]; }
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), 
	 x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// show slide function
function showSlide(id) {
    $(".slide").hide(); //jquery - all elements with class of slide - hide
    $("#"+id).show(); //jquery - element with given id - show
}

getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function progress(counter, $element) {
	var percent = (counter/totalNumPics) * 100
    var progressBarWidth = percent * $element.width() / 100;
    $element.find('div').animate({ width: progressBarWidth }, 500).html("&nbsp");
}


// ---------------- 2. STIMULUS SETUP ------------------
// Condition - call the maker getter to get the cond variable 
var filename = "MLL_refComplex16_1"
var condCounts = "1,50;2,50;3,50;4,50"
var xmlHttp = null;
xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/subject_equalizer/maker_getter.php?conds=" + 
	      condCounts +"&filename=" + filename, false );
xmlHttp.send( null );
var cond = xmlHttp.responseText;

var dist;
var distRatio;
var lang;
var nonceWords;
var condName;
var nonceWords;

var pauseTime = 750;

// Get factor levels
if (cond == 1) {
	dist = 'uneven';
	distRatio = 0.2;
	lang = 'short';
	nonceWords = ["tupa", "gabu", "fepo", "paku", "mipa", "kiba", "tibu", "bapi"];
   	condName = 'uneven_short';
} else if (cond == 2) {
	dist = 'uneven';
	distRatio = 0.2;
	lang = 'long';
	nonceWords = ["tupabugorn", "gaburatum", "fepolopus", "pakuwugnum", "mipatorun", "kibagronan", "tiburalex", "bapidokum"];
   	condName =  'uneven_long';
} else if (cond == 3) {
	dist = 'even';
	distRatio = 0.5;
	lang = 'short'
	nonceWords = ["tupa", "gabu", "fepo", "paku", "mipa", "kiba", "tibu", "bapi"];
   	condName = 'even_short';
} else if (cond == 4) {
	dist = 'even';
	distRatio = 0.5;
	lang = 'long';
	nonceWords = ["tupabugorn", "gaburatum", "fepolopus", "pakuwugnum", "mipatorun", "kibagronan", "tiburalex", "bapidokum"];
   	condName ='even_long';
}

var totalNumCritPics = 50; 
var totalNumPics = 60;

//simple image array from Exp. 15
var images_all = [3, 6, 13, 15, 19, 20, 22, 28, 29, 37, 44, 46, 54, 57];

//Critical images always picked in pairs (3 with 6, 13 with 15, etc)
var critPick = getRandomInt(0, images_all.length - 1);
if (critPick % 2 === 0) {
	var critImages = images_all.splice(critPick, 2);
} else {
	var critImages = images_all.splice(critPick-1, 2);
}
critImages = shuffle(critImages);

images_all = shuffle(images_all);
var fillerImages = images_all.splice(0, 10);
var allShownImages = [];

//critImages[0] always less (or equally) frequent object
for (i = 0; i < (totalNumCritPics * distRatio); i++) {	
	allShownImages.push(critImages[0]);
}
for (i = 0; i < (totalNumCritPics * (1 - distRatio)); i++) {
	allShownImages.push(critImages[1]);
}
allShownImages = allShownImages.concat(fillerImages);
allShownImages = shuffle(allShownImages);

var critical_word = nonceWords[getRandomInt(0, nonceWords.length - 1)];
var pic_choices = shuffle(critImages);

// ---------------- 3. CONTROL FLOW ------------------

/*
// PRE-LOAD IMAGES
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<2;i++) {
    images[i] = new Image()
    images[i].src = "images/" + critImages[i] + ".png" 
} 
*/

showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
     // stimulus variables - bookkeeping, send these to turk
	cond: condName,
	lang_condition: lang,
	frequency_condition:  dist,
	crit_less_freq: critImages[0], 
	crit_more_freq: critImages[1],
	crit_word: critical_word,
	crit_selection: '',
	dist_check_correct: 'FALSE',
	about: "",
    comment: "",

    // REVEAL IMAGES IN FAMILIARIZATION
    reveal: function() {
		if (window.self == window.top | turk.workerId.length > 0) {

			showSlide("prestage");
			$("#progressBar").hide();
			var objects_html = "";
			var objectName = "";

			objectName = "images/question.jpg";
			objects_html = '<img class="picdisplay" src="' + objectName + '" alt=' + objectName + '" + id="shownPic">';
			$("#presentObject").html(objects_html); 		

			var counter = 0;

			progress(counter, $("#progressBar"));
			$("#progressBar").show();
			//Handles clicking. Disable clicks if they co-occur with an object rather than a question mark. 
			var clickDisabled = false;
			$("#shownPic").click(function() {
				if (clickDisabled) return;
				document.getElementById("shownPic").src = "images/obj_" + allShownImages[counter] + "_p2.jpg";
				counter++;

				//update progress bar
				progress(counter, $("#progressBar"));

				setTimeout(function() {
					$("#shownPic").fadeOut("slow", function() {
						if (counter === totalNumPics) {
							experiment.next_test();
						}
						document.getElementById("shownPic").src = "images/question.jpg";
						$("#shownPic").show();
					});
				}, pauseTime);	
				clickDisabled = true;
				//click disabled for picture duration and fadeOut time
				setTimeout(function() {clickDisabled = false;}, pauseTime + 600);
			});
		} 
    },

    // TEST FUNCTION
    next_test: function() {


    	showSlide("stage");	

		var label_html = '<p class="block-text"">  Imagine you just heard someone say <b>' + critical_word + '</b>.'
    	label_html += ' Which object do you think <b>' + critical_word + '</b> refers to?'
    	label_html += ' Choose an object by clicking the button below it.</p>'
    	$("#labelInst").html(label_html);
    	   	
	    // Create the object table (tr=table row; td= table data)
	    
	    var objects_html = '<table id="critTable"><tr>'
		for (i=0;i<2;i++){
		  name = "obj_" + pic_choices[i] + "_p2.jpg" 
		  objects_html += '<td style="text-align: center;"><img  src="images/'+ name +'" class="objImage"/></td>'
		}
		
		objects_html += '</tr><tr>'
		for (i=0;i<2;i++) {
		  objects_html += '<td style="text-align: center;"><input type="radio" name ="thing" id="item_'+i+'"  /><br></td>'
		}

		objects_html += '</tr></table>'
		$("#objects").html(objects_html) //jquery - $find the object in the DOM with the id of object, 
		
		var message_html = '<table cellspacing="2" align="center"><tr> <td id="messagesum"></td></tr></table>'
		$("#message").html(message_html) 

    },
    
    // SELECT FUNCTION (called in stage slide - test slide)
    select: function () {

    	//crit_selection defaults to low frequency
		var answer = 'lf'
		if (document.getElementById('item_0').checked || document.getElementById('item_1').checked) { //  validates bets
			var choice;
			
			if (document.getElementById('item_0').checked) {
				 choice = "L";
			} else if(document.getElementById('item_1').checked) {
				 choice = "R";
			}

			//critImage[0] is less frequent
			if (cond == 1 || cond == 2) {
				//if critImage[0] is on the left
				if (pic_choices[0] === critImages[0]) {
					if (choice === "R") {
						answer = 'hf';
					}			
				} else {
					if (choice === "L") {
						answer = 'hf';
					}
				}
			}

			//log answer for MTurk
			experiment.crit_selection = answer;

			// Clear the images and buttons
			document.getElementById('item_0').checked = false;
			document.getElementById('item_1').checked = false;
			$("#objects").html("");
			$("#stage").hide();
			
			showSlide("check");
			
			// Question 1
			var checkObjects_html = '<table class="centered"><tr>'
			for (i=0;i<2;i++){
			  checkObjects_html += '<td style="text-align: center; width: 33%"><img  src="images/obj_' + critImages[i] + '_p2.jpg" class="objImage"/><br></td>'
			}
		 	checkObjects_html += '<td style="text-align: center; width: 33%">Both equally often. <br></td></tr><tr>'
			for (i=0;i<3;i++) {
				checkObjects_html += '<td style="text-align: center;"><input type="radio" name ="q1" id="check_'+i+'"  /><br></td>'
			}
			checkObjects_html += '</tr></table>'
			$("#checkObjects").html(checkObjects_html) //jquery - $find the object in the DOM with the id of object
			
		} else {
			$("#messagesum").html('<font color="red">Please select an object!</font>');
		}
	
	},

   // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (($("input[type=radio]:checked").length < 1) ||
			document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">Please make sure you have answered all the questions!</font>');
		} else {
			//the more frequent object will always be presented on the right
			if (dist == 'uneven' && document.getElementById('check_1').checked) {
				experiment.dist_check_correct = "TRUE";
			} else if (dist == 'even' &&  document.getElementById('check_2').checked) {
				experiment.dist_check_correct = "TRUE";
			}
			experiment.about = document.getElementById("about").value;
			experiment.comment = document.getElementById("comments").value;
	
			experiment.end();
		}
    },

    // END FUNCTION 
    end: function () {
    
        showSlide("finished");
        setTimeout(function () {

			// Decrement only if this is an actual turk worker!		
			if (turk.workerId.length > 0){
				var xmlHttp = null;
				xmlHttp = new XMLHttpRequest();
				xmlHttp.open('GET',			 
						 'https://langcog.stanford.edu/cgi-bin/' + 
						 'subject_equalizer/decrementer.php?filename=' + 
						 filename + "&to_decrement=" + cond, false);
				xmlHttp.send(null);
			}

            turk.submit(experiment);
        }, 500); 
    }
}