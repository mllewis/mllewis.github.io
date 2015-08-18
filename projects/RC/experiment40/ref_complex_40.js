// ref_complex 38
// quintile geon experiment

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
// -- Objects--
// get conditions
var objConds = ["1-5", "1-5", "1-5", "1-5", "1-5","1-5"]

//Get indices
var oiA = shuffle([1,2,3,4,5,6,7,8]) 
var oiB = shuffle([1,2,3,4,5,6,7,8]) 

// deal with case where two indices are same (problematic when in control conditions because get two of same obj)
var check_duplicates = true
while (check_duplicates) {
    if (oiA[0] == oiB[0] || oiA[1] == oiB[1] || oiA[2] == oiB[2] || oiA[3] == oiB[3] || oiA[4] == oiB[4] || oiA[5] == oiB[5] || oiA[6] == oiB[6] || oiA[7] == oiB[7]){
        oiA = shuffle([1,2,3,4,5,6,7,8]) 
        oiB = shuffle([1,2,3,4,5,6,7,8])   
    } else {
        check_duplicates = false
    }
}

// -- Words--
var langConds = shuffle(["one", "one", "three", "three", "five", "five"])

// create nonce words (shuffle all syllables and then concatenate)
var syllables = ["bax", "bip", "bup", "pag", "pim",  "pum", "mig", "mog", "mup", "nad", "nid", "nop", "nur", "tib", "tob", "tud", 
             "dax", "dop", "dut", "kig", "kug", "gan", "gir", "gog", "gup"]
syllables = shuffle(syllables)

var nonceWords = []
var n = 0

for (i=0;i<6;i++) {
    if (langConds[i] == "one") {
         nonceWords[i] = syllables[n]
         n = n + 1
    } else if (langConds[i] == "three") {
        nonceWords[i] = syllables[n].substring(0,2) + syllables[n+1].substring(0,2) + syllables[n+2] 
         n = n + 3
    } else if (langConds[i] == "five"){
        nonceWords[i] = syllables[n].substring(0,2) + syllables[n+1].substring(0,2) + syllables[n+2].substring(0,2) + syllables[n+3].substring(0,2) + syllables[n+4] 
        n = n + 5
    }    
}

// global variables to keep track of
var trial = 0
var word
var langCond
var objCond
var critical_simple
var critical_complex
var critical_objects
var critical_objects_s

// ---------------- 3. CONTROL FLOW ------------------
// PRE-LOAD IMAGES
//load all the images (because it's easier, though not optimal)
var k = 0
var Images = new Array() // By creating image object and setting source, images preload
for (i=0;i<5;i++) {
    for (j=0; j<8; j++) {
        m = i + 1
        n = j + 1
        Images[k] = new Image()
        Images[k].src = "images/obj" + m + "-" + n +  ".png" 
        k = k + 1
    }
} 

showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {

    // MAIN TEST FUNCTION
   test: function() {
        if (window.self == window.top | turk.workerId.length > 0) {

            showSlide("testSlide");	
            
            // set up trial variables
            // word
            word = nonceWords[trial]
            langCond = langConds[trial]
            
            // objects
            objCond = objConds[trial]
            var objCond_i = objCond.split("-")
            critical_simple = objCond_i[0] +  "-" + oiA[trial]
            critical_complex  = objCond_i[1] + "-" + oiB[trial]
            critical_objects = [critical_simple, critical_complex]
            critical_objects_s = shuffle(critical_objects)
     
            // Instructions
            var label_html = '<p class="block-text"">  Imagine you just heard someone say <b>' + word + '</b>.'
            label_html += ' Which object do you think <b>' + word + '</b> refers to?'
            label_html += ' Choose an object by clicking the button below it.</p>'
            $("#labelInst").html(label_html) 
                
            // Create the object table
            var objects_html = '<table cellspacing="40" align="center"><tr>'
    
            for (i=0;i<2;i++){
                objects_html += '<td align="center"><img  src= "images/obj' + critical_objects_s[i] + '.png" " alt="fail" id="objImage"/><br></td>'
            }
            objects_html += '</tr><tr>'
            for (i=0;i<2;i++){
              objects_html += '<td align="center"><input type="radio" name ="thing" style="height:20px; width:20px" id="item_'+i+'"  /><br></td>'
            }
            objects_html += '</tr></table>'
            $("#objects").html(objects_html) 
            
             $("#counter").html(trial + 1 + ' / ' + 6) 
            
            // Response message
            var message_html = '<table cellspacing="2" align="center"><tr> <td id="messagesum"></td></tr></table>'
            $("#message").html(message_html) 
        }
    },
    
    // SELECT FUNCTION (called in test slide)
    select: function () {

		answer = 'NA'
        answer_value = 'NA'
		if (document.getElementById('item_0').checked || document.getElementById('item_1').checked){ //  validates bets
			var left
			var right
            var side
			
			if (document.getElementById('item_0').checked) {
				 left = 1
			} else if(document.getElementById('item_1').checked) {
				 right = 1
			}
			
            // case where not shuffled
			if (critical_objects[0] == critical_objects_s [0]){
				if (left == 1) {
					answer = critical_simple
                    answer_value = "simple"
                    side = 'left'
				} else if (right == 1) {
					answer = critical_complex
                    answer_value = "complex"
                    side = 'right'
				}
			
            // case where shuffled
			} else {
				if (left == 1) {
					answer = critical_complex
                    answer_value = "complex"
                    side = 'left'

				} else if (right == 1) {
					answer = critical_simple
                    answer_value = "simple"
                    side = 'right'
				}
			}

            // record trial and response data
			eval("experiment.response_" + trial +  "='" + answer + "'")
            eval("experiment.responseValue_" + trial +  "='" + answer_value + "'")
            eval("experiment.responseSide_" + trial + "='" + side + "'")
            eval("experiment.langCondition_" + trial + "='" + langCond+ "'")
            eval("experiment.objCondition_" + trial + "='"  + objCond + "'")
            eval("experiment.word_" + trial + "='"  + word + "'")
            eval("experiment.criticalSimple_" + trial + "='" + critical_simple + "'")
            eval("experiment.criticalComplicated_" + trial + "='"  + critical_complex + "'")

            trial = trial + 1
	        
            if (trial < 6) {
                experiment.test()
            } else { 
			     showSlide("check")
            }

		} else {
			$("#messagesum").html('<font color="red">Please select an object!</font>');
		}
    },


   // FINISHED BUTTON CHECKS EVERYTHING AND THEN ENDS
    check_finished: function() {
		if (document.getElementById('about').value.length < 1) {
			$("#checkMessage").html('<font color="red">' + 
					   'Please make sure you have answered all the questions!</font>');
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
        }, 
        500); 
    }
}