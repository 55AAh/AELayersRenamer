var scriptName = "LayersRenamer";
var scriptVersion = "0.1";

//
// ---------- MINIFIED json2.js ----------
//

// prettier-ignore
// cSpell: disable-next-line
"object"!=typeof JSON&&(JSON={}),function(){"use strict";var gap,indent,meta,rep,rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var n,o,f,u,r,$=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,r=[],"[object Array]"===Object.prototype.toString.apply(i)){for(n=0,u=i.length;n<u;n+=1)r[n]=str(n,i)||"null";return f=0===r.length?"[]":gap?"[\n"+gap+r.join(",\n"+gap)+"\n"+$+"]":"["+r.join(",")+"]",gap=$,f}if(rep&&"object"==typeof rep)for(n=0,u=rep.length;n<u;n+=1)"string"==typeof rep[n]&&(f=str(o=rep[n],i))&&r.push(quote(o)+(gap?": ":":")+f);else for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(f=str(o,i))&&r.push(quote(o)+(gap?": ":":")+f);return f=0===r.length?"{}":gap?"{\n"+gap+r.join(",\n"+gap)+"\n"+$+"}":"{"+r.join(",")+"}",gap=$,f}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,n){var o;if(gap="",indent="","number"==typeof n)for(o=0;o<n;o+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var n,o,f=t[e];if(f&&"object"==typeof f)for(n in f)Object.prototype.hasOwnProperty.call(f,n)&&(void 0!==(o=walk(f,n))?f[n]=o:delete f[n]);return reviver.call(t,e,f)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw SyntaxError("JSON.parse")})}();

//
// ---------- UI HELPER FUNCTIONS ----------
//

// This function checks if script can write files.
// If it can, control is passed to onSuccess() callback.
// If it can't, the function helps user to enable the corresponding permission
// by showing an alert and opening Properties window.
// If permission still is not granted, instead of creating the script's panel
// it will show a panel with a text describing the situation, and a button that opens Properties window.
// Finally, when permission is granted, text & button are removed (panel is cleaned), and the script continues
// (normal panel is shown by passing control to onSuccess()).
function ensureCanWriteFiles(panel, onSuccess) {
    const kMainPrefSection = "Main Pref Section";
    const kPrefScriptingFileNetworkSecurity =
        "Pref_SCRIPTING_FILE_NETWORK_SECURITY";

    function checkPermissions() {
        return (
            app.preferences.getPrefAsLong(
                kMainPrefSection,
                kPrefScriptingFileNetworkSecurity
            ) == 1
        );
    }

    var alertText =
        "This script requires to write files. Please enable the\n" +
        '"Allow Scripts to Write Files and Access Network"\n' +
        "setting in Preferences > Scripting & Expressions.";

    function openPreferencesAndWait() {
        // This opens the "Scripting & Expressions" panel in AE Preferences window
        // And wait until the window is closed
        app.executeCommand(3131);
    }

    // If permissions are granted
    if (checkPermissions()) {
        onSuccess();
        return;
    }

    // Otherwise, prompt user to grant permissions
    alert(alertText);
    openPreferencesAndWait();

    // Recheck permissions
    if (checkPermissions()) {
        onSuccess();
        return;
    }

    // Permissions still are not granted
    // Instead of building the script's main panel, we show
    // a text describing the situation, and a button that opens Properties window.
    // The button will recheck permissions, and pass control to the onSuccess callback

    // The separate fixPermissionsGroup is needed to easily remove text & button after success
    // to allow main script to work from the 'clean sheet'
    fixPermissionsGroup = panel.add("group", [0, 0, 300, 110]);
    fixPermissionsGroup.add("statictext", [0, 0, 300, 50], alertText, {
        multiline: true,
    });
    openPreferencesButton = fixPermissionsGroup.add(
        "button",
        [5, 50, 100, 80],
        "Open Preferences"
    );

    // This is a wrapper callback
    // it is needed because now we have to remove fixPermissionsGroup
    function onSuccess2() {
        panel.remove(fixPermissionsGroup);

        // The panel was made wide because of the text,
        // this forces the panel to reset its size
        panel.preferredSize = { width: 0, height: 0 };
        panel.layout.layout(true);

        // Now we can call the user callback
        onSuccess();
    }

    openPreferencesButton.onClick = function () {
        // If permissions are already granted
        if (checkPermissions()) {
            onSuccess2();
            return;
        }

        // Otherwise, help user to grant permissions
        openPreferencesAndWait();

        // Recheck
        if (checkPermissions()) {
            onSuccess2();
        }
    };
}

// This function creates an array of 17 (16 + None) brushes that have colors matching those in AE Label groups
// Those brushes could then be used to build a color picker in UI
function makePaletteBrushes(window) {
    // prettier-ignore
    const labelColorsRGB = [
        [102, 102, 102],    // 0,  None
        [181,  56,  56],    // 1,  Red
        [228, 216,  76],    // 2,  Yellow
        [169, 203, 199],    // 3,  Aqua
        [229, 188, 201],    // 4,  Pink
        [169, 169, 202],    // 5,  Lavender
        [231, 193, 158],    // 6,  Peach
        [179, 199, 179],    // 7,  Sea Foam
        [103, 125, 224],    // 8,  Blue
        [ 74, 164,  76],    // 9,  Green
        [142,  44, 154],    // 10, Purple
        [232, 146,  13],    // 11, Orange
        [127,  69,  42],    // 12, Brown
        [244, 109, 214],    // 13, Fuchsia
        [ 61, 162, 165],    // 14, Cyan
        [168, 150, 119],    // 15, Sandstone
        [ 30,  64,  30],    // 16, Dark Green
    ];

    // Converts 0-255 color components to 0-1
    function RGB2Float(colorRGB) {
        return [colorRGB[0] / 256.0, colorRGB[1] / 256.0, colorRGB[2] / 256.0];
    }

    // Create a brush for each color
    var brushes = [];
    for (i in labelColorsRGB) {
        colorRGB = labelColorsRGB[i];
        colorFloat = RGB2Float(colorRGB);
        brush = window.graphics.newBrush(
            window.graphics.BrushType.SOLID_COLOR,
            colorFloat
        );
        brushes.push(brush);
    }

    return brushes;
}

// This transforms an existing button into a small square of the specified color
// This is used to make a color palette
function makeButtonPaletteColor(button, brushes, color_i) {
    button.preferredSize = "15,15";
    button.brush = brushes[color_i];

    button.onDraw = function () {
        with (this) {
            graphics.drawOSControl();
            graphics.rectPath(0, 0, size[0], size[1]);
            graphics.fillPath(brush);
        }
    };

    // This forces the button to redraw (with the new color)
    button.text = color_i;
}

// This creates a color picker consisting of 2 rows with 8 colored squares in each
// (Total 16 brushed, None is omitted)
// Function accepts callback onSelected = function (color_i) {} that is executed when a color is pressed
function makeColorPalette(window, brushes, onSelected) {
    var groupColor1 = window.add("group");
    var groupColor2 = window.add("group");

    for (var i = 1; i <= 16; i++) {
        // Whether to place button in first or second row
        parentGroup = i <= 8 ? groupColor1 : groupColor2;

        // Create a square colored button
        colorButton = parentGroup.add("button", undefined, "");
        makeButtonPaletteColor(colorButton, brushes, i);

        // This wrapper is needed to capture value of variable i
        function wrap_onClick(_i) {
            return function () {
                onSelected(_i);
            };
        }
        colorButton.onClick = wrap_onClick(i);
    }
}

// This is equivalent to a JS' String.trim()
// It removes leading & trailing whitespaces
function trimString(str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
}

// Apply template to the current layer - This runs when user clicks on an existing template
function applyTemplate(template) {
    alert(template.name + " " + template.color);
}

//
// ---------- PLUGIN UI ----------
//

var UID_templateCount = 0;
// Because templates are stored in a dictionary, we need a convenient way to assign a runtime-unique id to each Template
// This uses a static counter variable, and stores id Template object itself as attribute
// This way, if we need to delete template object from a dictionary, we easily get its key
function UID_get(template) {
    if (template.UID === undefined) {
        UID_templateCount += 1;
        template.UID = UID_templateCount;
    }

    return template.UID;
}

// Deep copy function
// This is needed to prevent modification of the original template
function copyToTemplate(source, target) {
    target.name = source.name;
    target.color = source.color;
}

// This function ensures that file is selected, then opens it with the required R/W mode
function openFile(save) {
    const sectionTag = scriptName;
    const keyTag = "dataFilePath";
    function getPathFromPrefs() {
        if (app.settings.haveSetting(sectionTag, keyTag)) {
            // Load path from saved Preferences
            var dataFilePath = app.settings.getSetting(sectionTag, keyTag);

            if (!dataFilePath) {
                return undefined;
            }

            // Create File object
            var file = File(dataFilePath);

            return file;
        } else {
            return undefined;
        }
    }

    function savePathToPrefs(file) {
        app.settings.saveSetting(sectionTag, keyTag, file.fsName);
    }

    function saveUndefToPrefs(file) {
        app.settings.saveSetting(sectionTag, keyTag, "");
    }

    function getPathFromUser() {
        if (save) {
            var file = File.saveDialog(
                "Select file to save templates to",
                "JSON:*.json,All files:*.*"
            );
        } else {
            var file = File.openDialog(
                "Select file to load templates from",
                "JSON:*.json,All files:*.*"
            );
        }

        if (!file) {
            return undefined;
        }

        // Correct file extension if needed
        if (!/\.(json)$/.test(file.name)) {
            file.rename(file.name + ".json");
        }

        return file;
    }

    function tryToOpen(file) {
        mode = save ? "w" : "r";
        if (file.open(mode)) {
            return file;
        } else {
            alert(
                "Unable to open " + scriptName + " file '" + file.fsName + "'!"
            );
            return undefined;
        }
    }

    // If there is some path in Prefs
    var file = getPathFromPrefs();
    if (file) {
        if (tryToOpen(file)) {
            return file;
        }
    }

    // Prompt user to specify path
    file = getPathFromUser();
    if (file && tryToOpen(file)) {
        savePathToPrefs(file);
        return file;
    }

    saveUndefToPrefs();

    return undefined;
}

function loadFromFile() {
    // Obtaining file object
    var file = openFile(false);
    if (!file) {
        alert("Templates were not loaded from a file!");
        return {};
    }

    // Reading (file is already open)
    dataStr = file.read();
    file.close();

    // Deserializing
    try {
        data = JSON.parse(dataStr);

        if (data.version != scriptVersion) {
            alert(
                "Version mismatch:\n" +
                    "\nscript version is " +
                    scriptVersion +
                    "\nversion in file is " +
                    data.version +
                    "\n\nTrying to load anyway..."
            );
        }

        newTemplates = {};
        loadedTemplates = data.templates;
        for (var i in loadedTemplates) {
            loadedTemplate = loadedTemplates[i];

            // Copying template to assign new UID
            newTemplate = {};
            copyToTemplate(loadedTemplate, newTemplate);

            // Adding new template to the collection
            newTemplate_UID = UID_get(newTemplate);
            newTemplates[newTemplate_UID] = newTemplate;
        }

        return newTemplates;
    } catch (e) {
        alert(
            "Error parsing " +
                scriptName +
                " file '" +
                file.fsName +
                "':\n" +
                e.toString()
        );
    }

    return {};
}

function saveToFile(templates) {
    // Obtaining file object
    var file = openFile(true);
    if (!file) {
        alert("Templates were not saved to a file!");
        // Return the same templates
        return templates;
    }

    // Serializing
    data = {
        version: scriptVersion,
        templates: templates,
    };
    dataStr = JSON.stringify(data, undefined, 4);

    // Writing (file is already open)
    file.write(dataStr);
    file.close();
}

// This shows a dialog that allows user to
//
// 1) isNew = true:     Create a new template
//    Dialogue shows Delete, Cancel & Save buttons
//    With corresponding callbacks onSave = function() {} and onDelete = function() {}
//
// 2) isNew = false:    Edit an existing template
//    Dialogue shows Cancel & Add buttons
//    With callback onAdd = function() {}
//
// Dialog would close if:
// 1) X is clicked
// 2) Esc is pressed
// 3) Alt+F4 is pressed
// 4) Delete, Cancel or Save / Add (with a valid template name) buttons are clicked
//
function buildUI_editTemplateDlg_show(
    paletteBrushes,
    template,
    isNew,
    onSaveAdd,
    onDelete
) {
    if (isNew) {
        title = "New template";
    } else {
        title = "Edit template '" + template.name + "'";
    }

    tempoTemplate = {};
    copyToTemplate(template, tempoTemplate);

    // Creates a new dialog box
    var dlg = new Window("dialog", title);

    // This is passed as a callback to buttons
    // It changes the template's color value and redraws the Selected color indicator
    function setTemplateColor(color_i) {
        if (color_i < 0 || color_i > 16) {
            alert("Unexpected error: wrong color index: " + color_i);
            return;
        }
        tempoTemplate.color = color_i;
        makeButtonPaletteColor(dlg.colorField, paletteBrushes, color_i);
    }

    // This is passed as a callback to the Delete button
    // It invokes the corresponding external callback and closes the dialogue
    function doDeleteTemplate() {
        onDelete();
        dlg.close();
    }

    // This is passed as a callback to the Cal button
    // It closes the dialogue
    function doCancelTemplate() {
        dlg.close();
    }

    // This is passed as a callback to Save / Add button
    // It changes the template name (if it is valid)
    // Then it invokes the corresponding external callback and closes the dialogue
    function doSaveAddTemplate() {
        selectedName = trimString(dlg.nameField.text);
        if (selectedName === "") {
            alert("Unexpected error: name is empty");
            return;
        }

        tempoTemplate.name = selectedName;

        // Apply edits to the original template object
        copyToTemplate(tempoTemplate, template);
        onSaveAdd();

        dlg.close();
    }

    // Creating a group will place Selected color & Name in a row layout
    var groupTop = dlg.add("group");

    // This square will show the currently selected color
    dlg.colorField = groupTop.add("button", undefined, "");
    makeButtonPaletteColor(dlg.colorField, paletteBrushes, tempoTemplate.color);
    // When pressed, it will reset the color to None (0)
    dlg.colorField.onClick = function () {
        setTemplateColor(0);
    };

    // This will allow user to edit the template's name
    // Pressing Enter in it serves as a convenient alternative to clicking the Add button
    // Both ways would only work if the name is valid (non-empty)
    dlg.nameFieldLabel = groupTop.add("statictext", undefined, "Name:");
    dlg.nameField = groupTop.add("edittext", undefined, tempoTemplate.name);
    dlg.nameField.active = true;
    dlg.nameField.preferredSize.width = 120;
    function checkNameValidity() {
        // This disables the Add button when the name is invalid
        isNameValid = trimString(dlg.nameField.text) != "";
        dlg.doSaveAddButton.enabled = isNameValid;
        return isNameValid;
    }
    dlg.nameField.addEventListener("keydown", function (kd) {
        if (kd.keyName === "Enter") {
            // React to the Enter being pressed in the editing field
            if (checkNameValidity()) {
                doSaveAddTemplate();
            }
        }
    });
    dlg.nameField.addEventListener("changing", function () {
        // React to the text in editing field being changed
        checkNameValidity();
    });

    // Color picker palette (two rows of 8+8=16 colors)
    makeColorPalette(dlg, paletteBrushes, function (color_i) {
        // When the color is clicked, it will change the template's color to the corresponding number
        setTemplateColor(color_i);
    });

    // Creating a group will place Delete, Cancel & Save / Add buttons in a row layout
    var groupButtons = dlg.add("group");

    if (!isNew) {
        // Delete button
        dlg.deleteButton = groupButtons.add("button", undefined, "Delete");
        dlg.deleteButton.onClick = function () {
            doDeleteTemplate();
        };
    }

    // Cancel button
    dlg.cancelButton = groupButtons.add("button", undefined, "Cancel");
    dlg.cancelButton.onClick = function () {
        doCancelTemplate();
    };

    // Save / Add template button
    dlg.doSaveAddButton = groupButtons.add(
        "button",
        undefined,
        isNew ? "Add" : "Save"
    );
    dlg.doSaveAddButton.onClick = function () {
        doSaveAddTemplate();
    };
    // This is needed to disable New button if the initial name is empty
    // But enable it when editing because the existing template has a valid name
    checkNameValidity();

    // This opens a dialog box
    dlg.show();
}

// This shows a scripts main panel (dockable)
function buildUI_mainPanel(panel) {
    panel.preferredSize = { width: 205, height: 240 };
    panel.layout.layout(true);

    // Creates a set of brushes used to paint colored buttons
    var paletteBrushes = makePaletteBrushes(panel);

    // This creates a button that allow the user to add new templates
    // It will open a dialog box where the user will specify template's name and (optionally) color
    panel.addButton = panel.add("button", [5, 5, 50, 35], "New");

    // This is wrapper group for an actual panel that contains template buttons
    // This way, instead of deleting many children (buttons) from panel,
    // we delete the panel itself (one child), and then recreate it in this group
    var templateButtonsGroup = panel.add("group", [5, 40, 205, 240]);

    // This is the dictionary that stores template objects, we retrieve it from saved copy
    // Template's UID is used as a key to allow easy deleting
    // For details see the UID_get() function's comments
    var templates = loadFromFile();

    // This deletes the existing template buttons, and (re)creates them from the templates{} dict
    function recreateButtons() {
        prev_panel = templateButtonsGroup.children[0];
        if (prev_panel !== undefined) {
            templateButtonsGroup.remove(prev_panel); // Delete the existing panel
        }
        // And (re)creates the panel (see templateButtonsGroup's group comments)
        var templateButtonsPanel = templateButtonsGroup.add(
            "panel",
            [0, 0, 200, 400]
        );

        // This counter provides the index for each template button
        // Note that it may differ from the template's UID
        cnt = 0;
        for (template_UID in templates) {
            cnt += 1;
            currentTemplate = templates[template_UID];

            // This places buttons in a column
            // May be replaced in future by a more complex and customizable layout
            buttonOffsetY = (cnt - 1) * 35;
            buttonPosition = [5, 10 + buttonOffsetY, 150, 40 + buttonOffsetY];
            buttonText =
                currentTemplate.name + " (" + currentTemplate.color + ")";
            var button = templateButtonsPanel.add(
                "button",
                buttonPosition,
                buttonText
            );

            // This wrapper is needed to capture value of variable template
            function wrap_onClick(clicked_template) {
                return function () {
                    applyTemplate(clicked_template);
                };
            }
            button.onClick = wrap_onClick(currentTemplate);

            // This wrapper is needed to capture value of variable current_template
            function wrap_onRightClick(right_clicked_template) {
                return function (event) {
                    if (event.button == 2) {
                        // Right click
                        // This will open a dialog in the 'Edit existing' mode
                        // It will be able to modify the existing template object
                        // But this is not done by it unless Save is clicked
                        buildUI_editTemplateDlg_show(
                            paletteBrushes,
                            right_clicked_template,
                            false, // Template is not new
                            // onSave callback
                            function (_same_template) {
                                // The original template object will be modified
                                // Redraw template buttons list
                                recreateButtons();

                                // Update saved copy
                                saveToFile(templates);
                            },
                            // onDelete callback
                            function () {
                                // Delete template from a dictionary
                                right_clicked_template_UID = UID_get(
                                    right_clicked_template
                                );
                                delete templates[right_clicked_template_UID];

                                // Update buttons list
                                recreateButtons();

                                // Update saved copy
                                saveToFile(templates);
                            }
                        );
                    }
                };
            }
            button.addEventListener(
                "click",
                wrap_onRightClick(currentTemplate)
            );
        }
    }

    // Pressing this will open a dialogue that will allow the user to create a new template
    panel.addButton.onClick = function () {
        newTemplate = {
            name: "",
            color: 0, // None
        };

        buildUI_editTemplateDlg_show(
            paletteBrushes,
            newTemplate,
            true, // Template is new
            function () {
                // Adding new template to the collection
                templates[UID_get(newTemplate)] = newTemplate;

                // Update buttons list
                recreateButtons();

                // Update saved copy
                saveToFile(templates);
            }
        );
    };

    recreateButtons();
}

//
// ---------- PLUGIN ENTRY POINT ----------
//

(function LayersRenamer(rootObject) {
    const windowTitle = "Layers Renamer";
    panel =
        rootObject instanceof Panel
            ? rootObject
            : new Window("palette", windowTitle, undefined, {
                  resizeable: true,
              });

    ensureCanWriteFiles(panel, function () {
        buildUI_mainPanel(panel);
    });

    if (panel.toString() == "[object Panel]") {
        panel;
    } else {
        panel.show(); // This allows to run script "externally"
        return 0;
    }
})(this);
