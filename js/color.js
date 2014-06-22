var Color = function(r, g, b, hex) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.hex = hex;
};

Color.WHITE = new Color(15,15,15, "#FFFFFF");
Color.RED = new Color(15,0,0, "#FF0000");
Color.GREEN = new Color(0,15,0, "#00FF00");
Color.GREY = new Color(0,15,0, "#808080");