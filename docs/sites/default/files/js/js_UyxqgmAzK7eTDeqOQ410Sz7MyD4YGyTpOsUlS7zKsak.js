(function($) {

/**
 * jQuery debugging helper.
 *
 * Invented for Dreditor.
 *
 * @usage
 *   $.debug(var [, name]);
 *   $variable.debug( [name] );
 */
jQuery.extend({
  debug: function () {
    // Setup debug storage in global window. We want to look into it.
    window.debug = window.debug || [];

    args = jQuery.makeArray(arguments);
    // Determine data source; this is an object for $variable.debug().
    // Also determine the identifier to store data with.
    if (typeof this == 'object') {
      var name = (args.length ? args[0] : window.debug.length);
      var data = this;
    }
    else {
      var name = (args.length > 1 ? args.pop() : window.debug.length);
      var data = args[0];
    }
    // Store data.
    window.debug[name] = data;
    // Dump data into Firebug console.
    if (typeof console != 'undefined') {
      console.log(name, data);
    }
    return this;
  }
});
// @todo Is this the right way?
jQuery.fn.debug = jQuery.debug;

})(jQuery);
;
/**
 * @file
 * JavaScript functions for the Client-side adaptive image module.
 */

(function ($) {
  Drupal.behaviors.csAdaptiveImage = {
    attach: function(context, settings) {
      /**
       * Retrieves an adapted image based element's data attributes
       * and the current client width.
       */
      var getAdaptedImage = function(element, excluded_breakpoint) {
        var selected_breakpoint = 'max';
        var breakpoints = $(element).attr('data-adaptive-image-breakpoints');
        if (breakpoints) {
          // Find applicable target resolution.
          $.each(breakpoints.split(' '), function(key, breakpoint) {
            if (document.documentElement.clientWidth <= Number(breakpoint) && (selected_breakpoint == 'max' || Number(breakpoint) < Number(selected_breakpoint))) {
              selected_breakpoint = breakpoint;
            }
          });
        }
        if (selected_breakpoint != excluded_breakpoint) {
          return $(element).attr('data-adaptive-image-' + selected_breakpoint + '-img');
        }
        else {
          return false;
        }
      };

      // Insert adapted images.
      $('noscript.adaptive-image', context).once('adaptive-image', function() {
        var img = getAdaptedImage(this);
        $(this).after(img);
        Drupal.attachBehaviors(img);
      });

      // Replace adapted images on window resize.
      $(window).resize(function() {
        $('noscript.adaptive-image-processed').each(function() {
          // Replace image if it does not match the same breakpoint.
          var excluded_breakpoint = $(this).next('img.adaptive-image').attr('data-adaptive-image-breakpoint');
          var img = getAdaptedImage(this, excluded_breakpoint);
          if (img) {
            $(this).next('img.adaptive-image').replaceWith(img);
            Drupal.attachBehaviors(img);
          }
        });
      });
    }
  };
})(jQuery);;
