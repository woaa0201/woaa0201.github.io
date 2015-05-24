var lastsite = "";
var expand = 0;

function opensite(site) {

	expand = 50;

	if (site != lastsite) {
	document.getElementById("websitedata").setAttribute('data', site);
	lastsite = site;
	}
	
	$('.website').animate({
		left: '0px'
	}, {duration: 200, queue: false});
            
    $('body').animate({
        left: '50%',
        width: '50%'
    }, {duration: 200, queue: false});
    
    $('#menu').hide();
    $('.dropdown-menu').hide();
}

var main = function() {

	document.addEventListener("touchstart", function(){}, true);
	$('.website-condense').hide();
	$('.dropdown-menu').hide();
	
	$('.dropdown-toggle').click(function() {
    	$('.dropdown-menu').toggle();
  	});
	
    $('.desmos-menu').click(function() {
        opensite('desmos.html');
    });
    
    $('.geogebra-menu').click(function() {
		opensite('http://web.geogebra.org/app/');
    });
    
    $('.sage-menu').click(function() {
		opensite('https://cloud.sagemath.com/projects');
    });
    
    $('.website-close').click(function() {
        if (expand = 50) {
        $('.website').animate({
            left: '-50%'
            }, {duration: 200, queue: false});
            
        $('body').animate({
            left: '0px',
            width: '100%'
            }, {duration: 200, queue: false});
        }
        
        if (expand = 100) {
        $('.website').animate({
            left: '-50%',
            width: '50%'
            }, {duration: 200, queue: false});
            
        $('body').animate({
            left: '0px',
            width: '100%'
            }, {duration: 200, queue: false});
        }
        
        $('#menu').delay(200).show(0);
        $('.dropdown-menu').hide();
        $('.website-expand').delay(200).show(0);
        $('.website-condense').hide();
    });
    
    $('.website-expand').click(function() {
        
        expand = 100;
        
        $('.website').animate({
            width: '100%'
            }, {duration: 200, queue: false});
            
        $('body').animate({
            left: '100%',
            }, {duration: 200, queue: false});
        
        $('.website-condense').delay(200).show(0);
        $('.website-expand').hide();
    });
    
    $('.website-condense').click(function() {
        
        expand = 50;
        
        $('.website').animate({
            width: '50%'
            }, {duration: 200, queue: false});
            
        $('body').animate({
            left: '50%',
            }, {duration: 200, queue: false});
        
        $('.website-expand').delay(200).show(0);
        $('.website-condense').hide();
    });
    
};

$(document).ready(main);