/**
 * Multilingualization library class
 *
 * @class Multilingualization
 */
export default class Multilingualization {
    /**
     *  @var dictionaries Multilingual dictionary object
     */
    static dictionaries = {
        "en": {
            "Break": "#Break",
            "Minute": "min.",
            "Enter item name": "Enter item name",
            "Add item": "Add item",
            "Copy in Markdown": "Copy the tally in Markdown",
            "Delete logs": "Delete logs",
            "Table header": "Task Name | Task Time [Hours] | Task Time [Minutes]",
            "Work hours total": "Work hours total: ",
            "Total": "Total: "
        },
        "ja": {
            "Break": "#休憩",
            "Minute": "分",
            "Enter item name": "項目名を入力",
            "Add item": "追加",
            "Copy in Markdown": "Markdownで集計をコピー",
            "Delete logs": "ログ削除",
            "Table header": "業務名 | 作業時間[時] | 作業時間[分]",
            "Work hours total": "実働計：",
            "Total": "総計："
        }
    }

    /**
     * Get current language
     *
     * @returns {string} Current language
     */
    static language() {
        const lang = ((window.navigator.languages && window.navigator.languages[0]) ||
            window.navigator.language ||
            window.navigator.userLanguage ||
            window.navigator.browserLanguage).slice(0, 2);

        // Show English for undefined languages
        return this.dictionaries[lang] ? lang : "en";
    }

    /**
     * Get translated term
     *
     * @param {string} term Term to be translated
     * @returns {string} Translated term
     */
    static translate(term) {
        return this.dictionaries[this.language()][term];
    }

    /**
     * Initialization of dictionary object
     */
    static translateAll() {
        const dictionary = this.dictionaries[this.language()];
        for (let elem of document.querySelectorAll('[data-translate]')) {
            elem.innerHTML = dictionary[elem.dataset.translate];
        }
    }
}
