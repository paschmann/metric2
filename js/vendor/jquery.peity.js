// Peity jQuery plugin version 3.0.2
// (c) 2014 Ben Pickles
//
// http://benpickles.github.io/peity
//
// Released under MIT license.
/*
(function(h,w,i,v){var p=function(a,b){var d=w.createElementNS("http://www.w3.org/2000/svg",a);h(d).attr(b);return d},y="createElementNS"in w&&p("svg",{}).createSVGRect,e=h.fn.peity=function(a,b){y&&this.each(function(){var d=h(this),c=d.data("peity");c?(a&&(c.type=a),h.extend(c.opts,b)):(c=new x(d,a,h.extend({},e.defaults[a],b)),d.change(function(){c.draw()}).data("peity",c));c.draw()});return this},x=function(a,b,d){this.$el=a;this.type=b;this.opts=d},r=x.prototype;r.draw=function(){e.graphers[this.type].call(this,
this.opts)};r.fill=function(){var a=this.opts.fill;return h.isFunction(a)?a:function(b,d){return a[d%a.length]}};r.prepare=function(a,b){this.svg||this.$el.hide().after(this.svg=p("svg",{"class":"peity"}));return h(this.svg).empty().data("peity",this).attr({height:b,width:a})};r.values=function(){return h.map(this.$el.text().split(this.opts.delimiter),function(a){return parseFloat(a)})};e.defaults={};e.graphers={};e.register=function(a,b,d){this.defaults[a]=b;this.graphers[a]=d};e.register("pie",
{fill:["#ff9900","#fff4dd","#ffc66e"],radius:8},function(a){if(!a.delimiter){var b=this.$el.text().match(/[^0-9\.]/);a.delimiter=b?b[0]:","}b=this.values();if("/"==a.delimiter)var d=b[0],b=[d,i.max(0,b[1]-d)];for(var c=0,d=b.length,n=0;c<d;c++)n+=b[c];for(var c=2*a.radius,f=this.prepare(a.width||c,a.height||c),c=f.width(),f=f.height(),s=c/2,k=f/2,f=i.min(s,k),a=a.innerRadius,e=i.PI,q=this.fill(),g=this.scale=function(a,b){var c=2*a/n*e-e/2;return[b*i.cos(c)+s,b*i.sin(c)+k]},l=0,c=0;c<d;c++){var t=
b[c],j=t/n;if(0!=j){if(1==j)if(a)var j=s-0.01,o=k-f,m=k-a,j=p("path",{d:["M",s,o,"A",f,f,0,1,1,j,o,"L",j,m,"A",a,a,0,1,0,s,m].join(" ")});else j=p("circle",{cx:s,cy:k,r:f});else o=l+t,m=["M"].concat(g(l,f),"A",f,f,0,0.5<j?1:0,1,g(o,f),"L"),a?m=m.concat(g(o,a),"A",a,a,0,0.5<j?1:0,0,g(l,a)):m.push(s,k),l+=t,j=p("path",{d:m.join(" ")});h(j).attr("fill",q.call(this,t,c,b));this.svg.appendChild(j)}}});e.register("donut",h.extend(!0,{},e.defaults.pie),function(a){a.innerRadius||(a.innerRadius=0.5*a.radius);
e.graphers.pie.call(this,a)});e.register("line",{delimiter:",",fill:"#c6d9fd",height:16,min:0,stroke:"#4d89f9",strokeWidth:1,width:32},function(a){var b=this.values();1==b.length&&b.push(b[0]);for(var d=i.max.apply(i,a.max==v?b:b.concat(a.max)),c=i.min.apply(i,a.min==v?b:b.concat(a.min)),n=this.prepare(a.width,a.height),f=a.strokeWidth,e=n.width(),k=n.height()-f,h=d-c,d=this.x=function(a){return a*(e/(b.length-1))},n=this.y=function(a){var b=k;h&&(b-=(a-c)/h*k);return b+f/2},q=n(i.max(c,0)),g=[0,
q],l=0;l<b.length;l++)g.push(d(l),n(b[l]));g.push(e,q);this.svg.appendChild(p("polygon",{fill:a.fill,points:g.join(" ")}));f&&this.svg.appendChild(p("polyline",{fill:"transparent",points:g.slice(2,g.length-2).join(" "),stroke:a.stroke,"stroke-width":f,"stroke-linecap":"square"}))});e.register("bar",{delimiter:",",fill:["#4D89F9"],height:16,min:0,padding:0.1,width:32},function(a){for(var b=this.values(),d=i.max.apply(i,a.max==v?b:b.concat(a.max)),c=i.min.apply(i,a.min==v?b:b.concat(a.min)),e=this.prepare(a.width,
a.height),f=e.width(),h=e.height(),k=d-c,a=a.padding,e=this.fill(),r=this.x=function(a){return a*f/b.length},q=this.y=function(a){return h-(k?(a-c)/k*h:1)},g=0;g<b.length;g++){var l=r(g+a),t=r(g+1-a)-l,j=b[g],o=q(j),m=o,u;k?0>j?m=q(i.min(d,0)):o=q(i.max(c,0)):u=1;u=o-m;0==u&&(u=1,0<d&&k&&m--);this.svg.appendChild(p("rect",{fill:e.call(this,j,g,b),x:l,y:m,width:t,height:u}))}})})(jQuery,document,Math);
*/
// Peity jQuery plugin version 3.0.2
// (c) 2014 Ben Pickles
//
// http://benpickles.github.io/peity
//
// Released under MIT license.
(function($, document, Math, undefined) {
  var svgElement = function(tag, attrs) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", tag)
    $(elem).attr(attrs)
    return elem
  }

  // https://gist.github.com/madrobby/3201472
  var svgSupported = 'createElementNS' in document && svgElement('svg', {}).createSVGRect

  var peity = $.fn.peity = function(type, options) {
    if (svgSupported) {
      this.each(function() {
        var $this = $(this)
        var chart = $this.data("peity")

        if (chart) {
          if (type) chart.type = type
          $.extend(chart.opts, options)
        } else {
          chart = new Peity(
            $this,
            type,
            $.extend({}, peity.defaults[type], options)
          )

          $this
            .change(function() { chart.draw() })
            .data("peity", chart)
        }

        chart.draw()
      });
    }

    return this;
  };

  var Peity = function($el, type, opts) {
    this.$el = $el
    this.type = type
    this.opts = opts
  }

  var PeityPrototype = Peity.prototype

  PeityPrototype.draw = function() {
    peity.graphers[this.type].call(this, this.opts)
  }

  PeityPrototype.fill = function() {
    var fill = this.opts.fill

    return $.isFunction(fill)
      ? fill
      : function(_, i) { return fill[i % fill.length] }
  }

  PeityPrototype.prepare = function(width, height) {
    if (!this.svg) {
      this.$el.hide().after(
        this.svg = svgElement("svg", {
          "class": "peity"
        })
      )
    }

    return $(this.svg)
      .empty()
      .data('peity', this)
      .attr({
        height: height,
        width: width
      })
  }

  PeityPrototype.values = function() {
    return $.map(this.$el.text().split(this.opts.delimiter), function(value) {
      return parseFloat(value)
    })
  }

  peity.defaults = {}
  peity.graphers = {}

  peity.register = function(type, defaults, grapher) {
    this.defaults[type] = defaults
    this.graphers[type] = grapher
  }

  peity.register(
    'pie',
    {
      fill: ['#ff9900', '#fff4dd', '#ffc66e'],
      radius: 8
    },
    function(opts) {
      if (!opts.delimiter) {
        var delimiter = this.$el.text().match(/[^0-9\.]/)
        opts.delimiter = delimiter ? delimiter[0] : ","
      }

      var values = this.values()

      if (opts.delimiter == "/") {
        var v1 = values[0]
        var v2 = values[1]
        values = [v1, Math.max(0, v2 - v1)]
      }

      var i = 0
      var length = values.length
      var sum = 0

      for (; i < length; i++) {
        sum += values[i]
      }

      var diameter = opts.radius * 2

      var $svg = this.prepare(
        opts.width || diameter,
        opts.height || diameter
      )

      var width = $svg.width()
        , height = $svg.height()
        , cx = width / 2
        , cy = height / 2

      var radius = Math.min(cx, cy)
        , innerRadius = opts.innerRadius
      var pi = Math.PI
      var fill = this.fill()

      var scale = this.scale = function(value, radius) {
        var radians = value / sum * pi * 2 - pi / 2

        return [
          radius * Math.cos(radians) + cx,
          radius * Math.sin(radians) + cy
        ]
      }

      var cumulative = 0

      for (i = 0; i < length; i++) {
        var value = values[i]
          , portion = value / sum
          , node

        if (portion == 0) continue

        if (portion == 1) {
          if (innerRadius) {
            var x2 = cx - 0.01
              , y1 = cy - radius
              , y2 = cy - innerRadius

            node = svgElement('path', {
              d: [
                'M', cx, y1,
                'A', radius, radius, 0, 1, 1, x2, y1,
                'L', x2, y2,
                'A', innerRadius, innerRadius, 0, 1, 0, cx, y2
              ].join(' ')
            })
          } else {
            node = svgElement("circle", {
              cx: cx,
              cy: cy,
              r: radius
            })
          }
        } else {
          var cumulativePlusValue = cumulative + value

          var d = ['M'].concat(
            scale(cumulative, radius),
            'A', radius, radius, 0, portion > 0.5 ? 1 : 0, 1,
            scale(cumulativePlusValue, radius),
            'L'
          )

          if (innerRadius) {
            d = d.concat(
              scale(cumulativePlusValue, innerRadius),
              'A', innerRadius, innerRadius, 0, portion > 0.5 ? 1 : 0, 0,
              scale(cumulative, innerRadius)
            )
          } else {
            d.push(cx, cy)
          }

          cumulative += value

          node = svgElement("path", {
            d: d.join(" ")
          })
          node.id = i + "-" + value;
        }

        $(node).attr('fill', fill.call(this, value, i, values))

        this.svg.appendChild(node)
      }
    }
  )

  peity.register(
    'donut',
    $.extend(true, {}, peity.defaults.pie),
    function(opts) {
      if (!opts.innerRadius) opts.innerRadius = opts.radius * 0.5
      peity.graphers.pie.call(this, opts)
    }
  )

  peity.register(
    "line",
    {
      delimiter: ",",
      fill: "#c6d9fd",
      height: 16,
      min: 0,
      stroke: "#4d89f9",
      strokeWidth: 1,
      width: 32
    },
    function(opts) {
      var values = this.values()
      if (values.length == 1) values.push(values[0])
      var max = Math.max.apply(Math, opts.max == undefined ? values : values.concat(opts.max))
        , min = Math.min.apply(Math, opts.min == undefined ? values : values.concat(opts.min))

      var $svg = this.prepare(opts.width, opts.height)
        , strokeWidth = opts.strokeWidth
        , width = $svg.width()
        , height = $svg.height() - strokeWidth
        , diff = max - min

      var xScale = this.x = function(input) {
        return input * (width / (values.length - 1))
      }

      var yScale = this.y = function(input) {
        var y = height

        if (diff) {
          y -= ((input - min) / diff) * height
        }

        return y + strokeWidth / 2
      }

      var zero = yScale(Math.max(min, 0))
        , coords = [0, zero]

      for (var i = 0; i < values.length; i++) {
        coords.push(
          xScale(i),
          yScale(values[i])
        )
      }

      coords.push(width, zero)

      this.svg.appendChild(
        svgElement('polygon', {
          fill: opts.fill,
          points: coords.join(' ')
        })
      )

      if (strokeWidth) {
        this.svg.appendChild(
          svgElement('polyline', {
            fill: 'transparent',
            points: coords.slice(2, coords.length - 2).join(' '),
            stroke: opts.stroke,
            'stroke-width': strokeWidth,
            'stroke-linecap': 'square'
          })
        )
      }
    }
  );

  peity.register(
    'bar',
    {
      delimiter: ",",
      fill: ["#4D89F9"],
      height: 16,
      min: 0,
      padding: 0.1,
      width: 32
    },
    function(opts) {
      var values = this.values()
        , max = Math.max.apply(Math, opts.max == undefined ? values : values.concat(opts.max))
        , min = Math.min.apply(Math, opts.min == undefined ? values : values.concat(opts.min))

      var $svg = this.prepare(opts.width, opts.height)
        , width = $svg.width()
        , height = $svg.height()
        , diff = max - min
        , padding = opts.padding
        , fill = this.fill()

      var xScale = this.x = function(input) {
        return input * width / values.length
      }

      var yScale = this.y = function(input) {
        return height - (
          diff
            ? ((input - min) / diff) * height
            : 1
        )
      }

      for (var i = 0; i < values.length; i++) {
        var x = xScale(i + padding)
          , w = xScale(i + 1 - padding) - x
          , value = values[i]
          , valueY = yScale(value)
          , y1 = valueY
          , y2 = valueY
          , h

        if (!diff) {
          h = 1
        } else if (value < 0) {
          y1 = yScale(Math.min(max, 0))
        } else {
          y2 = yScale(Math.max(min, 0))
        }

        h = y2 - y1

        if (h == 0) {
          h = 1
          if (max > 0 && diff) y1--
        }

        this.svg.appendChild(
          svgElement('rect', {
            fill: fill.call(this, value, i, values),
            x: x,
            y: y1,
            width: w,
            height: h
          })
        )
      }
    }
  );
})(jQuery, document, Math);
