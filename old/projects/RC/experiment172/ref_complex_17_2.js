// ref_complex_17_2
// Simulateneous frequency
// iterations of refComplex 6 (replication v2)
// uneven frequency conditions only


// ---------------- 1. HELPER ------------------
// random function
function random(a,b) {
    if (typeof b == "undefined") {
	a = a || 2;
	return Math.floor(Math.random()*a);
    } else {
	return Math.floor(Math.random()*(b-a+1)) + a;
    }
}

// unique function
function unique(arrayName){
    var newArray=new Array();
    label:for(var i=0; i<arrayName.length;i++ )
    {  
	for(var j=0; j<newArray.length;j++ )
	{
	    if(newArray[j]==arrayName[i]) 
		continue label;
	}
	newArray[newArray.length] = arrayName[i];
    }
    return newArray;
}

// shuffle function
function shuffle (a) { 
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


// ---------------- 2. STIMULUS SETUP ------------------
// Condition - call the maker getter to get the cond variable 
var filename = "MLL_refComplex17_2"
var condCounts = "1,50;2,50"
var xmlHttp = null;
xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", "https://langcog.stanford.edu/cgi-bin/subject_equalizer/maker_getter.php?conds=" + 
	      condCounts +"&filename=" + filename, false );
xmlHttp.send( null );
var cond = xmlHttp.responseText;
//var cond = random(1,6) 
//var cond = 2
var lang
var condType
var fam_objects_html

// Get factor levels
if (cond == 1) {
	lang = 'short'
   	condType = 'RC6_replication'
   	imgFileType = ".png"
} else if (cond == 2) {
	lang = 'long'
   	condType = 'RC6_replication'
   	imgFileType = ".png"
} 

// --Images--
var fam_dists = [[1, 2, 2, 2, 2, 2, 2, 2, 2, 2],
		 		[1, 1, 1, 1, 1, 2, 2, 2, 2, 2]]
var target_frequencies = [.1, .5];
var num_fam = 10; 

myFamDist = fam_dists[0] 
myFrequency = target_frequencies[0]

if (condType == 'RC6_realStim') {
	var images = ['r_3', 'r_6', 'r_13', 'r_15', 'r_19', 'r_20', 'r_22', 'r_28', 'r_29', 'r_37', 'r_44', 'r_46', 'r_54', 'r_57', 'r_59']
} else {
	var images = ['s_1', 's_2', 's_3', 's_4', 's_5', 's_6', 's_7', 's_8']
}
	
images_all = shuffle(images)
var critImages = []
critImages[0]= images_all[0]
critImages[1]= images_all[1]

var famImages = []
for  (i=0;i<num_fam;i++) {
	if (myFamDist[i] == 1){
		famImages[i] = critImages[0]
	} else {
		famImages[i] = critImages[1]
	}
}
famImages = shuffle(famImages)

// --Language--
if (lang == "short") {
	var nonceWords = [ "tupa", "gabu", "fepo", "paku", "mipa", "kiba", "tibu"]
} else {
	var nonceWords = [ "tupabugorn", "gaburatum", "fepolopus", "pakuwugnum", "mipatorun", "kibagronan", "tiburalex"]
}

nonceWords = shuffle(nonceWords)
var critical_word = nonceWords[0]

var fam_clicked = new Array();
var fam_finished;
var mainNum = 0;
var images
var images_s


// ---------------- 3. CONTROL FLOW ------------------
// PRE-LOAD IMAGES
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<2;i++) {
    images[i] = new Image()
    images[i].src = "images/" + critImages[i] + imgFileType
} 
images[3] = new Image()
images[3].src = "images/guy.jpg"
images[4] = new Image()
images[4].src = "images/sally.jpg"

showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
     // stimulus variables - bookkeeping, send these to turk
	cond: condType,
	lang_condition: lang,
	obj_low: critImages[0], //t and d are named in terms of frequencies
	obj_high: critImages[1],
	crit_word: critical_word,
	crit_response: '' ,
	about: "",
    comment: "",
    dist_check_correct: "FALSE",

  
    // FAMILIARIZATION DISPLAY FUNCTION
    next_familiarization: function() {
        // Allow experiment to start if it's a turk worker OR if it's a test run
		if (window.self == window.top | turk.workerId.length > 0) {
		
			// FAMILIARIZATION INSTRUCTIONS
			if (condType == 'RC6_noCover') {
				var familiarization_html = '<p class="block-text"">Click the question marks below to see 10 objects.</p>'
				var cover_html = ''
			} else {
				var familiarization_html = '<p class="block-text"">Bob just took 10 objects out of his box. Click the question marks below to see each of his objects.</p>'
				var cover_html = '<p class="block-text">Meet Bob:<img src="images/guy.jpg" width=75px alt="Bob"></p><p class="block-text">Bob has a box:<img src="images/box.png" width=75px alt="Bob"></p>'
			}
				
			$("#familiarizationText").html(familiarization_html) 
			$("#cover").html(cover_html) 
	
			
			// DAY BY DAY POPUPS FOR FAMILIARIZATION
			fam_objects_html = '<table align="center"><tr>'
	
			for (i=0;i<=num_fam-1;i++){
				fam_objects_html += '<td width=100px height=110px align="center" ' +
					'class="objTable"' + 
					'id="famTable' + String(i) + 
					'" onclick="experiment.reveal(' + String(i) + ')">'
				fam_objects_html += '?<div id="day'+ String(i) + '"> </div>'
				
				if ((i+1)%5 == 0) {
					fam_objects_html += "</tr><tr>"
				}
			}
			
			fam_objects_html += '</tr></table>'
			$("#famObjects").html(fam_objects_html) 
		
			showSlide("prestage");	
	
		}
    },

    // MAIN DISPLAY FUNCTION
    next_test: function() {

    	showSlide("stage");	
    	    	
    	var word
		if (mainNum == 0) {
			word = critical_word
			images = critImages;
		} 

    	var label_html = ''
    	if (mainNum == 0) {
    	    label_html +='<p class="block-text">Meet Sally:</p> <p class="block-text"> <img src="images/sally.jpg" width=75px alt="sally"></p>'
    	}  
    	label_html += '<p class="block-text"">  Imagine you just heard Sally say <b>' + word + '</b>.'
    	label_html += ' Which object do you think she is referring to?'
    	label_html += ' Choose an object by clicking the button below it.</p>'
    	 $("#labelInst").html(label_html) 
    	   	
	    // Create the object table (tr=table row; td= table data)
	    images_s = images
	    images_s = shuffle(images_s)
	    var objects_html = '<table id="responsetable" align="center"><tr>'

		for (i=0;i<2;i++){
		  name = images_s[i] +  imgFileType
			if (condType == 'RC6_realStim') {
			  objects_html += '<td align="center"><img  src="images/'+ name +'" alt="' + name +'" id="objImage2"/><br></td>'
			} else {
			  objects_html += '<td align="center"><img  src="images/'+ name +'" alt="' + name +'" id="objImage"/><br></td>'
			}
		}
		
		objects_html += '</tr><tr>'
		for (i=0;i<2;i++){
		  objects_html += '<td align="center"><input type="radio" name ="thing" id="item_'+i+'"  /><br></td>'
		}
		objects_html += '</tr></table>'
	
		$("#objects").html(objects_html) //jquery - $find the object in the DOM with the id of object, 
		
		var message_html = '<table cellspacing="2" align="center"><tr> <td id="messagesum"></td></tr></table>'
		$("#message").html(message_html) 

    },

    // REVEAL IMAGES IN FAMILIARIZATION
    reveal: function(n) {

		fam_objects_html='<td width=100px height=110px align="center" ' +
		    'class="objTable"' + 
		    'id="famTable' + String(n) + '">'
		
		fam_objects_html += '<div id="day'+ String(n) + '"> </div>'
   	    $("#famTable"+ String(n)).html(fam_objects_html) 
		
		if (condType == 'RC6_realStim') {
			day_html = '<img src="images/' + famImages[n] + imgFileType + '" width=100px height=100px alt="' +  famImages[n] + '" id="objImage2"/>';
		} else {
			day_html = '<img src="images/' + famImages[n] + imgFileType + '" width=100px height=100px alt="' +  famImages[n] + '" id="objImage"/>';
		}
		
		$("#day" + String(n)).html(day_html) 
		fam_clicked = unique(fam_clicked.concat(n))
		
		if (fam_clicked.length == num_fam) {
			fam_finished = 1
		}
    },

    // CHECK THAT FAMILIARIZARION IS DONE
    check_fam: function() {
		if (fam_finished == 1) {
			//famNextButton.blur(); 
			experiment.next_test();
	
		} else {
			$("#famMessage").html('<font color="red">' + 
					   'Please make sure you have looked at all the objects!</font>');
		}
    },
    
    // SELECT FUNCTION (called in stage slide)
    select: function () {

		answer = 'NA'
		if (document.getElementById('item_0').checked || document.getElementById('item_1').checked){ //  validates bets
			mainNum = mainNum + 1
			var left
			var right
			
			if (document.getElementById('item_0').checked) {
				 left = 1
			} else if(document.getElementById('item_1').checked) {
				 right = 1
			}
			
			if (images[0] == images_s[0]){
				if (left == 1) {
					answer = 'low_freq'
				} else if (right == 1) {
					answer = 'high_freq'
				}
			
			} else {
				if (left == 1) {
					answer = 'high_freq'
				} else if (right == 1) {
					answer = 'low_freq'
				}
			}


			experiment.crit_response = answer
	
			// Clear the images and buttons
					document.getElementById('item_0').checked = false;
					document.getElementById('item_1').checked = false;
					 $("#objects").html("");
					 $("#stage").hide();
				
				if (condType == 'RC6_noCover') {
					checkQ_html = '<table class="centered"><tr> <td> (1) Which type of object did you see more often? </td> </tr> </table>'
				} else {
					checkQ_html = '<table class="centered"><tr> <td> (1) Bob\'s box had more of which type of object? </td> </tr> </table>'
				}
				$("#checkQ").html(checkQ_html) 

				var checkObjects_html = '<table class="centered"><tr>'
				for (i=0;i<2;i++){
					if (condType == 'RC6_realStim') {
					  checkObjects_html += '<td style="text-align: center; width: 5%"><img  src="images/' + critImages[i] + imgFileType + '"id="objImage2"/><br></td>'
					} else {
					  checkObjects_html += '<td style="text-align: center; width: 5%"><img  src="images/' + critImages[i] + imgFileType + '"id="objImage"/><br></td>'
					}
				}
				checkObjects_html += '<td style="text-align: center; width: 5%">Both equally often. <br></td></tr><tr>'
				for (i=0;i<3;i++) {
					checkObjects_html += '<td style="text-align: center;"><input type="radio" name ="q1" id="check_'+i+'"  /><br></td>'
				}
				checkObjects_html += '</tr></table>'
				$("#checkObjects").html(checkObjects_html) //jquery - $find the object in the DOM with the id of object
					 
	
			showSlide("check");	

		} else {
			$("#messagesum").html('<font color="red">Please select an object!</font>');
		}
	
},


   // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (($("input[type=radio]:checked").length == 0) ||
			document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">' + 
					   'Please make sure you have answered all the questions!</font>');
		} else {
			if (document.getElementById('check_1').checked) {
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