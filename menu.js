// menu js
function Menu(){
    // Menu 
    // this.style='darker'
}

Menu.prototype.add_Menu = function(name,options,callback) {
    options = options || {};
    this.options = options;

    var that = this;
    var el_menu = $("menu_bar")
    // console.log(el_menu)
    
    if(this.options.entry){
        var el_entry = null;
        var el_menu_entries = null;
        if(el_menu.hasChildNodes())
        {
            el_menu_entries = el_menu.children;
            for (var i = 0,j = el_menu_entries.length - 1; i <= j; i++) {
                if(el_menu_entries[i].id == this.options.entry){
                    el_entry = el_menu_entries[i];
                }
            }
        }

        if(!el_entry){// if entry has existed
            var tv = this.options.entry;
            var tp1 =
            `<div class="menu_entry" id=${tv}>${tv}
                <div class="menu_down_contain">
                    <div class="sub_menu" id='${name}' onclick='${callback}'>${name}</div>
                </div>
            </div>`
            el_menu.innerHTML += tp1;
        }
        else{
            var tp1 = `<div class="sub_menu" id='${name}' onclick='${callback}'>${name}</div>`;
            el_entry.children[0].innerHTML += tp1;
        }

    }
};

Menu.prototype.add_Sub_Menu = function(name,parent,options,callback){
    options = options || {};
    this.options = options;

    var that = this;

    var el_parent = $(parent);
    if (!el_parent){
        return
    }
    else{
        // console.log(el_parent)
        if (el_parent.children.length>0){
            var tp1 = `<div class="sub_menu" onclick="${callback}">${name}</div>`
            el_parent.children[0].innerHTML += tp1
        }
        else{
            var tp1=`<div class="menu_left_contain">
                <div class="sub_menu" onclick="${callback}">${name}</div></div>`
            // console.log(el_parent.innerHTML)
            el_parent.innerHTML +=tp1
        }
    }
}