var widgets = require('@jupyter-widgets/base');
var _ = require('lodash');
var $ = require('jquery');
require('select2/dist/css/select2.min.css');
require('./theme/style.css');
require('select2');

var nodesRegistry = {};

var Select2Model = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: 'Select2Model',
    _view_name: 'Select2View',
    _model_module: 'ipyselect2',
    _view_module: 'ipyselect2',
    options: [],
    disabled: false,
    value: '',
    width: '',
    height: '',
    multiple: '',
    placeholder: '',
  })
}, {
  serializers: _.extend({
    nodes: { deserialize: widgets.unpack_models },
    selected_nodes: { deserialize: widgets.unpack_models },
  }, widgets.DOMWidgetModel.serializers)
});

var Select2View = widgets.DOMWidgetView.extend({
  render: function() {
    this.el.className += ' jupyter-widgets widget-dropdown';
    var select = this.select = document.createElement('select');
    var multiple = this.model.get('multiple');
    if (multiple) select.multiple = multiple;
    select.className = 'ipyselect2';
    this.fill_options();
    this.el.appendChild(select);
    var placeholder = this.model.get('placeholder') || 'select...';
    var width = this.model.get('width');
    var height = this.model.get('height');
    var params = { allowClear: true, placeholder: placeholder };
    if (width) params.width = width;
    if (height) params.height = height;
    setTimeout(function() { $(select).select2(params); });
    var value = this.model.get('value');
    if (value) setTimeout(function() { $(select).val(value).trigger('change'); });
    this.model.on('change:options', this.options_changed, this);
    this.model.on('change:disabled', this.disabled_changed, this);
    this.model.on('change:value', this.value_changed, this);

    select.onchange = this.input_changed.bind(this);
  },

  fill_options: function() {
    var options = this.model.get('options');
    if (options) {
      select = this.select;
      options.forEach(function(value) {
        var option = document.createElement('option');
        option.text = value;
        option.value = value;
        select.add(option);
      });
    }
  },

  options_changed: function() {
    $(this.select).empty();
    this.fill_options();
  },

  disabled_changed: function() {
    this.select.disabled = this.model.get('disabled');
  },

  value_changed: function() {
    $(this.select).val(this.model.get('value')).trigger('change');
  },

  input_changed: function() {
    this.model.set('value', $(this.select).val());
    this.model.save_changes();
  },
});

module.exports = {
  Select2Model: Select2Model,
  Select2View: Select2View,
};
