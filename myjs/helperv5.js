    String.prototype.replaceAll = function(search, replacement) {
    		var target = this;
    		return target.split(search).join(replacement);
		 };
      
        if (!String.prototype.trim) {
          String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
          };
        }

       function watchSourceArea() {
		var editable = document.getElementById("sourceareapre");
		editable.addEventListener('input', function() {
			var htmlString = document.getElementById("sourceareapre").innerHTML;
			var stripedHtml = $("<div>").html(htmlString).text();
			document.getElementById("sourceareapre").textContent = stripedHtml;
		});
	  }
      
      var oldlineNumber = "";
      function validateJSON() {
		$(oldlineNumber).attr('class', 'lineno');
        var inputJSON = document.getElementById("sourceareapre").innerText;
		//document.getElementById("sourceareapre").innerHTML = inputJSON;
		
	    try {
	      var jsonObj = JSON.parse(inputJSON);
          
		  var jsonPretty = JSON.stringify(jsonObj, null, '  ');
			
          inputJSON = syntaxHighlight(jsonPretty);
          } catch(e){ 
	        var indx = e.message.indexOf("position");
                var lineno = parseInt(e.message.substring((indx+8), e.message.length)); 
                var tempString = inputJSON.substring(0, lineno);
                var lineNumber = tempString.split('\n').length;
		   
		   var pointedInput = inputJSON.substring(0, lineno);
		   pointedInput = pointedInput + "<span style='color:red;background:green;'>" +inputJSON.substring(lineno, lineno+1) + "</span>";
		   pointedInput = pointedInput + inputJSON.substring(lineno+1, inputJSON.length);
		   
		   var jsoninputarray = pointedInput.split('\n');
		   
		   var htmlInput = "";
		   for(var i=0;i<jsoninputarray.length;i++) {
			   if(i>0) {
				   htmlInput = htmlInput + "\n";
			   }
			   if (i==lineNumber-1) {
				  htmlInput = htmlInput +  "<span style='background: yellow;color:black;'>" + jsoninputarray[i] + "</span>";
			   }
			   else {
				  htmlInput = htmlInput +  jsoninputarray[i];
			   }
		   }
		   document.getElementById("sourceareapre").innerHTML = htmlInput;
		   oldlineNumber = '#linesourcearea'+lineNumber;
		   inputJSON = e;


	     }
		 
	     document.getElementById("targetareapre").innerHTML=inputJSON;
	  }
      
      function minifyJSON() {
	    $(oldlineNumber).attr('class', 'lineno');
        
        var inputJSON = document.getElementById("sourceareapre").innerText;
           
	    try {
	 	     	var jsonObj = JSON.parse(inputJSON);
     		  	var jsonPretty = JSON.stringify(jsonObj, null, 0);
	      		inputJSON = syntaxHighlight(jsonPretty);
         } catch(e){ 
	       var indx = e.message.indexOf("position");
           var lineno = parseInt(e.message.substring((indx+8), e.message.length)); 
           var tempString = inputJSON.substring(0, lineno);
           var lineNumber = tempString.split('\n').length;
           oldlineNumber = '#linesourcearea'+lineNumber;
           $(oldlineNumber).attr('class', 'lineno lineselect');
           //alert('Line:'+document.getElementById('linesourcearea'+lineNumber).innerHTML);
           inputJSON = e;
	     }
	     document.getElementById("targetareapre").innerHTML=(inputJSON);
	  }
      
     function validateXML() {
	    $(oldlineNumber).attr('class', 'lineno');
        var inputXML = document.getElementById("sourceareapre").innerText;
        try {
          var xmlDoc = $.parseXML( inputXML );
          //var inputXMLaligned = xmlvalidator(inputXML);
          var inputXMLaligned = simplealign(inputXML);
          //var inputXMLPretty = prettifyXml(inputXMLaligned) ;
          inputXML = escapeXml(inputXMLaligned);
        } catch(e){ 
             inputXML = "Invalid XML to Parse";
	    }
	    document.getElementById("targetareapre").innerHTML=inputXML;
	  }
      
      function simplealign(xmlstring) {
   		xmlstring = xmlminify(xmlstring);
        xmlstring = xmlstring.replaceAll("><", ">\r\n<");
        return xmlstring;
      }
      
      
      function showXMLAsTree() {
	    $(oldlineNumber).attr('class', 'lineno');
        var inputXML = document.getElementById("sourceareapre").innerText;
        try {
          //var parser = new DOMParser();
		  //var xmlDoc = parser.parseFromString(inputXML,"text/xml");
           $.parseXML( inputXML );
          inputXML = xmlvalidator(inputXML);
          var inputXMLPretty = prettifyXml(inputXML) ;
          inputXML = escapeXml(inputXMLPretty);
          
          LoadXMLString('targetareapre', inputXML);
          
          } catch(e){ 
             inputXML = "Invalid XML to Parse";
	         document.getElementById("targetareapre").innerHTML=inputXML;
          }
	    }
        
      
      function minifyXML() {
	    $(oldlineNumber).attr('class', 'lineno');
        var inputXML = document.getElementById("sourceareapre").innerText;
        try {
          var parser = new DOMParser();
		  var xmlDoc = parser.parseFromString(inputXML,"text/xml");
          xmlDoc = $.parseXML( inputXML )
		  var inputXMLPretty = prettifyXml(inputXML) ;
          
          inputXML = xmlminify(inputXML);
          inputXML = escapeXml(inputXML);
          
          } catch(e){ 
           inputXML = "Invalid XML to minify";
	     }
	     document.getElementById("targetareapre").innerHTML=inputXML;
	  }
      
      
      function syntaxHighlight(json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 	               function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }
      
       function prettifyXml(sourceXml)
      {
          var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');
          var xsltDoc = new DOMParser().parseFromString([
            // describes how we want to modify the XML - indent everything
            '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
            '<xsl:output omit-xml-declaration="yes" indent="yes"/>',
            '<xsl:template match="node()|@*">',
            '  <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
            '</xsl:template>',
            '</xsl:stylesheet>',
          ].join('\n'), 'application/xml');

          var xsltProcessor = new XSLTProcessor();    
          xsltProcessor.importStylesheet(xsltDoc);
          var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
          var resultXml = new XMLSerializer().serializeToString(resultDoc);
          //alert(resultXml);
           return resultXml;
          
      }
      
      function xmlminify(text) {
			var str =  text.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"")
					.replace(/[ \r\n\t]{1,}xmlns/g, ' xmlns');
			return  str.replace(/>\s{0,}</g,"><");
	  }
      
      function xmlvalidator(text) {
			var ar = text.replace(/>\s{0,}</g,"><")
						 .replace(/</g,"~::~<")
						 .replace(/\s*xmlns\:/g,"~::~xmlns:")
						 .replace(/\s*xmlns\=/g,"~::~xmlns=")
						 .split('~::~'),
				len = ar.length,
				inComment = false,
				deep = 0,
				str = '',
				ix = 0;
				for(ix=0;ix<len;ix++) {
				// start comment or <![CDATA[...]]> or <!DOCTYPE //
				if(ar[ix].search(/<!/) > -1) {
					str += this.shift[deep]+ar[ix];
					inComment = true;
					// end comment  or <![CDATA[...]]> //
					if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1 ) {
						inComment = false;
					}
				} else
				// end comment  or <![CDATA[...]]> //
				if(ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
					str += ar[ix];
					inComment = false;
				} else
				// <elm></elm> //
				if( /^<\w/.exec(ar[ix-1]) && /^<\/\w/.exec(ar[ix]) &&
					/^<[\w:\-\.\,]+/.exec(ar[ix-1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace('/','')) {
					str += ar[ix];
					if(!inComment) deep--;
				} else
				 // <elm> //
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) == -1 && ar[ix].search(/\/>/) == -1 ) {
					str = !inComment ? str += this.shift[deep++]+ar[ix] : str += ar[ix];
				} else
				 // <elm>...</elm> //
				if(ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
					str = !inComment ? str += this.shift[deep]+ar[ix] : str += ar[ix];
				} else
				// </elm> //
				if(ar[ix].search(/<\//) > -1) {
					str = !inComment ? str += this.shift[--deep]+ar[ix] : str += ar[ix];
				} else
				// <elm/> //
				if(ar[ix].search(/\/>/) > -1 ) {
					str = !inComment ? str += this.shift[deep]+ar[ix] : str += ar[ix];
				} else
				// <? xml ... ?> //
				if(ar[ix].search(/<\?/) > -1) {
					str += this.shift[deep]+ar[ix];
				} else
				// xmlns //
				if( ar[ix].search(/xmlns\:/) > -1  || ar[ix].search(/xmlns\=/) > -1) {
					str += this.shift[deep]+ar[ix];
				}
				else {
					str += ar[ix];
				}
			}
			return  (str[0] == '\n') ? str.slice(1) : str;
		}
      
              // Changes XML to JSON
        function xmlToJson(xml) {

            // Create the return object
            var obj = {};

            if (xml.nodeType == 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType == 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            if (xml.hasChildNodes()) {
                for(var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof(obj[nodeName]) == "undefined") {
                        obj[nodeName] = xmlToJson(item);
                    } else {
                        if (typeof(obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(xmlToJson(item));
                    }
                }
            }
            return obj;
        }
      
      function escapeXml(unsafe) {
          return unsafe.replace(/[<>&'"]/g, function (c) {
              switch (c) {
                  case '<': return '&lt;';
                  case '>': return '&gt;';
                  case '&': return '&amp;';
                  case '\'': return '&apos;';
                  case '"': return '&quot;';
              }
          });
      }