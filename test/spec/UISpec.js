(function() {
  "use strict";

  var getWrappers = function() {
    return $('div#skitt_wrapper');
  };

  var getWrapper = function() {
    return getWrappers()[0];
  };

  var getStartEndButtons = function() {
    return $('a#skitt_start_end_btn', getWrapper());
  };

  var getStartEndButton = function() {
    return getStartEndButtons()[0];
  };

  describe('SpeechKITT.vroom', function() {

    it('should add a visible gui to the DOM inside a div#skitt_wrapper', function () {
      expect(getWrappers()).toHaveLength(0);
      SpeechKITT.vroom();
      expect(getWrappers()).toHaveLength(1);
      expect(getWrapper()).toBeInDOM();
      expect(getWrapper()).toBeVisible();
    });

    it('should add a visible start button to the wrapper a#skitt_start_end_btn', function () {
      expect(getStartEndButtons()).toHaveLength(1);
      expect(getStartEndButton()).toBeInDOM();
      expect(getStartEndButton()).toBeVisible();
    });

    it('should not panic when called more than once', function () {
      expect($('#skitt_wrapper')).toHaveLength(1);
      expect($('#skitt_wrapper')[0]).toBeInDOM();
      expect($('#skitt_wrapper')[0]).toBeVisible();
      SpeechKITT.vroom();
      expect($('#skitt_wrapper')).toHaveLength(1);
      expect($('#skitt_wrapper')[0]).toBeInDOM();
      expect($('#skitt_wrapper')[0]).toBeVisible();
    });

  });

})();
