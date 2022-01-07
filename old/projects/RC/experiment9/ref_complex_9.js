// Ref_complex 9 -- COMPLEIXITY NORMING STUDY
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

// ---------------- 2. STIMULUS SETUP ------------------
// Stimulus variables
var numPics = 12 //critical + baseline
var totalPics = 60

// Condition - call the maker getter to get the cond variable 
//var filename = "MLL_refComplex9_9"
//var condCounts = "1,50;2,50"
//var xmlHttp = null;
//xmlHttp = new XMLHttpRequest();
//xmlHttp.open( "GET", "http://langcog.stanford.edu/cgi-bin/subject_equalizer/maker_getter.php?conds=" + 
//	      condCounts +"&filename=" + filename, false );
//xmlHttp.send( null );
//var cond = xmlHttp.responseText;
var cond = 1;

// get set of random images for particular subject
var ratingImagesNum = []
while(ratingImagesNum.length < numPics){
  var randomnumber=Math.ceil(Math.random()*totalPics)
  var found=false;
  for(var i=0;i<ratingImagesNum.length;i++){
    if(ratingImagesNum[i]==randomnumber){found=true;break}
  }
  if(!found)ratingImagesNum[ratingImagesNum.length]=randomnumber;
}

// add baseline pictures
ratingImagesNum.unshift("ball", "circuit")

// ---------------- 3. CONTROL FLOW ------------------
// preload images
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<numPics;i++) {
    images[i] = new Image()
    images[i].src = "refComplex processed objects2/obj_" + ratingImagesNum[i] + "_p2.jpg" 
} 

// initialize experimental variables
var num_ratings = 0;
var rating_q
var qType
var jSlider

// Get rating question
if (cond == 1) {
	rating_q = "How complicated is this object?"
	qType= 'complicated'
	lAnchor = "simple"
	rAnchor = "complicated"
} else if (cond == 2) {
	rating_q = "How unexpected is this object?"
	qType = 'unexpected'
	lAnchor = "expected"
	rAnchor = "unexpected"
}

// START experiment
showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
     // variables sent to turk (question type + ratings)
	questionType: qType,
	
    // GET RATINGS DISPLAY FUNCTION
    get_ratings: function() {	
    	
    	if (num_ratings == numPics) {
    	
    		experiment.end();
    		
    	} else {
    	    
			// Allow experiment to start if it's a turk worker OR if it's a test run
			if (window.self == window.top | turk.workerId.length > 0) {
			
				rating_image_html = '<img src="refComplex processed objects2/obj_' + ratingImagesNum[num_ratings] +'_p2.jpg" alt="' +  ratingImagesNum[num_ratings] + '" id="objImage"/>';
				$("#ratingimage").html(rating_image_html) 
				
				rating_question_html = '<p class="block-text" style="font-size:20px"><b>' + rating_q + '</b></p>';
				$("#ratingquestion").html(rating_question_html) 
				
				$("#leftanchor").html(lAnchor ) 
				$("#rightanchor").html(rAnchor) 
				$("#counter").html(num_ratings+1 + ' / ' + numPics) 

				thisRating = num_ratings + 1
		
				eval('experiment.rating' + ratingImagesNum[num_ratings] + ' = .5');
		
				if ( num_ratings == 0 ) {
				  showSlide("complex_rating");
				  jSlider = new Slider('my-slider', {
				  	speed: 20,
					callback: function(value) {
						eval('experiment.rating' + ratingImagesNum[num_ratings-1] + ' = ' + value)
					}
				  });
				}
				
				jSlider.setValue(.5);
				num_ratings = num_ratings + 1
					
			}
		}
    },

    // END FUNCTION 
    end: function () {
    
        showSlide("finished");
        setTimeout(function () {

			// Decrement only if this is an actual turk worker!		
			//if (turk.workerId.length > 0){
			//	var xmlHttp = null;
			//	xmlHttp = new XMLHttpRequest();
			//	xmlHttp.open('GET',			 
			//			 'http://langcog.stanford.edu/cgi-bin/' + 
			//			 'subject_equalizer/decrementer.php?filename=' + 
			//		 filename + "&to_decrement=" + cond, false);
			//	xmlHttp.send(null);
			//}

            turk.submit(experiment);
        }, 500); 
    }
}