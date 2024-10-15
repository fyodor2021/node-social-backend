export default {
  beforeMount: function (element, binding) {
    element.clickOutsideEvent = function (event) {
      if (!(element === event.target || element.contains(event.target))) {
        binding.value();
      }
    };
    document.body.addEventListener("mousedown", element.clickOutsideEvent);
  },
  unmounted: function (element) {
    document.body.removeEventListener("mousedown", element.clickOutsideEvent);
  },
};
