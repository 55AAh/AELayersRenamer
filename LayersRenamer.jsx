var scriptName = "LayersRenamer";
var scriptVersion = "0.2";

//
// ---------- MINIFIED json2.js ----------
//

// prettier-ignore
// cSpell: disable-next-line
"object"!=typeof JSON&&(JSON={}),function(){"use strict";var gap,indent,meta,rep,rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function f(t){return t<10?"0"+t:t}function this_value(){return this.valueOf()}function quote(t){return rx_escapable.lastIndex=0,rx_escapable.test(t)?'"'+t.replace(rx_escapable,function(t){var e=meta[t];return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}function str(t,e){var n,o,f,u,r,$=gap,i=e[t];switch(i&&"object"==typeof i&&"function"==typeof i.toJSON&&(i=i.toJSON(t)),"function"==typeof rep&&(i=rep.call(e,t,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,r=[],"[object Array]"===Object.prototype.toString.apply(i)){for(n=0,u=i.length;n<u;n+=1)r[n]=str(n,i)||"null";return f=0===r.length?"[]":gap?"[\n"+gap+r.join(",\n"+gap)+"\n"+$+"]":"["+r.join(",")+"]",gap=$,f}if(rep&&"object"==typeof rep)for(n=0,u=rep.length;n<u;n+=1)"string"==typeof rep[n]&&(f=str(o=rep[n],i))&&r.push(quote(o)+(gap?": ":":")+f);else for(o in i)Object.prototype.hasOwnProperty.call(i,o)&&(f=str(o,i))&&r.push(quote(o)+(gap?": ":":")+f);return f=0===r.length?"{}":gap?"{\n"+gap+r.join(",\n"+gap)+"\n"+$+"}":"{"+r.join(",")+"}",gap=$,f}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},Boolean.prototype.toJSON=this_value,Number.prototype.toJSON=this_value,String.prototype.toJSON=this_value),"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,n){var o;if(gap="",indent="","number"==typeof n)for(o=0;o<n;o+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw Error("JSON.stringify");return str("",{"":t})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){var j;function walk(t,e){var n,o,f=t[e];if(f&&"object"==typeof f)for(n in f)Object.prototype.hasOwnProperty.call(f,n)&&(void 0!==(o=walk(f,n))?f[n]=o:delete f[n]);return reviver.call(t,e,f)}if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw SyntaxError("JSON.parse")})}();

//
// ---------- UI HELPER FUNCTIONS ----------
//

// Object.keys implementation
if (!Object.keys) {
    Object.keys = function (object) {
        if (Object(object) !== object) {
            throw new TypeError("Object.keys can only be called on Objects.");
        }
        var hasOwnProperty = Object.prototype.hasOwnProperty;
        var result = [];
        for (var prop in object) {
            if (hasOwnProperty.call(object, prop)) {
                result.push(prop);
            }
        }
        return result;
    };
}

// This flag is needed to correctly draw GUI
var isDockable = false;

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
    for (var i = 0; i < labelColorsRGB.length; i++) {
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

// This could be used in onDraw()
function drawRoundedRect(graphics, brush, width, height, corner, x, y) {
    graphics.newPath();
    graphics.ellipsePath(x, y, corner, corner);
    graphics.fillPath(brush);
    graphics.ellipsePath(width - x - corner, y, corner, corner);
    graphics.fillPath(brush);
    graphics.ellipsePath(
        width - x - corner,
        height - y - corner,
        corner,
        corner
    );
    graphics.fillPath(brush);
    graphics.ellipsePath(x, height - y - corner, corner, corner);
    graphics.fillPath(brush);
    graphics.newPath();

    var coords = [
        [x, y + corner / 2],
        [x + corner / 2, y],
        [width - x - corner / 2, y],
        [width - x, y + corner / 2],
        [width - x, height - y - corner / 2],
        [width - x - corner / 2, height - y],
        [x + corner / 2, height - y],
        [x, height - y - corner / 2],
    ];

    graphics.moveTo(coords[0][0], coords[0][1]);

    for (i = 1; i <= coords.length - 1; i++) {
        graphics.lineTo(coords[i][0], coords[i][1]);
    }

    graphics.fillPath(brush);
}

// This is equivalent to a JS' String.trim()
// It removes leading & trailing whitespaces
function trimString(str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
}

// Apply template to the current layer - This runs when user clicks on an existing template
function applyTemplate(template) {
    var comp = app.project.activeItem;
    if (comp && comp instanceof CompItem) {
        var selectedLayers = comp.selectedLayers;
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            layer.name = template.name;
            layer.label = template.color;
        }
    }
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
    target.column = source.column;
}

var wasSaved = false;
var currentFileVersion = 0;

var fileSectionTag = scriptName;
var fileKeyTag = "dataFilePath";

// This function ensures that file is selected, then opens it with the required R/W mode
function openFile(save) {
    function getPathFromPrefs() {
        if (app.settings.haveSetting(fileSectionTag, fileKeyTag)) {
            // Load path from saved Preferences
            var dataFilePath = app.settings.getSetting(
                fileSectionTag,
                fileKeyTag
            );

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
        app.settings.saveSetting(fileSectionTag, fileKeyTag, file.fsName);
    }

    function saveUndefToPrefs(file) {
        app.settings.saveSetting(fileSectionTag, fileKeyTag, "");
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
        mode = save ? "a" : "r";
        if (file.open(mode)) {
            file.close();
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

// This effectively forgets the path to a file, leaving templates unsaved
function unlinkFile() {
    app.preferences.deletePref("Settings_" + fileSectionTag, fileKeyTag);
    wasSaved = false;
    currentFileVersion = 0;
}

function loadFromFile(checkFileVersion) {
    // Obtaining file object
    var file = openFile(false);
    if (!file) {
        alert("Templates were not loaded from a file!");
        return {};
    }

    // Reading
    file.open("r");
    dataStr = file.read();
    file.close();

    // This is needed to bypass version check on a newly created file
    if (checkFileVersion && !dataStr) {
        return currentFileVersion;
    }

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

        loadedFileVersion = data.fileVersion ? data.fileVersion : 0;
        if (checkFileVersion) {
            // If we are trying to check the version, then only return fileVersion
            return loadedFileVersion;
        } else {
            // Otherwise script will accept any version that is there
            currentFileVersion = loadedFileVersion;
        }

        loadedTemplates = data.templates;

        // Convert dict from v0.1 to list
        if (loadedTemplates.constructor.name == "Object") {
            var loadedBareTemplates = [];
            loadedTemplates_UIDs = Object.keys(loadedTemplates);
            for (var i = 0; i < loadedTemplates_UIDs.length; i++) {
                loadedTemplate_UID = loadedTemplates_UIDs[i];
                loadedTemplate = loadedTemplates[loadedTemplate_UID];

                // Copying to avoid modifying template
                var bareTemplate = {};
                copyToTemplate(loadedTemplate, bareTemplate);
                // We don't need to save UIDs
                delete bareTemplate.UID;

                loadedBareTemplates.push(bareTemplate);
            }
        } else {
            var loadedBareTemplates = loadedTemplates;
        }

        newTemplates = {};
        UID_templateCount = 0;
        for (var i = 0; i < loadedBareTemplates.length; i++) {
            var bareTemplate = loadedBareTemplates[i];

            // Copying to avoid modifying bareTemplate
            var newTemplate = {};
            copyToTemplate(bareTemplate, newTemplate);

            // Assigning UID to new template
            var newTemplate_UID = UID_get(newTemplate);
            newTemplates[newTemplate_UID] = newTemplate;
        }

        wasSaved = true;
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

    // Checking version
    var loadedFileVersion = loadFromFile(true);
    if (currentFileVersion != loadedFileVersion) {
        isBehind = currentFileVersion < loadedFileVersion;
        if (isBehind) {
            versionText =
                "a newer (" +
                loadedFileVersion +
                " > " +
                currentFileVersion +
                ")";
        } else {
            versionText =
                "an older (" +
                loadedFileVersion +
                " < " +
                currentFileVersion +
                ")";
        }
        alert(
            "Trying to save to a file that contains " +
                versionText +
                " version!"
        );

        discardLocalChanges = confirm("Do you want to discard local changes?");
        if (discardLocalChanges) {
            // Reloading from file, discarding changes
            currentFileVersion = 0;
            loadedTemplates = loadFromFile();
            return loadedTemplates;
        } else {
            doSaveToFile = confirm(
                "Do you want to overwrite file with local changes?"
            );
            if (doSaveToFile) {
                currentFileVersion = loadedFileVersion;
                // And then proceed to save
            } else {
                wasSaved = false;
                // Stay with local version
                return templates;
            }
        }
    }

    // Serializing
    var bareTemplates = [];
    templates_UIDs = Object.keys(templates);
    for (var i = 0; i < templates_UIDs.length; i++) {
        var template_UID = templates_UIDs[i];
        var template = templates[template_UID];

        // Copying to avoid modifying template
        var bareTemplate = {};
        copyToTemplate(template, bareTemplate);
        // We don't need to save UIDs
        delete bareTemplate.UID;

        bareTemplates.push(bareTemplate);
    }

    currentFileVersion += 1;
    data = {
        version: scriptVersion,
        fileVersion: currentFileVersion,
        templates: bareTemplates,
    };
    dataStr = JSON.stringify(data, undefined, 4);

    // Writing
    file.open("w");
    file.write(dataStr);
    file.close();
    wasSaved = true;

    // Return the same templates
    return templates;
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
    // GUI customization
    var usePanels = false;
    var templateButtonLRMargins = 10;
    var templateButtonUDMargins = 10;
    var templateButtonHeight = 40;

    // Useful values
    var usePanelsMargin = usePanels ? 2 * 2 : 0;
    var usePanelsTxt = usePanels ? "panel" : "group";

    // This is the dictionary that stores template objects, we retrieve it from saved copy
    // Template's UID is used as a key to allow easy deleting
    // For details see the UID_get() function's comments
    var templates = loadFromFile();

    // Splitting template buttons into columns based on specified values
    function splitTemplatesIntoColumns() {
        var columns = [];
        templates_UIDs = Object.keys(templates);
        for (var i = 0; i < templates_UIDs.length; i++) {
            template_UID = templates_UIDs[i];
            currentTemplate = templates[template_UID];

            var column = currentTemplate.column;
            column = column ? column : 1;

            while (column > columns.length) {
                columns.push([]);
            }

            columns[column - 1].push(currentTemplate);
        }

        return columns;
    }

    var columns = splitTemplatesIntoColumns();
    panel.preferredSize[0] = Math.max(
        170,
        (isDockable ? 0 : 30) + 100 * columns.length
    );
    panel.layout.layout(true);

    // Creates a set of brushes used to paint colored buttons
    var paletteBrushes = makePaletteBrushes(panel);

    // Main content group
    var contentGroup = panel.add(usePanelsTxt, [
        0,
        0,
        panel.size[0],
        panel.size[1],
    ]);

    // This group contains header
    var headerGroup = contentGroup.add(usePanelsTxt, [
        0,
        0,
        contentGroup.size[0],
        0,
    ]);

    // This group contains control buttons
    var controlButtonsGroup = headerGroup.add(usePanelsTxt, [
        0,
        0,
        0,
        40 + usePanelsMargin,
    ]);
    headerGroup.size[1] = controlButtonsGroup.size[1] + usePanelsMargin;

    // This creates a button that allow the user to add new templates
    // It will open a dialog box where the user will specify template's name and (optionally) color
    var _x = 5;
    controlButtonsGroup.addButton = controlButtonsGroup.add(
        "button",
        [_x, 5, _x + 25, 35],
        "+"
    );
    _x += controlButtonsGroup.addButton.size[0];

    // This creates a button that will reload file from saved copy
    _x += 5;
    controlButtonsGroup.reloadSavedCopyButton = controlButtonsGroup.add(
        "button",
        [_x, 5, _x + 25, 35],
        "R"
    );
    _x += controlButtonsGroup.reloadSavedCopyButton.size[0];

    // This creates a button that will change the path to a file
    _x += 5;
    controlButtonsGroup.unlinkButton = controlButtonsGroup.add(
        "button",
        [_x, 5, _x + 25, 35],
        "X"
    );
    _x += controlButtonsGroup.unlinkButton.size[0];
    controlButtonsGroup.size[0] = _x + 5 + usePanelsMargin;

    // This creates a text that will indicate whether local version was saved to file
    headerGroup.wasSavedText = headerGroup.add(
        "statictext",
        [0, 5 + usePanelsMargin, 45, 35],
        ""
    );

    // This is wrapper group for an actual inner group that contains template buttons
    // This way, instead of deleting many children (buttons) from contentGroup,
    // we delete the inner group itself (one child), and then recreate it in wrapper group
    var templateButtonsGroup = contentGroup.add(usePanelsTxt, [
        0,
        headerGroup.size[1],
        0,
        0,
    ]);

    // This deletes the existing template buttons, and (re)creates them from the templates{} dict
    function rebuildUI() {
        headerGroup.wasSavedText.text = wasSaved ? "" : "Unsaved";

        // Deletes the existing inner group if it exists
        prevInner = templateButtonsGroup.children[0];
        if (prevInner !== undefined) {
            templateButtonsGroup.remove(prevInner);
        }
        // And (re)creates the panel (see templateButtonsGroup's comments)
        var templateButtonsInnerGroup = templateButtonsGroup.add(
            usePanelsTxt,
            [0, 0, 0, 0]
        );

        columns = splitTemplatesIntoColumns();

        // Calculating the number in the biggest column
        var columnsCount = columns.length;
        var rowsCount = 0;
        for (var j = 0; j < columnsCount; j++) {
            buttonsInColumn = columns[j].length;
            if (buttonsInColumn > rowsCount) {
                rowsCount = buttonsInColumn;
            }
        }

        // Adjusting sizes
        var totalButtonsHeight =
            templateButtonUDMargins +
            (templateButtonUDMargins + templateButtonHeight) * rowsCount;

        contentGroup.size[0] =
            panel.size[0] -
            usePanelsMargin -
            (isDockable ? 0 : 30) -
            (usePanels ? 0 : 3);
        templateButtonsGroup.size[0] = headerGroup.size[0] =
            contentGroup.size[0] - usePanelsMargin;
        controlButtonsGroup.location.x =
            (headerGroup.size[0] -
                usePanelsMargin -
                controlButtonsGroup.size[0]) /
            2;
        headerGroup.wasSavedText.location[0] =
            controlButtonsGroup.location.x + controlButtonsGroup.size[0] + 5;
        templateButtonsInnerGroup.size[0] =
            templateButtonsGroup.size[0] - usePanelsMargin;

        templateButtonsInnerGroup.size[1] =
            totalButtonsHeight + usePanelsMargin * 2;
        templateButtonsGroup.size[1] =
            templateButtonsInnerGroup.size[1] + usePanelsMargin;
        contentGroup.size[1] =
            headerGroup.size[1] +
            templateButtonsGroup.size[1] +
            usePanelsMargin;

        // Resizing panel
        panel.size[1] = contentGroup.size[1] + (isDockable ? 0 : 30);
        // For some weird reason, this specific object becomes invalid, so we have to obtain it again
        templateButtonsInnerGroup = templateButtonsGroup.children[0];

        // The black pen will be used for buttons' text
        var blackPen = panel.graphics.newPen(
            panel.graphics.PenType.SOLID_COLOR,
            [0, 0, 0, 1],
            1
        );

        var columnWidth =
            (templateButtonsInnerGroup.size[0] -
                usePanelsMargin -
                templateButtonLRMargins) /
                columnsCount -
            templateButtonLRMargins;
        for (var j = 0; j < columnsCount; j++) {
            var columnOffsetX =
                templateButtonLRMargins +
                (columnWidth + templateButtonLRMargins) * j;
            var templateButtonsColumnGroup = templateButtonsInnerGroup.add(
                usePanelsTxt,
                [
                    columnOffsetX,
                    0,
                    columnOffsetX + columnWidth,
                    totalButtonsHeight + usePanelsMargin,
                ]
            );

            var column = columns[j];
            for (var i = 0; i < column.length; i++) {
                currentTemplate = column[i];

                // This places buttons in a column
                // May be replaced in future by a more complex and customizable layout
                buttonOffsetY =
                    templateButtonUDMargins +
                    (templateButtonUDMargins + templateButtonHeight) * i;
                buttonText = currentTemplate.name;
                var button = templateButtonsColumnGroup.add(
                    "button",
                    [
                        0,
                        buttonOffsetY,
                        templateButtonsColumnGroup.size[0] - usePanelsMargin,
                        buttonOffsetY + templateButtonHeight,
                    ],
                    buttonText
                );

                function wrap_onDraw(_color_i) {
                    return function () {
                        with (this) {
                            graphics.drawOSControl();
                            var brush = paletteBrushes[_color_i];
                            var textSize = graphics.measureString(text);
                            drawRoundedRect(
                                graphics,
                                brush,
                                size.width,
                                size.height,
                                15,
                                0,
                                0
                            );
                            graphics.drawString(
                                text,
                                blackPen,
                                (size.width - textSize.width) / 2,
                                size.height / 2 -
                                    textSize[1] +
                                    (text.length == 1 ? 6 : 0)
                            );
                        }
                    };
                }

                button.onDraw = wrap_onDraw(currentTemplate.color);

                // This wrapper is needed to capture value of variable template
                function wrap_onClick(clicked_template) {
                    return function () {
                        applyTemplate(clicked_template);
                    };
                }
                button.onClick = wrap_onClick(currentTemplate);

                // This wrapper is needed to capture value of variable current_template
                function wrap_onRightClick(clicked_template) {
                    return function (event) {
                        if (event.button == 2) {
                            // Right click
                            // This will open a dialog in the 'Edit existing' mode
                            // It will be able to modify the existing template object
                            // But this is not done by it unless Save is clicked
                            buildUI_editTemplateDlg_show(
                                paletteBrushes,
                                clicked_template,
                                false, // Template is not new
                                // onSave callback
                                function (_same_template) {
                                    // The original template object will be modified
                                    // Update saved copy or discard changes
                                    templates = saveToFile(templates);

                                    // Update buttons list
                                    rebuildUI();
                                },
                                // onDelete callback
                                function () {
                                    // Delete template from a dictionary
                                    clicked_template_UID =
                                        UID_get(clicked_template);
                                    delete templates[clicked_template_UID];

                                    // Update saved copy or discard changes
                                    templates = saveToFile(templates);

                                    // Update buttons list
                                    rebuildUI();
                                }
                            );
                        } else if (event.button == 1) {
                            // Middle click
                            // This will open a prompt to enter new column number
                            var maxColumnsCount = 10;
                            var newColumnStr = prompt(
                                "Please enter new column number",
                                "1",
                                "Move to a different column"
                            );
                            newColumnStr = trimString(newColumnStr);
                            if (newColumnStr) {
                                newColumn = parseInt(newColumnStr);
                                if (
                                    newColumn &&
                                    "" + newColumn == newColumnStr &&
                                    newColumn >= 1 &&
                                    newColumn <= maxColumnsCount
                                ) {
                                    clicked_template.column = newColumn;

                                    // Update saved copy or discard changes
                                    templates = saveToFile(templates);

                                    // Update buttons list
                                    rebuildUI();
                                } else {
                                    alert(
                                        "Invalid column number: '" +
                                            newColumnStr +
                                            "'\nIt should be a number between 1 and " +
                                            maxColumnsCount
                                    );
                                }
                            }
                        }
                    };
                }
                button.addEventListener(
                    "click",
                    wrap_onRightClick(currentTemplate)
                );
            }
        }

        for (var i = 0; i < templates_UIDs.length; i++) {
            template_UID = templates_UIDs[i];
            currentTemplate = templates[template_UID];
        }
    }

    // Reacting to panel being resized
    panel.onResize = function () {
        rebuildUI();
    };

    // Pressing this will open a dialogue that will allow the user to create a new template
    controlButtonsGroup.addButton.onClick = function () {
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

                // Update saved copy or discard changes
                templates = saveToFile(templates);

                // Update buttons list
                rebuildUI();
            }
        );
    };

    controlButtonsGroup.reloadSavedCopyButton.onClick = function () {
        var newTemplates = loadFromFile();
        templates = newTemplates;
        rebuildUI();
    };

    controlButtonsGroup.unlinkButton.onClick = function () {
        unlinkFile();
        rebuildUI();
    };

    rebuildUI();
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

    isDockable = panel.toString() == "[object Panel]";

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
