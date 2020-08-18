/** Global variables and localized text. */
language = {
    "languages": {},
    "label": {},
    "message": {}
}

language.languages = {
    "pt-BR": "Português",
    "en": "English"
}

language.label["pt-BR"] = {
    "languageLabel": "Idioma:"
};
language.label["en"] = {
    "languageLabel": "Language:"
};

language.message["pt-BR"] = {
    "cleanUp": "Tem certeza que deseja apagar o workspace"
};
language.message["en"] = {
    "cleanUp": "Are you sure you want to delete the workspace"
};

/**
 * Translates the application interface.
 * @param {string}   selectedLanguage - Selected language.
 * @return {string}  Interface translated to the selected language.
 */
function translate(selectedLanguage) {
    var languageLabels = language.label[selectedLanguage];
    for (var i in languageLabels) {
        var element = document.getElementById(i);
        if (element) {
            element.innerHTML = languageLabels[i];
        }
    }
}

/**
 * Installs the selected language.
 * @param {string}   selectedLanguage - Selected language..
 * @param {string}   id - Select control id.
 * @return {string}  Interface translated to the selected language.
 */
function installLanguages(selectedLanguage, id) {
    var list = "";
    for (var i in language.languages) {
        if (i == selectedLanguage) {
            list = list + '<option value="' + i + '" selected="selected">' + language.languages[i] + '</option>';
        } else {
            list = list + '<option value="' + i + '">' + language.languages[i] + '</option>';
        }
    }
    
    document.getElementById(id).innerHTML = list;
}
