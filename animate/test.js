function init() {

  var domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
      elm = document.getElementById( 'demo' ),
      message = document.getElementById( 'technique' ),
      rotate = 0,
      animation = false,
      transformation = false,
      animationstring = 'animation',
      transformstring = 'transform',
      keyframeprefix = '',
      pfx = '';

  if( elm.style.animationName ) { animation = true; }    
  if( elm.style.transform ) { transformation = true; }    

  if( animation === false ) {
    for( var i = 0; i < domPrefixes.length; i++ ) {
      if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
        pfx = domPrefixes[ i ];
        animationstring = pfx + 'Animation';
        keyframeprefix = '-' + pfx.toLowerCase() + '-';
        animation = true;
        break;
      }
    }
  }
  
  if( transformation === false ) {
    for( var i = 0; i < domPrefixes.length; i++ ) {
      if( elm.style[ domPrefixes[i] + 'Transform' ] !== undefined ) {
        pfx = domPrefixes[ i ];
        transformstring = pfx + 'Transform';
        transformation = true;
        break;
      }
    }
  }
  
  if( animation === false ) {

    message.innerHTML += 'Using an animation loop';

    if( requestAnimationFrame.toString().indexOf( 'mation' ) !== -1 ) {
      message.innerHTML += ' with requestAnimationFrame';
    } else {
      message.innerHTML += ' without requestAnimationFrame';
    }

    if( transformation !== false ) {
        loop();
    } 
  } else {
    
    message.innerHTML = 'Animated with CSS3 animation';

    elm.style[ animationstring ] = 'rotate 1s linear infinite';

    var keyframes = '@' + keyframeprefix + 'keyframes rotate { '+
                    'from {' + keyframeprefix + 'transform:rotate( 0deg ) }'+
                    'to {' + keyframeprefix + 'transform:rotate( 360deg ) }'+
                    '}';

    if( document.styleSheets && document.styleSheets.length ) {

        document.styleSheets[0].insertRule( keyframes, 0 );

    } else {

      var s = document.createElement( 'style' );
      s.innerHTML = keyframes;
      document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );

    }

  }
  function loop() {
    rotate += 4;
    elm.style[ transformstring ] = 'rotate(' + rotate + 'deg)';
    requestAnimationFrame( loop, 30 );
  }
  
}


/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(  callback, fps ) {
      window.setTimeout( callback, 1000 / fps );
    };
  } )();
}

init();
