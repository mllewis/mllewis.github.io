// Ref_complex 34 -- COMPLEIXITY NORMING STUDY FOR GEONS
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

//array shuffle function
shuffle = function (o) { //v1.0
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
// ---------------- 2. STIMULUS SETUP ------------------
// Stimulus variables
var numPics = 12 //critical + baseline

var cond = 1;

objs = []
for (i = 0; i< 5; i++){
    order = shuffle([1, 2, 3, 4, 5, 6, 7, 8])
    num  = i + 1
    objs.push("obj" + num + "-" + order[0] + ".png")
    objs.push("obj" + num + "-" + order[1] + ".png")
}

objs = shuffle(objs)

// add baseline pictures
objs.unshift("obj_ball.jpg", "obj_circuit.jpg")

// ---------------- 3. CONTROL FLOW ------------------
// preload images
var images = new Array() // By creating image object and setting source, images preload
for (i=0;i<numPics;i++) {
    images[i] = new Image()
    images[i].src = "geons/" + objs[i]
} 

// initialize experimental variables
var num_ratings = 0;
var rating_q
var qType
var jSlider

// Get rating question
rating_q = "How complicated is this object?"
qType= 'complicated'
lAnchor = "simple"
rAnchor = "complicated"

// START experiment
showSlide("instructions");

// MAIN EXPERIMENT
var experiment = {
	
    // GET RATINGS DISPLAY FUNCTION
    get_ratings: function() {	
    	
    	if (num_ratings == numPics) {
    	
    		experiment.end();
    		
    	} else {
    	    
			// Allow experiment to start if it's a turk worker OR if it's a test run
			if (window.self == window.top | turk.workerId.length > 0) {
                
                eval('experiment.obj_'  + num_ratings + ' = "' + objs[num_ratings] + '"')
			
				rating_image_html = '<img src=geons/' + objs[num_ratings] + ' alt="' +  objs[num_ratings] + '" id="objImage"/>';
				$("#ratingimage").html(rating_image_html) 
				
				rating_question_html = '<p class="block-text" style="font-size:20px"><b>' + rating_q + '</b></p>';
				$("#ratingquestion").html(rating_question_html) 
				
				$("#leftanchor").html(lAnchor ) 
				$("#rightanchor").html(rAnchor) 
				$("#counter").html(num_ratings+1 + ' / ' + numPics) 

				thisRating = num_ratings + 1
		
				eval('experiment.rating_' + num_ratings + ' = .5')
	
				if ( num_ratings == 0 ) {
				  showSlide("complex_rating");
				  jSlider = new Slider('my-slider', {
				  	speed: 20,
					callback: function(value) {
						eval('experiment.rating_' + [num_ratings-1] + ' = ' + value)
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

        turk.submit(experiment);
        }, 500); 
    }
}