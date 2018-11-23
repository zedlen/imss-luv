/**
 * Behaviors for collapsible menu.
 */
(function($) {

  /**
   * Adds toggle link.
   * Toggles menu on small resolutions.
   * Restores menu on window width increasing.
   */
  Drupal.behaviors.responsiveBartikCollapsibleMenu = {
    attach: function (context, settings) {

      // We can keep menu collapsed up to width maxWidth.
      var maxWidth = 445;

      // Do nothing if menu is empty.
      if ($('#main-menu-links a').length == 0) {
        return;
      }

      // Append toggle link to the main menu.
      $('nav#main-menu').append('<a href="#" id="menu-toggle">' + Drupal.t('Menu') + '</a>');

      // Collapse/expand menu by click on link.
      $('a#menu-toggle').click(function() {
        
	    setTimeout(function(){ $('#main-menu-links').slideToggle('fast'); }, 1000);

//	$('#main-menu-links').slideToggle('fast');, 
        return false;
      });

      // Restore visibility settings of menu on increasing of windows width over 445px.
      // Media query works with width up to 460px. But I guess we should take into account some padding.
      $(window).resize(function(){
        var w = $(window).width();
        // Remove all styles if window size more than maxWidth and menu is hidden.
        if(w > maxWidth && $('#main-menu-links').is(':hidden')) {
          $('#main-menu-links').removeAttr('style');
        }
      });
    }
  }
})(jQuery);
;
/**
 *
 * @author Pedro Pelaez
 * @copyright (c) 2013, I2Factory
 *
 */
jq = jQuery;
jq(document).ready(function() {
    jq(".tooltip").tooltip({
        track: true, 
        delay: 0, 
        showURL: false, 
        showBody: " - ", 
        fade: 250 
    });
    var dinamicMenu = function(cnt) {
        this.cnt = cnt;
        this.showed = [];
        
        /**
         * Selecciona la primera opción de menu.
         * @returns {Boolean} Si hay opciones de menu
         */
        this.selectFirst = function() {
            if (this.showed[0] != null) {
                jq("#" + this.showed[0]).click();
                return true;
            }
            return false;
        }
        this.add = function(id, name, image, urlIcono, toolContext, head, body, type) {
            var pid, pname, pimage, purlIcono, ptoolContext, phead, pbody, ptype;
            pid = (name == null) ? id.id : id;
            pname = (name == null) ? id.name : name;
            pimage = (name == null) ? id.image : image;
            purlIcono = (name == null) ? id.urlIcono : urlIcono;
            ptoolContext = (name == null) ? id.toolContext : toolContext;
            phead = (name == null) ? id.head : head;
            pbody = (name == null) ? id.body : body;
            ptype = (name == null) ? id.type : type;
            // Añadir nuevo elemento al contenedor (cnt)
            if (this.showed.indexOf(pid) == -1) {
                this.showed.push(pid);
                var html = '<li class="menu">';
                html += '<span class="iconMenu">';
				purlIcono_extension = purlIcono.substr( (purlIcono.lastIndexOf('.') +1) );
				if ( purlIcono_extension.length < 5 ) {
					html += '<img src="' + purlIcono.replace('^/\/', '/') + '" alt="" />'; 
				} else {
					html += '<img src="' + purlIcono.replace('^/\/', '/') + "default_images/ficha_pagina_ico_0.png" + '" alt="" />'; 
				}
                html += '&nbsp;';
                html += '</span>';
                html += '<div class="menuBlock"><div class="textoMenuBlock"><span id="' + pid + '" class="textoMenuSub">';
                html += pname;
                html += '</span></div><div class="triangulo"></div></div>';
                html += '</li>';
                this.cnt.append(html);
                if ( ptype == "subpagina" ) {
                    // Comprobar si montar pagina de preguntas frecuentes
                    loadView("v_preguntas_ficha", pid, function(data, subpagina_faq) {
                        if (data == null) {
                            return; // No se han cargado los datos
                        }
                        var cuerpoFAQ = '';
                        if (data.nodes.length > 0) {
                            var numItems = jq(".subpagina-faq").length;
                            cuerpoFAQ += '<div id="wrapper-faq_'+pid+'" class="subpagina-faq preguntas-'+pid+'">';
                            jq.each(data.nodes, function(i, node) {
                                var item = node.node;
                                // Damos formato a la salida
                                cuerpoFAQ += '<div class="filaFaqSalud" id="faq_id_' + item.nid + '">';
                                cuerpoFAQ += '<div class="wrapperFaqSalud">';
                                cuerpoFAQ += '<div class="tituloFaqSalud">';
                                cuerpoFAQ += '<div class="simboloFaq"> + </div>';
                                cuerpoFAQ += '<div class="textoTitulo"> ' + item.title + item.wraper_area + ' </div>';
                                cuerpoFAQ += '</div>';
                                cuerpoFAQ += '<div class="respuestaFaqSalud" style="display: none;">';
                                cuerpoFAQ += '<p>' + item.field_ficha_faq_respuesta + '</p>';
                                if (item.field_ficha_faq_adjuntos) {
                                    cuerpoFAQ += item.field_ficha_faq_adjuntos;
                                }
                                cuerpoFAQ += '</div>';
                                cuerpoFAQ += '</div>';
                                cuerpoFAQ += '</div>';
                            });
                            cuerpoFAQ += '</div>';
                            cuerpoFAQ += '<script>startFAQ();</script>';
                            jq("#preguntasSubpaginaFicha").append( cuerpoFAQ );
                            jq(".subpagina-faq").hide();
                            jq("#wrapper-faq_"+ jq(".seleccionadoMenu").attr("id") ).show();
                        }
                    });
                }
                jq("#" + pid).click(function(e) {
                    var url = document.URL;
                    url = url.split('#');
                    direccion = url[0];
                    var nombre = pname.split('<');
                    dNombre = nombre[0];
                    if (typeof(_paq) !== "undefined") _paq.push(['trackPageView', direccion + '/' + dNombre]);

                    jq(".seleccionadoMenu").removeClass("seleccionadoMenu");
                    jq("#" + pid).addClass("seleccionadoMenu");
                    if (pimage != "") {
                        jq("#imagenSubFicha").html("<img src='" + pimage + "' alt='' />");
                    }
                    jq("#textoOpcionMenu").html(phead);
                    jq("#cuerpoOpcion").html(pbody);
					
					if ( ptype == 'pregunta' ) {
						if ( jq(".view-v-herramientas-ficha").length ) {
							jq(".view-v-herramientas-ficha").remove();
						}
					}
					
                    jq(".subpagina-faq").hide();
                    jq("#wrapper-faq_"+pid).show();
                    if ( ptype == "subpagina" ) {
                        showView("herramientas", pid, jq("#recordTool"));
					}
                });
            }
        }
        
        return this;
    }

    function showView(view, ctx, target) {
        if (ctx == "") return;
        jq.ajax({
            type: 'GET',
            url: Drupal.settings.basePath + 'subpagina_ficha/' + view + '/' + ctx,
            dataType: 'json',
            success: function(data) {
                var viewHtml = data[1].data;
                target.html(viewHtml);
                Drupal.attachBehaviors(target);
            },
            error: function(data) {
                target.html('An error occured!');
            }
        });
    }

    function loadView(view, ctx, callback) {
        if (ctx == "") return;
        var postdata = 'view_name=' + view + '&view_display_id=block&view_args=' + ctx;
        jq.ajax({
            type: 'POST',
            url: Drupal.settings.basePath + 'views/ajax',
            dataType: 'json',
            data: postdata,
            success: function(data) {
                if (callback)
                    callback(data);
            },
            error: function(data) {
                if (callback)
                    callback(null);
            }
        });
    }    

    function loadTabs(view, ctx, callback) {
        if (ctx == "") return;
        jq.ajax({
            type: 'GET',
            url: Drupal.settings.basePath + 'subpagina_ficha/' + view + '/' + ctx,
            dataType: 'json',
            success: function(data) {
                if (callback)
                    callback(data);
            },
            error: function(data) {
                if (callback)
                    callback(null);
            }
        });
    }

    var menu = new dinamicMenu(jq("#menuSubPagina"));
    
    // Recogemos imagen por defecto
    var defImg = jq("#imagenSubFicha").text();
    var defDesc = jq("#textoOpcionMenu").html();
    var ctxID = jq("#fichaID").text();
    var title = jq("#menuSubPagina").text();
    jq("#imagenSubFicha").text("");
    jq("#textoOpcionMenu").text("");
    jq("#menuSubPagina").text("");

    // Montamos la vista
    loadTabs('default', ctxID, function(data) {
        if (data == null) {
            return; // No se han cargado los datos
        }
        if (defImg != "") {
            jq("#imagenSubFicha").html("<img src='" + defImg + "' alt='' />");
        }
        // Montar menu
        jq.each(data.nodes, function(i, node) {
            var item = node.node;
            if ( item.field_ficha_subpage_select_image != null ) {
                imagen_sub_ficha = item.field_ficha_subpage_select_image;
            } else if( item.field_ficha_subpagina_imagen != null ) {
                imagen_sub_ficha = item.field_ficha_subpagina_imagen;
            } else {
                imagen_sub_ficha = defImg;
            }
            menu.add({
                id: item.nid,
                name: item.title,
                image: imagen_sub_ficha,
                urlIcono: item.field_ficha_subpagina_icono,
                toolContext: item.nid,
                head: item.field_ficha_descripcion,
                body: item.field_ficha_subpagina_cuerpo,
                type: "subpagina"
            });
        });
        if (!menu.selectFirst()) {
            menu.add({
                id: "record_" + ctxID,
                name: title,
                image: defImg,
                urlIcono: Drupal.settings.basePath + "/sites/all/statics/default_images/ficha_pagina_ico_0.png",
                toolContext: null,
                head: defDesc,
                body: "",
                type: "ficha"
            });
            menu.selectFirst();
        }
        // Comprobar si montar pagina de preguntas frecuentes
        loadView("v_preguntas_ficha", ctxID, function(data) {
            if ( data == null ) {
                return; // No se han cargado los datos
            }
            if (data.nodes.length > 0) {
                var cuerpoFAQ = '';
                jq.each(data.nodes, function(i, node) {
                    var item = node.node;
                    // Damos formato a la salida
                    cuerpoFAQ += '<div class="filaFaqSalud" id="faq_id_' + item.nid + '">';
                    cuerpoFAQ += '<div class="wrapperFaqSalud">';
                    cuerpoFAQ += '<div class="tituloFaqSalud">';
                    cuerpoFAQ += '<div class="simboloFaq"> + </div>';
                    cuerpoFAQ += '<div class="textoTitulo"> ' + item.title + item.wraper_area + ' </div>';
                    cuerpoFAQ += '</div>';
                    cuerpoFAQ += '<div class="respuestaFaqSalud" style="display: none;">';
                    cuerpoFAQ += '<p>' + item.field_ficha_faq_respuesta + '</p>';
                    if (item.field_ficha_faq_adjuntos)
                        cuerpoFAQ += item.field_ficha_faq_adjuntos;
                    cuerpoFAQ += '</div>';
                    cuerpoFAQ += '</div>';
                    cuerpoFAQ += '</div>';
                });
                
                cuerpoFAQ += '<script>startFAQ();</script>';
                // Añadimos la opcion de menu
                menu.add({
                    id: "faq" + ctxID,
                    name: "Preguntas frecuentes",
                    image: defImg,
                    urlIcono: Drupal.settings.basePath + "sites/all/statics/default_images/ficha_pagina_ico_0.png",
                    toolContext: null,
                    head: defDesc,
                    body: cuerpoFAQ,
                    type: 'pregunta'
                });
            }
        });
    });
});
;
jq= jQuery;

function initDirectory() {
    var objectDir = {
        view_name: 'v_instalaciones_directorio',
        view_display_id: 'default',
        view_args: 0,
        view_path: 'directorio',
        field_tipo_value: 'All',
        field_estado_value: 'All',
        combine: ''
    };
    jq("#selectorEstados").val("All");
    
    jq("body").data("searchDirectory", objectDir);
}

function searchTypeDir(type){
    initDirectory();
	var objectDir = jq("body").data("searchDirectory");
    objectDir['field_tipo_value'] = type;
    jq("#buscarDirectory").val("");
    jq("body").data("searchDirectory", objectDir);
    showSearchDirectory();
}


function updateTableDirectory(key, value) {
    var objectDir = jq("body").data("searchDirectory");
    if(typeof objectDir !== 'undefined')  {
    	delete objectDir.page; 
	objectDir[key] = value;
	//objectDir[key] = encodeURIComponent(value);

	jq("body").data("searchDirectory", objectDir);
	showSearchDirectory();
    }
}

function showSearchDirectory() {
    var objectDir = jq("body").data("searchDirectory");
    var datos = "";
    for (x in objectDir) {
        datos = datos + x + "=" + objectDir[x] + "&";
    }
    datos = datos.substring(0, datos.length - 1);

    var target = jq('#buscadorDirectorio');
    jq('#buscarDirectory').val(decodeURIComponent(objectDir['combine'])); 
    jq.ajax({
        type: 'POST',
        url: Drupal.settings.basePath + 'views/ajax',
        dataType: 'json',
        data: datos,
        success: function(data) {
            var viewHtml = data[1].data;
            target.html(viewHtml);
            Drupal.attachBehaviors(target);
        },
        error: function(data) {
            target.html('An error occured!');
        }
    });
}

function getValue(param,chain){
    var splitParam = new Array();
    var splitValue = new Array();
    
    splitParam = chain.split("&");
    splitValue ;
    for(var i=0;i<splitParam.length;i++){
       splitValue = splitParam[i].split("=");
       var pos = splitValue[0].indexOf(param);
       if(pos != -1 && splitValue[0].length == param.length){
           
            return splitValue[1];
       }
    }
    return -1;
}



function getImagen(typeInst){

    var value = "";
    if(typeInst == 'Administrativas'){
        value="#admin";
    }
    else if (typeInst == 'Medicas'){
        value="#medica";
    }
    else if (typeInst == 'Prestaciones'){
        value = "#prest";
    }
    return value;
}
jq(document).ready(function() {  
   
	var urlParams;
	(window.onpopstate = function () {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    urlParams = {};
	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();
	
	
    var initial = window.location.href;
    var pos = initial.indexOf("&");
    var select="";
    var url = initial.split("#");
    var direc = url[0].split("/");
    //if (direc[direc.length-1] == "directorio"){
    if (direc[direc.length-1].search("directorio")!=-1){
        initDirectory();
        
        if(pos != -1){
            var inst = getValue("field_tipo_value",initial)
            var page = getValue("page",initial)
            var est = getValue("field_estado_value", initial);
            var combine = urlParams["combine"];

            var objectDir = jq("body").data("searchDirectory");
            objectDir['field_tipo_value'] = inst;
            objectDir['field_estado_value'] = est;
            objectDir['combine'] = combine;
            if(page != -1){
                objectDir['page'] = page;   
            }
            jq("body").data("searchDirectory", objectDir);

            var idImage = getImagen(inst);
            if (idImage != ""){
                var temp = jq(idImage).attr("src").split("_");
                jq(idImage).attr("src",temp[0] + "_over.png");
                select=jq(idImage).attr("id");
            }
            jq("#selectorEstados").val(est);
            showSearchDirectory();
        }
    }
   
    
    
    jq(document).on('click', '.pager li a', function(e){
    	
    	var urlParams;

    	    var match,
    	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
    	        search = /([^&=]+)=?([^&]*)/g,
    	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    	        query  = jq(e.target).attr('href');

    	    urlParams = {};
    	    while (match = search.exec(query))
    	       urlParams[decode(match[1])] = decode(match[2]);
    	    	
	var objectDir = jq("body").data("searchDirectory");
	if(typeof objectDir !== 'undefined')  {    	
    		e.preventDefault();
    		updateTableDirectory('page', urlParams['page']);
	}

    } );
    
    /*
    jq('.pager li a').live('click', function(e){

    });
    */

    jq(".directory").click(function(){

        jq(".directory").each(function(index){
            var src = jq(this).find("img").attr("src").split("_");
            jq(this).find("img").attr("src",src[0] + "_.png");
        });
        var temp = jq(this).find("img").attr("src").split("_");
        jq(this).find("img").attr("src",temp[0] + "_over.png");
        select=jq(this).find("img").attr("id");
    });

    jq(".directory").mouseover(function(){
        if(jq(this).find("img").attr("id")!=select){
            var temp = jq(this).find("img").attr("src").split("_");
           jq(this).find("img").attr("src",temp[0] + "_over.png");
        }
    });

    jq(".directory").mouseout(function(){
        if(jq(this).find("img").attr("id")!=select){
            var temp = jq(this).find("img").attr("src").split("_");
            jq(this).find("img").attr("src",temp[0] + "_.png");
        }
    });

    jq(".cabDirInst").mouseover(function(){
        jq(".cabDirInst .first").css("color","rgb(173,0,64)");
        jq(".cabDirInst #textLogoDir").css("color","#3B6858");
    });
    jq(".cabDirInst").mouseout(function(){
        jq(".cabDirInst .first").css("color","rgb(134,132,136)");
        jq(".cabDirInst #textLogoDir").css("color","rgb(179,178,180)");
    });

    jq(".cabDirFunc").mouseover(function(){
        jq(".cabDirFunc .first").css("color","rgb(173,0,64)");
        jq(".cabDirFunc #textLogoDir").css("color","#3B6858");
    });
    jq(".cabDirFunc").mouseout(function(){
        jq(".cabDirFunc .first").css("color","rgb(134,132,136)");
        jq(".cabDirFunc #textLogoDir").css("color","rgb(179,178,180)");
    });
});

;
//jq = jQuery;

jq(document).ready(function() {

     initSimpleFAQ();
     //startSimpleFAQ();
     var panel1 = new tabpanel("item-list", true); 
});


function initSimpleFAQ() {
	
	/* Initialize each element for acordian */

        jq(".acordeonTitle").each(function(i){
	      jq(this).attr('id','tab'+(i+1));
              jq(this).attr('aria-controls','panel' + (i+1));
              jq(this).attr('role','tab');
              jq(this).attr('aria-expanded','false');
              jq(this).attr('aria-selected','true');
	      jq(this).addClass('tab');
	});

       jq(".acordeonCont").each(function(i){
              jq(this).attr('id','panel'+(i+1));
              jq(this).addClass('panel');
              jq(this).attr('aria-labelledby','tab'+(i+1))
              jq(this).attr('role','tabpanel');

        });	

}


function startSimpleFAQ() {
    jq(".acordeonTitle").click(function(e) {
        
        
        jq(".acordeonCont ").hide(300);

        if (jq(this).next(".acordeonCont").css("display") == "block") {
            jq(this).addClass('collapsed').removeClass('expanded');
            jq(this).attr('aria-expanded','false');
            jq(this).next(".acordeonCont").hide(300);
        }
        else {
             jq(".acordeonTitle").addClass('collapsed').removeClass('expanded');
            jq(this).addClass('expanded').removeClass('collapsed');
            jq(this).attr('aria-expanded','true');            
            jq(this).next(".acordeonCont").show(300);
        }
    });
}

// 
// keyCodes() is an object to contain keycodes needed for the application 
// 
function keyCodes() { 
  // Define values for keycodes 
  this.tab        = 9; 
  this.enter      = 13; 
  this.esc        = 27; 

  this.space      = 32; 
  this.pageup     = 33; 
  this.pagedown   = 34; 
  this.end        = 35; 
  this.home       = 36; 

  this.left       = 37; 
  this.up         = 38; 
  this.right      = 39; 
  this.down       = 40; 

} // end keyCodes 

// 
// tabpanel() is a class constructor to create a ARIA-enabled tab panel widget. 
// 
// @param (id string) id is the id of the div containing the tab panel. 
// 
// @param (accordian boolean) accordian is true if the tab panel should operate 
//         as an accordian; false if a tab panel 
// 
// @return N/A 
// 
// Usage: Requires a div container and children as follows: 
// 
//         1. tabs/accordian headers have class 'tab' 
// 
//         2. panels are divs with class 'panel' 
// 
function tabpanel(id, accordian) { 

  // define the class properties 
   
  this.panel_id = id; // store the id of the containing div 
  this.accordian = accordian; // true if this is an accordian control 
  this.$panel = jq('.' + id);  // store the jQuery object for the panel 
  this.keys = new keyCodes(); // keycodes needed for event handlers 
  this.$tabs = this.$panel.find('.tab'); // Array of panel tabs. 
  this.$panels = this.$panel.children('.panel'); // Array of panel. 

  // Bind event handlers 
  this.bindHandlers(); 

  // Initialize the tab panel 
  this.init(); 

} // end tabpanel() constructor 

// 
// Function init() is a member function to initialize the tab/accordian panel. Hides all panels. If a tab 
// has the class 'selected', makes that panel visible; otherwise, makes first panel visible. 
// 
// @return N/A 
// 
tabpanel.prototype.init = function() { 
  var $tab; // the selected tab - if one is selected 

  // add aria attributes to the panels 
  this.$panels.attr('aria-hidden', 'true');

  //console.log(this.$panels); 

  // hide all the panels 
  this.$panels.hide(); 

  // get the selected tab 
  $tab = this.$tabs.filter('.selected');

  if ($tab == undefined) { 
    $tab = this.$tabs.first(); 
    $tab.addClass('selected'); 
  } 

  // show the panel that the selected tab controls and set aria-hidden to false 
  this.$panel.find('#' + $tab.attr('aria-controls')).show().attr('aria-hidden', 'false'); 

} // end init()

// 
// Function switchTabs() is a member function to give focus to a new tab or accordian header. 
// If it's a tab panel, the currently displayed panel is hidden and the panel associated with the new tab 
// is displayed. 
// 
// @param ($curTab obj) $curTab is the jQuery object of the currently selected tab 
// 
// @param ($newTab obj) $newTab is the jQuery object of new tab to switch to 
// 
// @return N/A 
// 
tabpanel.prototype.switchTabs = function($curTab, $newTab) { 

  // Remove the highlighting from the current tab 
  $curTab.removeClass('selected focus'); 

  // remove tab from the tab order and update its aria-selected attribute 
  $curTab.attr('tabindex', '-1').attr('aria-selected', 'false'); 

   
  // Highlight the new tab and update its aria-selected attribute 
  $newTab.addClass('selected').attr('aria-selected', 'true'); 

  // If this is a tab panel, swap displayed tabs 
  if (this.accordian == false) { 
    // hide the current tab panel and set aria-hidden to true 
    this.$panel.find('#' + $curTab.attr('aria-controls')).hide().attr('aria-hidden', 'true'); 

      // update the aria-expanded attribute for the old tab 
      $curTab.attr('aria-expanded', 'false'); 

    // show the new tab panel and set aria-hidden to false 
    this.$panel.find('#' + $newTab.attr('aria-controls')).show().attr('aria-hidden', 'false'); 

      // update the aria-expanded attribute for the new tab 
      $newTab.attr('aria-expanded', 'true'); 

    // get new list of focusable elements 
    this.$focusable.length = 0; 
          this.$panels.find(':focusable'); 
  } 

  // Make new tab navigable 
  $newTab.attr('tabindex', '0'); 

  // give the new tab focus 
  $newTab.focus(); 

} // end switchTabs() 

// 
// Function togglePanel() is a member function to display or hide the panel 
// associated with an accordian header. Function also binds a keydown handler to the focusable items 
// in the panel when expanding and unbinds the handlers when collapsing. 
// 
// @param ($tab obj) $tab is the jQuery object of the currently selected tab 
// 
// @return N/A 
// 
tabpanel.prototype.togglePanel = function($tab) { 

  $panel = this.$panel.find('#' + $tab.attr('aria-controls')); 

  if ($panel.attr('aria-hidden') == 'true') { 
    $panel.attr('aria-hidden', 'false'); 
    $panel.slideDown(100);
    $tab.addClass('expanded').removeClass('collapsed'); 
    //$tab.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/expanded.gif').attr('alt', 'expanded');

      // update the aria-expanded attribute 
      $tab.attr('aria-expanded', 'true'); 
  } 
  else { 
    $panel.attr('aria-hidden', 'true'); 
    $panel.slideUp(100); 
    $tab.addClass('collapsed').removeClass('expanded');
    //$tab.find('img').attr('src', 'http://www.oaa-accessibility.org/media/examples/images/contracted.gif').attr('alt', 'collapsed'); 

      // update the aria-expanded attribute 
      $tab.attr('aria-expanded', 'false'); 
  } 

} // end togglePanel()  


// 
// Function bindHandlers() is a member function to bind event handlers for the tabs 
// 
// @return N/A 
// 
tabpanel.prototype.bindHandlers = function() { 

  var thisObj = this; // Store the this pointer for reference 

  ////////////////////////////// 
  // Bind handlers for the tabs / accordian headers 

  // bind a tab keydown handler 
  this.$tabs.keydown(function(e) { 
    return thisObj.handleTabKeyDown(jq(this), e); 
  }); 

  // bind a tab keypress handler 
  this.$tabs.keypress(function(e) { 
    return thisObj.handleTabKeyPress(jq(this), e); 
  }); 

  // bind a tab click handler 
  this.$tabs.click(function(e) { 
    return thisObj.handleTabClick(jq(this), e); 
  }); 

  // bind a tab focus handler 
  this.$tabs.focus(function(e) { 
    return thisObj.handleTabFocus(jq(this), e); 
  }); 

  // bind a tab blur handler 
  this.$tabs.blur(function(e) { 
   return thisObj.handleTabBlur(jq(this), e); 
  }); 

  ///////////////////////////// 
  // Bind handlers for the panels 
   
  // bind a keydown handlers for the panel focusable elements 
  this.$panels.keydown(function(e) { 
    return thisObj.handlePanelKeyDown(jq(this), e); 
  }); 

  // bind a keypress handler for the panel 
  this.$panels.keypress(function(e) { 
    return thisObj.handlePanelKeyPress(jq(this), e); 
  }); 

   // bind a panel click handler 
  this.$panels.click(function(e) { 
    return thisObj.handlePanelClick(jq(this), e); 
  }); 

} // end bindHandlers() 

// 
// Function handleTabKeyDown() is a member function to process keydown events for a tab 
// 
// @param ($tab obj) $tab is the jquery object of the tab being processed 
// 
// @param (e obj) e is the associated event object 
// 
// @return (boolean) Returns true if propagating; false if consuming event 
// 
tabpanel.prototype.handleTabKeyDown = function($tab, e) { 

  if (e.altKey) { 
    // do nothing 
    return true; 
  } 

  switch (e.keyCode) { 
    case this.keys.enter: 
    case this.keys.space: { 

      // Only process if this is an accordian widget 
      if (this.accordian == true) { 
        // display or collapse the panel 
        this.togglePanel($tab); 

        e.stopPropagation(); 
        return false; 
      } 

      return true; 
    } 
    case this.keys.left: 
    case this.keys.up: { 

      var thisObj = this; 
      var $prevTab; // holds jQuery object of tab from previous pass 
      var $newTab; // the new tab to switch to 

      if (e.ctrlKey) { 
        // Ctrl+arrow moves focus from panel content to the open 
        // tab/accordian header. 
      } 
      else { 
        var curNdx = this.$tabs.index($tab); 

        if (curNdx == 0) { 
          // tab is the first one: 
          // set newTab to last tab 
          $newTab = this.$tabs.last(); 
        } 
        else { 
          // set newTab to previous 
          $newTab = this.$tabs.eq(curNdx - 1); 
        } 

        // switch to the new tab 
        this.switchTabs($tab, $newTab); 
      } 

      e.stopPropagation(); 
      return false; 
    } 
    case this.keys.right: 
    case this.keys.down: { 

      var thisObj = this; 
      var foundTab = false; // set to true when current tab found in array 
      var $newTab; // the new tab to switch to 

      var curNdx = this.$tabs.index($tab); 

      if (curNdx == this.$tabs.length-1) { 
        // tab is the last one: 
        // set newTab to first tab 
        $newTab = this.$tabs.first(); 
      } 
      else { 
        // set newTab to next tab 
        $newTab = this.$tabs.eq(curNdx + 1); 
      } 

      // switch to the new tab 
      this.switchTabs($tab, $newTab); 

      e.stopPropagation(); 
      return false; 
    } 
    case this.keys.home: { 

      // switch to the first tab 
      this.switchTabs($tab, this.$tabs.first()); 

      e.stopPropagation(); 
      return false; 
    } 
    case this.keys.end: { 

      // switch to the last tab 
      this.switchTabs($tab, this.$tabs.last()); 

      e.stopPropagation(); 
      return false; 
    } 
  } 
} // end handleTabKeyDown() 

// 
// Function handleTabKeyPress() is a member function to process keypress events for a tab. 
// 
// 
// @param ($tab obj) $tab is the jquery object of the tab being processed 
// 
// @param (e obj) e is the associated event object 
// 
// @return (boolean) Returns true if propagating; false if consuming event 
// 
tabpanel.prototype.handleTabKeyPress = function($tab, e) { 

  if (e.altKey) { 
    // do nothing 
    return true; 
  } 

  switch (e.keyCode) { 
    case this.keys.enter: 
    case this.keys.space: 
    case this.keys.left: 
    case this.keys.up: 
    case this.keys.right: 
    case this.keys.down: 
    case this.keys.home: 
    case this.keys.end: { 
      e.stopPropagation(); 
      return false; 
    } 
    case this.keys.pageup: 
    case this.keys.pagedown: { 

      // The tab keypress handler must consume pageup and pagedown 
      // keypresses to prevent Firefox from switching tabs 
      // on ctrl+pageup and ctrl+pagedown 

      if (!e.ctrlKey) { 
        return true; 
      } 

      e.stopPropagation(); 
      return false; 
    } 
  } 

  return true; 

} // end handleTabKeyPress() 



// 
// Function handleTabClick() is a member function to process click events for tabs 
// 
// @param ($tab object) $tab is the jQuery object of the tab being processed 
// 
// @param (e object) e is the associated event object 
// 
// @return (boolean) returns false 
// 
tabpanel.prototype.handleTabClick = function($tab, e) { 

  // make clicked tab navigable 
  $tab.attr('tabindex', '0').attr('aria-selected', 'true').addClass('selected'); 

  // remove all tabs from the tab order and update their aria-selected attribute 
  this.$tabs.not($tab).attr('tabindex', '-1').attr('aria-selected', 'false').removeClass('selected'); 

  // Expand the new panel 
  this.togglePanel($tab); 

  e.stopPropagation(); 
  return false; 

} // end handleTabClick() 

// 
// Function handleTabFocus() is a member function to process focus events for tabs 
// 
// @param ($tab object) $tab is the jQuery object of the tab being processed 
// 
// @param (e object) e is the associated event object 
// 
// @return (boolean) returns true 
// 
tabpanel.prototype.handleTabFocus = function($tab, e) { 

  // Add the focus class to the tab 
  $tab.addClass('focus'); 

  return true; 

} // end handleTabFocus() 

// 
// Function handleTabBlur() is a member function to process blur events for tabs 
// 
// @param ($tab object) $tab is the jQuery object of the tab being processed 
// 
// @param (e object) e is the associated event object 
// 
// @return (boolean) returns true 
// 
tabpanel.prototype.handleTabBlur = function($tab, e) { 

  // Remove the focus class to the tab 
  $tab.removeClass('focus'); 

  return true; 

} // end handleTabBlur() 

// 
// Function handlePanelKeyDown() is a member function to process keydown events for a panel 
// 
// @param ($panel obj) $panel is the jquery object of the panel being processed 
// 
// @param (e obj) e is the associated event object 
// 
// @return (boolean) Returns true if propagating; false if consuming event 
// 
tabpanel.prototype.handlePanelKeyDown = function($panel, e) { 

  if (e.altKey) { 
    // do nothing 
    return true; 
  } 

  switch (e.keyCode) { 
    case this.keys.tab: { 
      var $focusable = $panel.find(':focusable'); 
      var curNdx = $focusable.index($(e.target)); 
      var panelNdx = this.$panels.index($panel); 
      var numPanels = this.$panels.length 

      if (e.shiftKey) { 
        // if this is the first focusable item in the panel 
        // find the preceding expanded panel (if any) that has 
        // focusable items and set focus to the last one in that 
        // panel. If there is no preceding panel or no focusable items 
        // do not process. 
        if (curNdx == 0 && panelNdx > 0) { 

          // Iterate through previous panels until we find one that 
          // is expanded and has focusable elements 
          // 
          for (var ndx = panelNdx - 1; ndx >= 0; ndx--) { 

            var $prevPanel = this.$panels.eq(ndx); 
                  var $prevTab = $('#' + $prevPanel.attr('aria-labelledby')); 

            // get the focusable items in the panel 
            $focusable.length = 0; 
            $focusable = $prevPanel.find(':focusable'); 

            if ($focusable.length > 0) { 
              // there are focusable items in the panel. 
              // Set focus to the last item. 
              $focusable.last().focus(); 

                     // reset the aria-selected state of the tabs 
                     this.$tabs.attr('aria-selected', 'false').removeClass('selected'); 

                     // set the associated tab's aria-selected state 
                     $prevTab.attr('aria-selected', 'true').addClass('selected'); 

              e.stopPropagation; 
              return false; 
            } 
          } 
        } 
      } 
      else if (panelNdx < numPanels) { 

        // if this is the last focusable item in the panel 
        // find the nearest following expanded panel (if any) that has 
        // focusable items and set focus to the first one in that 
        // panel. If there is no preceding panel or no focusable items 
        // do not process. 
        if (curNdx == $focusable.length - 1) { 

          // Iterate through following panels until we find one that 
          // is expanded and has focusable elements 
          // 
          for (var ndx = panelNdx + 1; ndx < numPanels; ndx++) { 

            var $nextPanel = this.$panels.eq(ndx); 
                  var $nextTab = $('#' + $nextPanel.attr('aria-labelledby')); 

            // get the focusable items in the panel 
            $focusable.length = 0; 
            $focusable = $nextPanel.find(':focusable'); 

            if ($focusable.length > 0) { 
              // there are focusable items in the panel. 
              // Set focus to the first item. 
              $focusable.first().focus(); 

                     // reset the aria-selected state of the tabs 
                     this.$tabs.attr('aria-selected', 'false').removeClass('selected'); 

                     // set the associated tab's aria-selected state 
                     $nextTab.attr('aria-selected', 'true').addClass('selected'); 

              e.stopPropagation; 
              return false; 
            } 
          } 
        } 
      } 

      break; 
    } 
    case this.keys.left: 
    case this.keys.up: { 

      if (!e.ctrlKey) { 
        // do not process 
        return true; 
      } 
   
      // get the jQuery object of the tab 
      var $tab = $('#' + $panel.attr('aria-labelledby')); 

      // Move focus to the tab 
      $tab.focus(); 

      e.stopPropagation(); 
      return false; 
    } 
    case this.keys.pageup: { 

      var $newTab; 

      if (!e.ctrlKey) { 
        // do not process 
        return true; 
      } 

      // get the jQuery object of the tab 
      var $tab = this.$tabs.filter('.selected'); 

      // get the index of the tab in the tab list 
      var curNdx = this.$tabs.index($tab); 

      if (curNdx == 0) { 
        // this is the first tab, set focus on the last one 
        $newTab = this.$tabs.last(); 
      } 
      else { 
        // set focus on the previous tab 
        $newTab = this.$tabs.eq(curNdx - 1); 
      } 

      // switch to the new tab 
      this.switchTabs($tab, $newTab); 

      e.stopPropagation(); 
      e.preventDefault(); 
      return false; 
    } 
    case this.keys.pagedown: { 

      var $newTab; 

      if (!e.ctrlKey) { 
        // do not process 
        return true; 
      } 

      // get the jQuery object of the tab 
      var $tab = $('#' + $panel.attr('aria-labelledby')); 

      // get the index of the tab in the tab list 
      var curNdx = this.$tabs.index($tab); 

      if (curNdx == this.$tabs.length-1) { 
        // this is the last tab, set focus on the first one 
        $newTab = this.$tabs.first(); 
      } 
      else { 
        // set focus on the next tab 
        $newTab = this.$tabs.eq(curNdx + 1); 
      } 

      // switch to the new tab 
      this.switchTabs($tab, $newTab); 

      e.stopPropagation(); 
      e.preventDefault(); 
      return false; 
    } 
  } 

  return true; 

} // end handlePanelKeyDown() 

// 
// Function handlePanelKeyPress() is a member function to process keypress events for a panel 
// 
// @param ($panel obj) $panel is the jquery object of the panel being processed 
// 
// @param (e obj) e is the associated event object 
// 
// @return (boolean) Returns true if propagating; false if consuming event 
// 
tabpanel.prototype.handlePanelKeyPress = function($panel, e) { 

  if (e.altKey) { 
    // do nothing 
    return true; 
  } 

  if (e.ctrlKey && (e.keyCode == this.keys.pageup || e.keyCode == this.keys.pagedown)) { 
      e.stopPropagation(); 
      e.preventDefault(); 
      return false; 
  } 

  switch (e.keyCode) { 
    case this.keys.esc: { 
      e.stopPropagation(); 
      e.preventDefault(); 
      return false; 
    } 
  } 

  return true; 

} // end handlePanelKeyPress() 

// 
// Function handlePanelClick() is a member function to process click events for panels 
// 
// @param ($panel object) $panel is the jQuery object of the panel being processed 
// 
// @param (e object) e is the associated event object 
// 
// @return (boolean) returns true 
// 
tabpanel.prototype.handlePanelClick = function($panel, e) { 

   var $tab = $('#' + $panel.attr('aria-labelledby')); 

  // make clicked panel's tab navigable 
  $tab.attr('tabindex', '0').attr('aria-selected', 'true').addClass('selected'); 

  // remove all tabs from the tab order and update their aria-selected attribute 
  this.$tabs.not($tab).attr('tabindex', '-1').attr('aria-selected', 'false').removeClass('selected'); 

  return true; 

} // end handlePanelClick() 

// focusable is a small jQuery extension to add a :focusable selector. It is used to 
// get a list of all focusable elements in a panel. Credit to ajpiano on the jQuery forums. 
// 
jq.extend(jq.expr[':'], { 
  focusable: function(element) { 
    var nodeName = element.nodeName.toLowerCase(); 
    var tabIndex = jq(element).attr('tabindex'); 

    // the element and all of its ancestors must be visible 
    if ((jq(element)[(nodeName == 'area' ? 'parents' : 'closest')](':hidden').length) == true) { 
      return false; 
    } 

    // If tabindex is defined, its value must be greater than 0 
    if (!isNaN(tabIndex) && tabIndex < 0) { 
      return false; 
    } 

    // if the element is a standard form control, it must not be disabled 
    if (/input|select|textarea|button|object/.test(nodeName) == true) { 

             return !element.disabled; 
    } 

    // if the element is a link, href must be defined 
    if ((nodeName == 'a' ||  nodeName == 'area') == true) { 

      return (element.href.length > 0); 
    } 
             
    // this is some other page element that is not normally focusable. 
    return false; 
  } 
}); 
;
jq = jQuery;

//Presente en sistemas y trámites
function startFAQ() {
    jq(".tituloFaqSalud").click(function(e) {
		if (!e) var e = window.event
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		e.stopImmediatePropagation();
		
		//jq(".respuestaFaqSalud").hide();
		//jq(".simboloFaq").html("+");
		var wrapper = jq(this).parent().parent().parent();
		var wrapper_class = wrapper.attr('class');

		if (typeof wrapper_class === "undefined" ) {
	        	jq(".simboloFaq").parent().next().hide(300);
		        var x = jq(this).parent().find(".respuestaFaqSalud").css("display");
        		if ( x == "block" ) {
					jq(".simboloFaq").html("+");
	        	    jq(this).next().hide(300);
	        	    jq(".respuestaFaqSalud").hide();
		        } else {
        		    jq(this).find(".simboloFaq").html("-");
		            jq(this).next().show(300);
        		}
		} else {
			if ( wrapper_class.split(' ')[0] == "subpagina-faq" ) {
				if ( wrapper.find(".respuestaFaqSalud").is(":visible") === true ) {
					jq(this).find(".simboloFaq").html("+");
					jq(".respuestaFaqSalud").hide(300);
				} else {
					jq(this).find(".simboloFaq").html("-");
					jq(this).next().show(300);
				}
			}
		}
	});
}

jq(document).ready(function() {
    startFAQ();
});
;
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2FindexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    var n, k, t = Object(this),
        len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
};
﻿jq= jQuery;

var idObjCtrl,idResult;
function addparameter(objectDir,parameters){
      for (i in parameters) {
        objectDir[i]=parameters[i]; 
    }
}
function initializeSearch(vista,display,args,parameters,objCtrl,result) {
   var objectDir = {
        view_name: vista,
        view_display_id: display,
        view_args: args
    };
    if (parameters != ""){
        addparameter(objectDir,parameters);
    }
    idObjCtrl = objCtrl;
    idResult = result;
    jq("body").data(idObjCtrl, objectDir);
    runSearch();
}

function runSearch(){
   var objectDir = jq("body").data(idObjCtrl);
    var datos = "";
    for (x in objectDir) {
        datos = datos + x + "=" + objectDir[x] + "&";
    }
  var target = jq(idResult);
  jq.ajax({
        type: 'POST',
        url: Drupal.settings.basePath + 'views/ajax',
        dataType: 'json',
        data: datos,
        success: function(data) {
            var viewHtml = data[1].data;   
            target.html(viewHtml);
            Drupal.attachBehaviors(target);
        },
        error: function(data) {
            target.html('An error occured!');
        }
    });
}

function updateSearch(key, value,id) {

   var objectDir = jq("body").data(idObjCtrl);
    objectDir[key] = value;
    jq("body").data(idObjCtrl, objectDir);
    runSearch(idResult);
    
	if(id!=null){
        jq(".typeSearch").removeClass("seleccionado");
    }
   jq("#"+id+"  option").val(function(idx, val) {
   jq(this).siblings('[value="'+ val +'"]').remove();
});
jq('#'+id+' option')
    .filter(function() {
        return !this.value || jq.trim(this.value).length == 0;
    })
   .remove();

jq('#'+id+' option')
   .first()
  .prop('selected', true);

   jq("#"+id+"> [value=" +value+ "]").attr("selected", "true");

}

jq( document ).ready(function() {
	var seccion_page = jq('.easy-breadcrumb_segment-title').text();
	jq(".centrosv a").on( "click", function() {
		var nombre_material = jq(this).closest( "tr" ).find("td:eq(0)").text()+" ";
		nombre_material += jq(this).closest( "tr" ).find("td:eq(1)").text()+" ";
		nombre_material += jq(this).closest( "tr" ).find("td:eq(2)").text();
		if (typeof(_paq) !== "undefined") {
			_paq.push(['trackEvent', seccion_page, nombre_material, 'Descarga'  ]);
		}
	});
});
;
jq = jQuery;
 
var device = navigator.userAgent;

jq(document).ready(function (){
	if (device.match(/Iphone/i)|| device.match(/Ipod/i)|| device.match(/Android/i)|| device.match(/J2ME/i)|| device.match(/BlackBerry/i)|| device.match(/iPhone|iPad|iPod/i)|| device.match(/Opera Mini/i)|| device.match(/IEMobile/i)|| device.match(/Mobile/i)|| device.match(/Windows Phone/i)|| device.match(/windows mobile/i)|| device.match(/windows ce/i)|| device.match(/webOS/i)|| device.match(/palm/i)|| device.match(/bada/i)|| device.match(/series60/i)|| device.match(/nokia/i)|| device.match(/symbian/i)|| device.match(/HTC/i)){ 
		jq('#derechoH').click(function(){
			jq('.backimagen').animate({
	        	width: "hide"
        	});
	        jq('#derechoHT').animate({
	        	width: "show"
        	});
    	});
    	jq('#derechoHT').click(function(){
			location.href= "derechoH";
    	});
	
		jq('#patrones').click(function(){
			jq('.backimagen').animate({
	        	width: "hide"
        	});
	        jq('#patronesT').animate({
	        	width: "show"
        });
    	});
    	jq('#patronesT').click(function(){
			location.href= "patrones";
    	});

		jq('#proveedores').click(function(){
			jq('.backimagen').animate({
	        	width: "hide"
        	});
	        jq('#proveedoresT').animate({
	        	width: "show"
        });
    	});
    	jq('#proveedoresT').click(function(){
			location.href= "proveedores";
    	});

		jq('#profesionales').click(function(){
			jq('.backimagen').animate({
	        	width: "hide"
        	});
	        jq('#profesionalesT').animate({
	        	width: "show"
        });
    	});
    	jq('#profesionalesT').click(function(){
			location.href= "http://201.144.108.20/profesionales/pages/profesionales.html";
    	});

		jq('#prensa').click(function(){
			jq('.backimagen').animate({
	        	width: "hide"
        	});
	        jq('#prensaT').animate({
	        	width: "show"
        });
    	});
    	jq('#prensaT').click(function(){
			location.href= "prensa";
        });

		jq('#salud').click(function(){
			jq('.backimagen').animate({
	        	width: "hide"
        	});
	        jq('#saludT').animate({
	        	width: "show"
        });
    	});
    	jq('#saludT').click(function(){
			location.href= "salud-en-linea";
    	});
	}else{
		
		jq('#derechoH').mouseenter(function(){
	        jq('#derechoHT').animate({
	        	width: "show"
        });
    	});
    	jq('.imagencarrusel').mouseleave(function(){
	        jq('#derechoHT').animate({
	        	width: "hide"
        });
    	});
	
		jq('#derechoHT').click(function(){
			location.href= "derechoH";
		});

		jq('#patrones').mouseenter(function(){
	        jq('#patronesT').animate({
	        	width: "show"
        });
    	});
    	jq('.imagencarrusel').mouseleave(function(){
	        jq('#patronesT').animate({
	        	width: "hide"
        });
    	});
		jq('#patronesT').click(function(){
			location.href= "patrones";
		});

		jq('#proveedores').mouseenter(function(){
	        jq('#proveedoresT').animate({
	        	width: "show"
        });
    	});
    	jq('.imagencarrusel').mouseleave(function(){
	        jq('#proveedoresT').animate({
	        	width: "hide"
        });
    	});
		jq('#proveedoresT').click(function(){
			location.href= "proveedores";
		});

		jq('#profesionales').mouseenter(function(){
	        jq('#profesionalesT').animate({
	        	width: "show"
        });
    	});
    	jq('.imagencarrusel').mouseleave(function(){
	        jq('#profesionalesT').animate({
	        	width: "hide"
        });
    	});
		jq('#profesionalesT').click(function(){
			location.href= "http://201.144.108.20/profesionales/pages/profesionales.html";
		});

		jq('#prensa').mouseenter(function(){
	        jq('#prensaT').animate({
	        	width: "show"
        });
    	});
    	jq('.imagencarrusel').mouseleave(function(){
	        jq('#prensaT').animate({
	        	width: "hide"
        });
    	});
		jq('#prensaT').click(function(){
			location.href= "prensa";
		});

		jq('#salud').mouseenter(function(){
	        jq('#saludT').animate({
	        	width: "show"
        });
    	});
    	jq('.imagencarrusel').mouseleave(function(){
	        jq('#saludT').animate({
	        	width: "hide"
        });
    	});
		jq('#saludT').click(function(){
			location.href= "salud-en-linea";
		});
	}
 
 	jq('#tramites').click(function(){
		jq('.submenu li').css({background: "white"});
		jq(this).css({background: "#c2c3c9"});
		jq('.submenu2').hide();
		jq('#menuT').show();
	});
	jq('#prestaciones').click(function(){
		jq('.submenu li').css({background: "white"});
		jq(this).css({background: "#c2c3c9"});
		jq('.submenu2').hide();
		jq('#menuP').show();
	});
	jq('#servicios').click(function(){
		jq('.submenu li').css({background: "white"});
		jq(this).css({background: "#c2c3c9"});
		jq('.submenu2').hide();
		jq('#menuSe').show();
	});
	jq('#salud').click(function(){
		jq('.submenu li').css({background: "white"});
		jq(this).css({background: "#c2c3c9"});
		jq('.submenu2').hide();
		jq('#menuSa').show();
	});
});

;
/*!
 * jQuery Migrate - v1.2.1 - 2013-05-08
 * https://github.com/jquery/jquery-migrate
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
 */
(function( jQuery, window, undefined ) {
// See http://bugs.jquery.com/ticket/13335
// "use strict";


var warnedAbout = {};

// List of warnings already given; public read only
jQuery.migrateWarnings = [];

// Set to true to prevent console output; migrateWarnings still maintained
// jQuery.migrateMute = false;

// Show a message on the console so devs know we're active
if ( !jQuery.migrateMute && window.console && window.console.log ) {
	window.console.log("JQMIGRATE: Logging is active");
}

// Set to false to disable traces that appear with warnings
if ( jQuery.migrateTrace === undefined ) {
	jQuery.migrateTrace = true;
}

// Forget any warnings we've already given; public
jQuery.migrateReset = function() {
	warnedAbout = {};
	jQuery.migrateWarnings.length = 0;
};

function migrateWarn( msg) {
	var console = window.console;
	if ( !warnedAbout[ msg ] ) {
		warnedAbout[ msg ] = true;
		jQuery.migrateWarnings.push( msg );
		if ( console && console.warn && !jQuery.migrateMute ) {
			console.warn( "JQMIGRATE: " + msg );
			if ( jQuery.migrateTrace && console.trace ) {
				console.trace();
			}
		}
	}
}

function migrateWarnProp( obj, prop, value, msg ) {
	if ( Object.defineProperty ) {
		// On ES5 browsers (non-oldIE), warn if the code tries to get prop;
		// allow property to be overwritten in case some other plugin wants it
		try {
			Object.defineProperty( obj, prop, {
				configurable: true,
				enumerable: true,
				get: function() {
					migrateWarn( msg );
					return value;
				},
				set: function( newValue ) {
					migrateWarn( msg );
					value = newValue;
				}
			});
			return;
		} catch( err ) {
			// IE8 is a dope about Object.defineProperty, can't warn there
		}
	}

	// Non-ES5 (or broken) browser; just set the property
	jQuery._definePropertyBroken = true;
	obj[ prop ] = value;
}

if ( document.compatMode === "BackCompat" ) {
	// jQuery has never supported or tested Quirks Mode
	migrateWarn( "jQuery is not compatible with Quirks Mode" );
}


var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
	oldAttr = jQuery.attr,
	valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
		function() { return null; },
	valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
		function() { return undefined; },
	rnoType = /^(?:input|button)$/i,
	rnoAttrNodeType = /^[238]$/,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	ruseDefault = /^(?:checked|selected)$/i;

// jQuery.attrFn
migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );

jQuery.attr = function( elem, name, value, pass ) {
	var lowerName = name.toLowerCase(),
		nType = elem && elem.nodeType;

	if ( pass ) {
		// Since pass is used internally, we only warn for new jQuery
		// versions where there isn't a pass arg in the formal params
		if ( oldAttr.length < 4 ) {
			migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
		}
		if ( elem && !rnoAttrNodeType.test( nType ) &&
			(attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
			return jQuery( elem )[ name ]( value );
		}
	}

	// Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
	// for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
	if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
		migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
	}

	// Restore boolHook for boolean property/attribute synchronization
	if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
		jQuery.attrHooks[ lowerName ] = {
			get: function( elem, name ) {
				// Align boolean attributes with corresponding properties
				// Fall back to attribute presence where some booleans are not supported
				var attrNode,
					property = jQuery.prop( elem, name );
				return property === true || typeof property !== "boolean" &&
					( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

					name.toLowerCase() :
					undefined;
			},
			set: function( elem, value, name ) {
				var propName;
				if ( value === false ) {
					// Remove boolean attributes when set to false
					jQuery.removeAttr( elem, name );
				} else {
					// value is true since we know at this point it's type boolean and not false
					// Set boolean attributes to the same name and set the DOM property
					propName = jQuery.propFix[ name ] || name;
					if ( propName in elem ) {
						// Only set the IDL specifically if it already exists on the element
						elem[ propName ] = true;
					}

					elem.setAttribute( name, name.toLowerCase() );
				}
				return name;
			}
		};

		// Warn only for attributes that can remain distinct from their properties post-1.9
		if ( ruseDefault.test( lowerName ) ) {
			migrateWarn( "jQuery.fn.attr('" + lowerName + "') may use property instead of attribute" );
		}
	}

	return oldAttr.call( jQuery, elem, name, value );
};

// attrHooks: value
jQuery.attrHooks.value = {
	get: function( elem, name ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrGet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value') no longer gets properties");
		}
		return name in elem ?
			elem.value :
			null;
	},
	set: function( elem, value ) {
		var nodeName = ( elem.nodeName || "" ).toLowerCase();
		if ( nodeName === "button" ) {
			return valueAttrSet.apply( this, arguments );
		}
		if ( nodeName !== "input" && nodeName !== "option" ) {
			migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
		}
		// Does not return so that setAttribute is also used
		elem.value = value;
	}
};


var matched, browser,
	oldInit = jQuery.fn.init,
	oldParseJSON = jQuery.parseJSON,
	// Note: XSS check is done below after string is trimmed
	rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;

// $(html) "looks like html" rule change
jQuery.fn.init = function( selector, context, rootjQuery ) {
	var match;

	if ( selector && typeof selector === "string" && !jQuery.isPlainObject( context ) &&
			(match = rquickExpr.exec( jQuery.trim( selector ) )) && match[ 0 ] ) {
		// This is an HTML string according to the "old" rules; is it still?
		if ( selector.charAt( 0 ) !== "<" ) {
			migrateWarn("$(html) HTML strings must start with '<' character");
		}
		if ( match[ 3 ] ) {
			migrateWarn("$(html) HTML text after last tag is ignored");
		}
		// Consistently reject any HTML-like string starting with a hash (#9521)
		// Note that this may break jQuery 1.6.x code that otherwise would work.
		if ( match[ 0 ].charAt( 0 ) === "#" ) {
			migrateWarn("HTML string cannot start with a '#' character");
			jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
		}
		// Now process using loose rules; let pre-1.8 play too
		if ( context && context.context ) {
			// jQuery object as context; parseHTML expects a DOM object
			context = context.context;
		}
		if ( jQuery.parseHTML ) {
			return oldInit.call( this, jQuery.parseHTML( match[ 2 ], context, true ),
					context, rootjQuery );
		}
	}
	return oldInit.apply( this, arguments );
};
jQuery.fn.init.prototype = jQuery.fn;

// Let $.parseJSON(falsy_value) return null
jQuery.parseJSON = function( json ) {
	if ( !json && json !== null ) {
		migrateWarn("jQuery.parseJSON requires a valid JSON string");
		return null;
	}
	return oldParseJSON.apply( this, arguments );
};

jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

// Don't clobber any existing jQuery.browser in case it's different
if ( !jQuery.browser ) {
	matched = jQuery.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	jQuery.browser = browser;
}

// Warn if the code tries to get jQuery.browser
migrateWarnProp( jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated" );

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	migrateWarn( "jQuery.sub() is deprecated" );
	return jQuerySub;
};


// Ensure that $.ajax gets the new parseJSON defined in core.js
jQuery.ajaxSetup({
	converters: {
		"text json": jQuery.parseJSON
	}
});


var oldFnData = jQuery.fn.data;

jQuery.fn.data = function( name ) {
	var ret, evt,
		elem = this[0];

	// Handles 1.7 which has this behavior and 1.8 which doesn't
	if ( elem && name === "events" && arguments.length === 1 ) {
		ret = jQuery.data( elem, name );
		evt = jQuery._data( elem, name );
		if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
			migrateWarn("Use of jQuery.fn.data('events') is deprecated");
			return evt;
		}
	}
	return oldFnData.apply( this, arguments );
};


var rscriptType = /\/(java|ecma)script/i,
	oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;

jQuery.fn.andSelf = function() {
	migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
	return oldSelf.apply( this, arguments );
};

// Since jQuery.clean is used internally on older versions, we only shim if it's missing
if ( !jQuery.clean ) {
	jQuery.clean = function( elems, context, fragment, scripts ) {
		// Set context per 1.8 logic
		context = context || document;
		context = !context.nodeType && context[0] || context;
		context = context.ownerDocument || context;

		migrateWarn("jQuery.clean() is deprecated");

		var i, elem, handleScript, jsTags,
			ret = [];

		jQuery.merge( ret, jQuery.buildFragment( elems, context ).childNodes );

		// Complex logic lifted directly from jQuery 1.8
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	};
}

var eventAdd = jQuery.event.add,
	eventRemove = jQuery.event.remove,
	eventTrigger = jQuery.event.trigger,
	oldToggle = jQuery.fn.toggle,
	oldLive = jQuery.fn.live,
	oldDie = jQuery.fn.die,
	ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
	rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	hoverHack = function( events ) {
		if ( typeof( events ) !== "string" || jQuery.event.special.hover ) {
			return events;
		}
		if ( rhoverHack.test( events ) ) {
			migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
		}
		return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

// Event props removed in 1.9, put them back if needed; no practical way to warn them
if ( jQuery.event.props && jQuery.event.props[ 0 ] !== "attrChange" ) {
	jQuery.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
}

// Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
if ( jQuery.event.dispatch ) {
	migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );
}

// Support for 'hover' pseudo-event and ajax event warnings
jQuery.event.add = function( elem, types, handler, data, selector ){
	if ( elem !== document && rajaxEvent.test( types ) ) {
		migrateWarn( "AJAX events should be attached to document: " + types );
	}
	eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
};
jQuery.event.remove = function( elem, types, handler, selector, mappedTypes ){
	eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
};

jQuery.fn.error = function() {
	var args = Array.prototype.slice.call( arguments, 0);
	migrateWarn("jQuery.fn.error() is deprecated");
	args.splice( 0, 0, "error" );
	if ( arguments.length ) {
		return this.bind.apply( this, args );
	}
	// error event should not bubble to window, although it does pre-1.7
	this.triggerHandler.apply( this, args );
	return this;
};

jQuery.fn.toggle = function( fn, fn2 ) {

	// Don't mess with animation or css toggles
	if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
		return oldToggle.apply( this, arguments );
	}
	migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

	// Save reference to arguments for access in closure
	var args = arguments,
		guid = fn.guid || jQuery.guid++,
		i = 0,
		toggler = function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		};

	// link all the functions, so any of them can unbind this click handler
	toggler.guid = guid;
	while ( i < args.length ) {
		args[ i++ ].guid = guid;
	}

	return this.click( toggler );
};

jQuery.fn.live = function( types, data, fn ) {
	migrateWarn("jQuery.fn.live() is deprecated");
	if ( oldLive ) {
		return oldLive.apply( this, arguments );
	}
	jQuery( this.context ).on( types, this.selector, data, fn );
	return this;
};

jQuery.fn.die = function( types, fn ) {
	migrateWarn("jQuery.fn.die() is deprecated");
	if ( oldDie ) {
		return oldDie.apply( this, arguments );
	}
	jQuery( this.context ).off( types, this.selector || "**", fn );
	return this;
};

// Turn global events into document-triggered events
jQuery.event.trigger = function( event, data, elem, onlyHandlers  ){
	if ( !elem && !rajaxEvent.test( event ) ) {
		migrateWarn( "Global events are undocumented and deprecated" );
	}
	return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
};
jQuery.each( ajaxEvents.split("|"),
	function( _, name ) {
		jQuery.event.special[ name ] = {
			setup: function() {
				var elem = this;

				// The document needs no shimming; must be !== for oldIE
				if ( elem !== document ) {
					jQuery.event.add( document, name + "." + jQuery.guid, function() {
						jQuery.event.trigger( name, null, elem, true );
					});
					jQuery._data( this, name, jQuery.guid++ );
				}
				return false;
			},
			teardown: function() {
				if ( this !== document ) {
					jQuery.event.remove( document, name + "." + jQuery._data( this, name ) );
				}
				return false;
			}
		};
	}
);


})( jQuery, window );
;
/*
 * jQuery Tooltip plugin 1.3
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.tooltip.js 5741 2008-06-21 15:22:16Z joern.zaefferer $
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 
;(function($) {
	
		// the tooltip element
	var helper = {},
		// the current tooltipped element
		current,
		// the title of the current element, used for restoring
		title,
		// timeout id for delayed tooltips
		tID,
		// IE 5.5 or 6
		IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
		// flag for mouse tracking
		track = false;
	
	$.tooltip = {
		blocked: false,
		defaults: {
			delay: 200,
			fade: false,
			showURL: true,
			extraClass: "",
			top: 15,
			left: 15,
			id: "tooltip"
		},
		block: function() {
			$.tooltip.blocked = !$.tooltip.blocked;
		}
	};
	
	$.fn.extend({
		tooltip: function(settings) {
			settings = $.extend({}, $.tooltip.defaults, settings);
			createHelper(settings);
			return this.each(function() {
					$.data(this, "tooltip", settings);
					this.tOpacity = helper.parent.css("opacity");
					// copy tooltip into its own expando and remove the title
					this.tooltipText = this.title;
					$(this).removeAttr("title");
					// also remove alt attribute to prevent default tooltip in IE
					this.alt = "";
				})
				.mouseover(save)
				.mouseout(hide)
				.click(hide);
		},
		fixPNG: IE ? function() {
			return this.each(function () {
				var image = $(this).css('backgroundImage');
				if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
					image = RegExp.$1;
					$(this).css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					}).each(function () {
						var position = $(this).css('position');
						if (position != 'absolute' && position != 'relative')
							$(this).css('position', 'relative');
					});
				}
			});
		} : function() { return this; },
		unfixPNG: IE ? function() {
			return this.each(function () {
				$(this).css({'filter': '', backgroundImage: ''});
			});
		} : function() { return this; },
		hideWhenEmpty: function() {
			return this.each(function() {
				$(this)[ $(this).html() ? "show" : "hide" ]();
			});
		},
		url: function() {
			return this.attr('href') || this.attr('src');
		}
	});
	
	function createHelper(settings) {
		// there can be only one tooltip helper
		if( helper.parent )
			return;
		// create the helper, h3 for title, div for url
		helper.parent = $('<div id="' + settings.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>')
			// add to document
			.appendTo(document.body)
			// hide it at first
			.hide();
			
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			helper.parent.bgiframe();
		
		// save references to title and url elements
		helper.title = $('h3', helper.parent);
		helper.body = $('div.body', helper.parent);
		helper.url = $('div.url', helper.parent);
	}
	
	function settings(element) {
		return $.data(element, "tooltip");
	}
	
	// main event handler to start showing tooltips
	function handle(event) {
		// show helper, either with timeout or on instant
		if( settings(this).delay )
			tID = setTimeout(show, settings(this).delay);
		else
			show();
		
		// if selected, update the helper position when the mouse moves
		track = !!settings(this).track;
		$(document.body).bind('mousemove', update);
			
		// update at least once
		update(event);
	}
	
	// save elements title before the tooltip is displayed
	function save() {
		// if this is the current source, or it has no title (occurs with click event), stop
		if ( $.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler) )
			return;

		// save current
		current = this;
		title = this.tooltipText;
		
		if ( settings(this).bodyHandler ) {
			helper.title.hide();
			var bodyContent = settings(this).bodyHandler.call(this);
			if (bodyContent.nodeType || bodyContent.jquery) {
				helper.body.empty().append(bodyContent)
			} else {
				helper.body.html( bodyContent );
			}
			helper.body.show();
		} else if ( settings(this).showBody ) {
			var parts = title.split(settings(this).showBody);
			helper.title.html(parts.shift()).show();
			helper.body.empty();
			for(var i = 0, part; (part = parts[i]); i++) {
				if(i > 0)
					helper.body.append("<br/>");
				helper.body.append(part);
			}
			helper.body.hideWhenEmpty();
		} else {
			helper.title.html(title).show();
			helper.body.hide();
		}
		
		// if element has href or src, add and show it, otherwise hide it
		if( settings(this).showURL && $(this).url() )
			helper.url.html( $(this).url().replace('http://', '') ).show();
		else 
			helper.url.hide();
		
		// add an optional class for this tip
		helper.parent.addClass(settings(this).extraClass);

		// fix PNG background for IE
		if (settings(this).fixPNG )
			helper.parent.fixPNG();
			
		handle.apply(this, arguments);
	}
	
	// delete timeout and show helper
	function show() {
		tID = null;
		if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
			if (helper.parent.is(":animated"))
				helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity);
			else
				helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
		} else {
			helper.parent.show();
		}
		update();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		if($.tooltip.blocked)
			return;
		
		if (event && event.target.tagName == "OPTION") {
			return;
		}
		
		// stop updating when tracking is disabled and the tooltip is visible
		if ( !track && helper.parent.is(":visible")) {
			$(document.body).unbind('mousemove', update)
		}
		
		// if no current element is available, remove this listener
		if( current == null ) {
			$(document.body).unbind('mousemove', update);
			return;	
		}
		
		// remove position helper classes
		helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
		
		var left = helper.parent[0].offsetLeft;
		var top = helper.parent[0].offsetTop;
		if (event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + settings(current).left;
			top = event.pageY + settings(current).top;
			var right='auto';
			if (settings(current).positionLeft) {
				right = $(window).width() - left;
				left = 'auto';
			}
			helper.parent.css({
				left: left,
				right: right,
				top: top
			});
		}
		
		var v = viewport(),
			h = helper.parent[0];
		// check horizontal position
		if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20 + settings(current).left;
			helper.parent.css({left: left + 'px'}).addClass("viewport-right");
		}
		// check vertical position
		if (v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20 + settings(current).top;
			helper.parent.css({top: top + 'px'}).addClass("viewport-bottom");
		}
	}
	
	function viewport() {
		return {
			x: $(window).scrollLeft(),
			y: $(window).scrollTop(),
			cx: $(window).width(),
			cy: $(window).height()
		};
	}
	
	// hide helper and restore added classes and the title
	function hide(event) {
		if($.tooltip.blocked)
			return;
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		
		var tsettings = settings(this);
		function complete() {
			helper.parent.removeClass( tsettings.extraClass ).hide().css("opacity", "");
		}
		if ((!IE || !$.fn.bgiframe) && tsettings.fade) {
			if (helper.parent.is(':animated'))
				helper.parent.stop().fadeTo(tsettings.fade, 0, complete);
			else
				helper.parent.stop().fadeOut(tsettings.fade, complete);
		} else
			complete();
		
		if( settings(this).fixPNG )
			helper.parent.unfixPNG();
	}
	
})(jQuery);
;
//KEYBOARD IMPROVENT MENU

  jq(document).ready(function() {
	
	jq(".dropdown-toggle").click(function( event ) {
		 event.preventDefault();
	});


setTimeout(function(){
jq('body').find('img:not([alt])').attr('alt', '');
jq('.gsc-branding-img').attr('alt','Google CSE');
jq('#holder').find('div').attr('tabindex','0');
jq('body').find('img').removeAttr('title');
jq('body').find('a').removeAttr('title');
jq('body').find('a').removeAttr('alt');
jq('.listaTramites').attr('tabindex','0');
jq('#tooltip').find('h3').remove();
jq('.textoMenuSub').attr('tabindex','0');
jq('#textoOpcionMenu').attr('tabindex','0');
jq('#rss').remove();
jq('.imssNumeros').attr('tabindex','0');
jq('#textoCentro').removeAttr('tabindex');
jq('.flex-control-nav').attr('tabindex','0');
jq('.flex-pause').attr('tabindex','0');
jq('.flex-control-nav').find('a').attr('tabindex', '0');
jq('.view-v-ficha-faq').removeAttr('tabindex');
//jq('.textoMenuSub').attr('tabindex','0');
}, 300);


setTimeout(function(){
jq('.gsc-search-box').attr('role','presentation');
jq('#gsc-i-id1').removeAttr('title');
jq('.gsc-search-button').removeAttr('title');
jq('.textoMenuSub').attr('tabindex','0');

},3000);

jq('.mlink').click(function( event ) {

var href = jq(this).attr('href');
//$(location).attr('href', href);
window.location.href =href;
});



jq('#holder div').bind('keypress', function(e) {
alert('this.id');
if(e.keyCode==13){
       jq(this).click();
        }

  return false;
});

jq('.flex-control-nav a').bind('keypress', function(e) {
if(e.keyCode==13){
       jq(this).click();
        }

  return false;
});

jq('.textoMenuSub').bind('keypress', function(e) {
if(e.keyCode==13){
	alert('this.example');
       jq(this).click();
        }

  return false;
});




});
;
