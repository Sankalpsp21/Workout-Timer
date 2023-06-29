(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['workoutTemplate'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"workout\" style=\"--clr: #9191fd\" title=\"Start Workout\">\n    <button type=\"button\" class=\"remove-button hidden\" style=\"--red: #b51204\"><i class=\"fa fa-plus\"></i></button>\n    <div class=\"workout-contents\">\n    <a href=\"#\" class=\"workout-title\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"title") || (depth0 != null ? lookupProperty(depth0,"title") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data,"loc":{"start":{"line":4,"column":38},"end":{"line":4,"column":47}}}) : helper)))
    + "</a> <span class=\"workout-duration\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"totalDuration") || (depth0 != null ? lookupProperty(depth0,"totalDuration") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"totalDuration","hash":{},"data":data,"loc":{"start":{"line":4,"column":83},"end":{"line":4,"column":100}}}) : helper)))
    + "</span>\n    </div>\n</div>";
},"useData":true});
})();